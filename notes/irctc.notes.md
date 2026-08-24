the use of docker

You’re right, I’ll relocate the compose file into the backend folder and adjust paths so it works from there, then I’ll explain clearly what docker compose is used for in this project.

Read [](file:///Users/ami/Desktop/findings/backend-lab/docker-compose.yml)

Read [](file:///Users/ami/Desktop/findings/backend-lab/irctc-backend)

I’ve confirmed the current compose config; next I’m creating a corrected copy in the backend folder and removing the root one so there is a single source of truth.

Created [](file:///Users/ami/Desktop/findings/backend-lab/irctc-backend/docker-compose.yml)

Generating patch (3 lines) in [](file:///Users/ami/Desktop/findings/backend-lab/docker-compose.yml)

I’ve moved it and updated the build path; I’ll quickly verify file placement so you can run it directly from the backend folder.

Read [](file:///Users/ami/Desktop/findings/backend-lab)

Read [](file:///Users/ami/Desktop/findings/backend-lab/irctc-backend)

Done, it is now inside the backend folder at docker-compose.yml. I also removed the root-level compose file and fixed the build context to user-service.

What docker-compose is used for:
1. It defines how one or more containers should run together.
2. It stores container settings in one place:
- Build path
- Port mapping
- Environment variables
- Restart policy
3. It gives a single command to start your stack instead of long docker run commands.
4. It scales well when you add booking, payment, and search services later.

In your current setup:
1. Compose builds the image from Dockerfile.
2. Runs it as container irctc-user-service.
3. Exposes app port 3000 to your machine.
4. Sets PORT=3000 inside the container.

How to run now:
1. cd /Users/ami/Desktop/findings/backend-lab/irctc-backend
2. docker compose up --build

Natural next step:
1. Add placeholder services in docker-compose.yml for booking-service, payment-service, and search-service so they are ready as you implement them.

Made changes.

if we using docker in our project, its used for:
- Containerizing our services so they run consistently across different environments.
- Simplifying the setup process for development and production.
- Managing dependencies and environment configurations in a standardized way.
- Enabling easy scaling and orchestration of multiple services with docker-compose.

the use of dockerization:
if we building an ecommerce we need an laptop. also wee decided an techstack. so we installed all the dependencies and we are ready to run our project. but if we want to run our project in another machine, we need to install all the dependencies again and also we need to setup the environment variables. so it will take a lot of time. so we can use dockerization. dockerization is a process of creating a docker image of our project which contains all the dependencies and environment variables. so we can run our project in any machine without installing any dependencies and setting up environment variables.

sometime the code will crash due to 
version mismatch
dependency mismatch
os mismatch

so we can use dockerization to avoid these issues. dockerization will create a container of our project which will run in any machine without any issues.


user service+ dependencies on a package we can use dockerization to avoid these issues. dockerization will create a container of our project which will run in any machine without any issues. inside the container we can install all the dependencies and setup environment variables. so we can run our project in any machine without installing any dependencies and setting up environment variables. we share the image with others. because of this, everyone can run the project in a consistent environment.


we pull the image from docker hub and run the container in any machine. so we can avoid version mismatch, dependency mismatch, os mismatch issues. dockerization will create a container of our project which will run in any machine without any issues. inside the container we can install all the dependencies and setup environment variables. so we can run our project in any machine without installing any dependencies and setting up environment variables. we share the image with others. because of this, everyone can run the project in a consistent environment.


docker compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

docker compose up command is used to start the services defined in the docker-compose.yml file. It builds the images (if necessary) and starts the containers as specified in the configuration.


services show list of containeresthat we need to run

docker compose down command is used to stop and remove the containers, networks, and volumes defined in the docker-compose.yml file. It stops the running containers and removes them along with any associated networks and volumes that were created by the compose file.


docker compose up --build command is used to build the images (if necessary) and start the containers as specified in the configuration. It is useful when you have made changes to the Dockerfile or the application code and want to rebuild the images before starting the containers.

docker compose up to start the services defined in the docker-compose.yml file. It builds the images (if necessary) and starts the containers as specified in the configuration.


npx prisma init --datasource-provider postgresql command is used to initialize a new Prisma project with a PostgreSQL datasource. It creates a new Prisma schema file (schema.prisma) and sets up the necessary configuration for connecting to a PostgreSQL database. This command is useful when you want to start using Prisma with a PostgreSQL database in your project.

npx prisma migrate dev --name init command is used to create a new migration and apply it to the database in a development environment. The --name init option specifies the name of the migration, which in this case is "init". This command generates SQL migration files based on the changes made to the Prisma schema and applies them to the connected database. It is useful for managing database schema changes during development.



google authentication implementation:

google auth 2.0 is a protocol that allows users to authenticate with their Google account and authorize third-party applications to access their data. It provides a secure and standardized way for users to log in to applications without having to create a new account or remember additional passwords. It provides for both authorization flow and authentication flow. It allows users to grant permissions to applications to access their Google account data, such as email, contacts, and calendar events, without sharing their login credentials. This enables developers to build applications that can securely access user data while maintaining user privacy and security.

google identity services is a set of tools and APIs provided by Google that enable developers to integrate Google authentication and authorization into their applications. It includes features such as sign-in with Google, user profile management, and access control for Google APIs.


steps
user click signin with google button
google show different accounts
user select account
google returns id_token jwt to frontend
frontend send id_token to backend
backend verify id_token with google api
backend creates/find user and issues your own jwt access and refresh tokens



structure

{
    header:{
        alg: "RS256",
        kid: "f0e1d2c3b4a59687786958a7b6c5d4e3f2g1h0i",
        typ: "JWT"
    },
    payload:{
        iss: "https://accounts.google.com",
        sub: "1234567890",
        azp: "your-client-id.apps.googleusercontent.com",
        aud: "your-client-id.apps.googleusercontent.com",
        iat: 1620000000,
        exp: 1620003600,
        email: "user@example.com"
    }
}


in signup with otp we save itin synchronous way. it has the blocking nature. so if we have 1000 request at a time, it will take a lot of time to process all the requests. so we can use asynchronous way to save the data in database. we can use message queue like rabbitmq, kafka, etc. to save the data in database. so it will not block the main thread and it will process the requests in background. so it will improve the performance of the application.


we are using kafka .

usersignup request
user service generates otp
event sent to kafka (instant)
User gets immediate response
Notification service pickup the event
email sent via sendgrid
auto-retry on failure (3 attempts)

topics
notification.email.otp.  - otp verification code
notification.email.welcome - welcome email after successful signup

the format of the message sent to the topic is as follows:
Topic : notification.email.otp
Message:{
    "email": "",
    "otp": "",
    "ttlMinutes": 5
}


      KAFKA_BROKER_ID: 1 // Unique identifier for the Kafka broker
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181 // Connection string for the Zookeeper service
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT // Mapping of listener names to security protocols
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:9093 // List of listeners that the broker will advertise to clients
      // List of listeners that the broker will advertise to clients
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT // Name of the listener used for inter-broker communication
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1 // Replication factor for the offsets topic
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1 // Minimum number of in-sync replicas for the transaction state log
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1 // Replication factor for the transaction state log
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true" // Enable automatic topic creation



      prisma on amipk2001@gmail.com account



      redis cache implementation


      client ----> req----> server ----> db
      client ----> req----> server ----> cache ----> db

      redis is an in-memory data structure store that can be used as a cache to improve the performance of applications by reducing the number of database queries. It stores frequently accessed data in memory, allowing for faster retrieval compared to querying the database directly.

      db is slow because it has to read data from disk, which takes more time compared to reading data from memory. By using a cache like Redis, we can store frequently accessed data in memory, which allows for faster retrieval and reduces the load on the database.

      when a request is made to the server, the server first checks if the requested data is available in the cache. If it is, the server returns the data from the cache, which is much faster than querying the database. If the data is not available in the cache, the server queries the database, retrieves the data, and stores it in the cache for future requests.


      API GATEWAY

      the api gateway is a server that acts as an entry point for all client requests to the backend services. It handles routing, authentication, rate limiting, and other cross-cutting concerns. The API gateway can also aggregate responses from multiple services and return a single response to the client.


      we put auth mechanism auth.middleware.ts in api gateway. so all the requests will go through the api gateway and it will check if the request is authenticated or not. if the request is authenticated, it will forward the request to the respective service. if the request is not authenticated, it will return 401 unauthorized error.

      gateway is verify access token and navigate to the correct service. so we can put the auth middleware in the api gateway. so all the requests will go through the api gateway and it will check if the request is authenticated or not. if the request is authenticated, it will forward the request to the respective service. if the request is not authenticated, it will return 401 unauthorized error.



      circuit breaker implementation

      without circuit pbreaker
      - user service is down
      - gateway keeps trying to connect to user service
      - every request waits 30 seconds
      - gateway gets overloaded with waiting requests
      - gateway crashes due to overload
      - entire system goes down

      with circuit breaker
        - user service is down
        - first five requests fail and gateway opens the circuit
        - next requests fail fast and return 503 service unavailable
        - gateway stays healthy and can serve other requests
        - after 60 seconds circuit test if service is up
        - if service is up, circuit closes and gateway starts forwarding requests to user service