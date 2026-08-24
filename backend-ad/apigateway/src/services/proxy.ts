import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import config from "@/config";
import logger from "@/config/logger";
import { GatewayTimeoutError, ServiceUnavailableError } from "@/utils/error";

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

class CircuitBreaker {
  private failureCount = 0;
  private state: CircuitState = "CLOSED";
  private lastFailureTime: number | null = null;
  private nextAttempt = Date.now();

  constructor(
    private readonly serviceName: string,
    private readonly threshold = config.CIRCUIT_BREAKER_THRESHOLD,
    private readonly timeout = config.CIRCUIT_BREAKER_TIMEOUT,
  ) {}

  async execute<T>(request: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() < this.nextAttempt) {
        throw new ServiceUnavailableError(
          `${this.serviceName} service is currently unavailable, circuit breaker is open`,
        );
      }

      this.state = "HALF_OPEN";
      logger.info(`Circuit breaker for ${this.serviceName} is now HALF_OPEN`);
    }

    try {
      const response = await request();
      this.onSuccess();
      return response;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === "HALF_OPEN") {
      this.state = "CLOSED";
      logger.info(`Circuit breaker for ${this.serviceName} is now CLOSED`);
    }
  }

  private onFailure() {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.timeout;
      logger.warn(
        `Circuit breaker for ${this.serviceName} is now OPEN, next attempt at ${new Date(this.nextAttempt).toISOString()}`,
      );
    }
  }
}

const circuitBreakers: Record<string, CircuitBreaker> = {
  userservice: new CircuitBreaker("user-service"),
  paymentservice: new CircuitBreaker("payment-service"),
  searchservice: new CircuitBreaker("search-service"),
  bookingservice: new CircuitBreaker("booking-service"),
  notificationservice: new CircuitBreaker("notification-service"),
};

interface ForwardResult {
  status: number;
  data: unknown;
  headers: Record<string, string>;
}

const toForwardHeaders = (headers: Request["headers"]): Record<string, string> => {
  const forwarded: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === "host" || key.toLowerCase() === "content-length") {
      continue;
    }

    if (Array.isArray(value)) {
      forwarded[key] = value.join(",");
    } else if (typeof value === "string") {
      forwarded[key] = value;
    }
  }

  return forwarded;
};

async function forwardRequest(
  serviceUrl: string,
  path: string,
  method: string,
  data: unknown,
  headers: Request["headers"],
  breaker: CircuitBreaker,
): Promise<ForwardResult> {
  const url = `${serviceUrl}${path}`;

  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    timeout: config.SERVICE_TIMEOUT_MS,
    headers: toForwardHeaders(headers),
    validateStatus: (status) => status >= 200 && status < 500,
    maxRedirects: 5,
  };

  if (method !== "GET" && method !== "DELETE" && data) {
    requestConfig.data = data;
  }

  if ((method === "GET" || method === "DELETE") && data) {
    requestConfig.params = data;
  }

  try {
    const response = await breaker.execute(() => axios(requestConfig));
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
      throw new GatewayTimeoutError(`Request to ${url} timed out`);
    }

    if (axiosError.code === "ECONNREFUSED") {
      throw new ServiceUnavailableError(`Request to ${url} failed, service unavailable`);
    }

    if (axiosError.response) {
      return {
        status: axiosError.response.status,
        data: axiosError.response.data,
        headers: axiosError.response.headers as Record<string, string>,
      };
    }

    throw new ServiceUnavailableError(`Error forwarding request to ${url}: ${axiosError.message}`);
  }
}

export function createProxy(serviceName: string, serviceUrl: string): RequestHandler {
  const breaker = circuitBreakers[serviceName];

  if (!breaker) {
    throw new Error(`No circuit breaker configured for service ${serviceName}`);
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pathParts = req.path.split("/").filter(Boolean);
      const servicePath = `/${pathParts.slice(1).join("/")}`;
      const queryPath = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";

      const response = await forwardRequest(
        serviceUrl,
        `${servicePath}${queryPath}`,
        req.method,
        req.body,
        req.headers,
        breaker,
      );

      res.status(response.status).set(response.headers).json(response.data);
    } catch (error) {
      next(error);
    }
  };
}
