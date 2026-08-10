

Adapter design pattern is a structural design pattern that allows objects with incompatible interfaces to work together. It acts as a bridge between two incompatible interfaces by converting the interface of one class into an interface expected by the clients. This pattern is particularly useful when integrating new components into existing systems without modifying their code.


using redis : for caching and data storage

postgres database: for relational data storage and management prisma is used as an ORM (Object-Relational Mapping) tool to interact with the PostgreSQL database, providing a type-safe and efficient way to query and manipulate data.


sendgrid : for sending emails and managing email communications. It provides a reliable and scalable solution for email delivery, allowing applications to send transactional and marketing emails with ease.


bullmq : for message queuing and asynchronous processing. It enables applications to handle background tasks, distribute workloads, and improve overall system performance by decoupling the message producers from the consumers. node js que build on to of node.js, bullmq is a powerful library that provides a simple and efficient way to manage job queues and process tasks in the background.

dockerisation: for containerization and deployment. Docker allows applications to be packaged into lightweight, portable containers that can run consistently across different environments. It simplifies the deployment process, ensures consistency, and enhances scalability by isolating applications and their dependencies.

production ready: The system is designed to be production-ready, ensuring that it can handle real-world usage scenarios, scale effectively, and maintain high availability. It incorporates best practices for performance optimization, security, and reliability to meet the demands of production environments.

ec2 server: for hosting and running the application in a cloud environment. Amazon EC2 (Elastic Compute Cloud) provides scalable computing capacity, allowing applications to run on virtual servers with flexible configurations. It enables easy scaling, load balancing, and management of resources to meet varying workloads.

domain : buy domain and mapping with ec2 server: The application requires a domain name for easy access and branding. By purchasing a domain and mapping it to the EC2 server, users can access the application through a user-friendly URL, enhancing the overall user experience and providing a professional online presence.

reverse proxy using nginx: Nginx is used as a reverse proxy server to handle incoming requests and distribute them to the appropriate backend services. It improves performance, security, and scalability by managing traffic, caching content, and providing load balancing capabilities. Nginx also allows for SSL termination, ensuring secure communication between clients and the server.

ssl certificate: An SSL certificate is implemented to enable secure communication between the client and the server. It encrypts data transmitted over the network, protecting sensitive information from unauthorized access. By using SSL, the application ensures data integrity, confidentiality, and trustworthiness, enhancing user confidence in the system.