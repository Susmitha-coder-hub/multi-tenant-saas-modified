# Research & Requirements Analysis

## 1. Multi-Tenancy Analysis

### 1.1 Shared Database with Shared Schema
In the shared database with shared schema approach, all tenants use the same
database and the same set of tables. Tenant data is differentiated using a
`tenant_id` column that is present in every tenant-specific table such as
users, projects, and tasks.

When a request is made to the backend API, the system identifies the tenant
from the authenticated user's JWT token. This token contains the tenant_id,
which is then automatically applied as a filter to all database queries. As a
result, each tenant can only access records that belong to their own tenant_id.

This approach is widely used in modern SaaS applications because it is simple
to implement and cost-effective. Since only one database and one schema are
required, infrastructure costs are reduced and deployment becomes easier.
Database migrations can be applied once and will affect all tenants
consistently.

However, this approach also introduces certain risks. If tenant filtering is
incorrectly implemented or accidentally bypassed, data from one tenant could
be exposed to another. Therefore, strict query-level filtering, authorization
middleware, and comprehensive testing are critical to ensure proper data
isolation.

Despite these risks, when implemented correctly with strong security controls,
a shared database with shared schema provides a scalable and efficient solution
for multi-tenant SaaS platforms.


### 1.2 Shared Database with Separate Schema
In the shared database with separate schema approach, all tenants use the same
database server, but each tenant is assigned its own database schema. Each
schema contains its own set of tables such as users, projects, and tasks.

This model provides better data isolation compared to a shared schema because
each tenant’s data is stored separately at the schema level. Even if an
application-level query mistake occurs, cross-tenant data leakage is less
likely since schemas are logically separated.

From an operational perspective, this approach allows greater flexibility.
Database changes or migrations can be applied selectively to individual tenant
schemas if required. It also supports tenant-specific customizations more
easily than a fully shared schema model.

However, this approach increases operational complexity. Managing schema
creation, migrations, and updates for a large number of tenants can become
difficult. Automated tooling is required to ensure all schemas remain in sync.
Additionally, queries become more complex as the application must dynamically
select the correct schema for each tenant.

Due to this added complexity, this approach is generally more suitable for
medium-scale SaaS applications where stronger isolation is neede

### 1.3 Separate Database per Tenant
In the separate database per tenant approach, each tenant is provided with its
own dedicated database. All tenant-specific data is completely isolated at the
database level, offering the highest level of security and data separation.

This approach significantly reduces the risk of data leakage between tenants,
as there is no shared storage layer. It also allows tenants to have customized
database configurations, backups, and performance tuning based on their
individual needs.

However, this model comes with higher infrastructure and maintenance costs.
Each new tenant requires provisioning a new database instance, which increases
resource usage and operational overhead. Managing database migrations,
backups, monitoring, and scaling becomes more complex as the number of tenants
grows.

Due to these challenges, this approach is typically used by large enterprise
applications or systems handling highly sensitive data. For small to
medium-sized SaaS platforms, this model is often considered excessive and
cost-prohibitive.


### 1.4 Chosen Approach & Justification
For this project, the chosen multi-tenancy strategy is a shared database with a
shared schema using a `tenant_id` based isolation model.

This approach was selected because it best aligns with the goals of building a
scalable and cost-effective SaaS application. Using a single database and
schema simplifies deployment, reduces infrastructure costs, and makes database
migrations easier to manage. This is especially suitable for a containerized
environment using Docker, where simplicity and consistency are important.

Although this model introduces the risk of cross-tenant data exposure if not
implemented correctly, this risk is mitigated through strict backend controls.
Every authenticated request includes the tenant_id within the JWT token, and
this tenant_id is enforced at the query level for all database operations.
Additionally, role-based access control and authorization middleware ensure
that users cannot access data outside their permitted scope.

Given the scope of this project and its focus on demonstrating SaaS
architecture principles, the shared database with shared schema approach
provides the best balance between simplicity, security, and scalability.


---

## 2. Technology Stack Justification

### 2.1 Backend Framework
The backend of this application is built using Node.js with the Express
framework. Node.js was chosen due to its non-blocking, event-driven architecture,
which makes it highly suitable for building scalable APIs and handling multiple
concurrent requests efficiently.

Express provides a lightweight and flexible structure for building RESTful
APIs. It allows easy integration of middleware for authentication,
authorization, logging, and error handling. This makes it well-suited for a
multi-tenant SaaS application where request validation and tenant isolation
must be enforced consistently.

Alternative backend frameworks such as Django and Spring Boot were considered.
While Django offers rapid development and strong built-in features, it is more
monolithic and less flexible for microservice-style API development. Spring
Boot, although powerful and enterprise-ready, introduces additional complexity
and a steeper lear


### 2.2 Frontend Framework
The frontend of the application is developed using React. React was chosen
because it enables the creation of reusable UI components and provides
efficient state management for dynamic user interfaces.

React’s component-based architecture makes it easier to manage complex views
such as dashboards, role-based screens, and tenant-specific data displays. It
also integrates well with REST APIs and supports modern frontend development
patterns.

Alternative frontend technologies such as Angular and Vue.js were evaluated.
Angular provides a complete framework but can be overly complex for smaller
applications. Vue.js is lightweight and easy to learn but has a smaller
ecosystem compared to React.

React’s strong community support, extensive ecosystem, and flexibility make it
a suitable choice for building scalable SaaS user interfaces.


### 2.3 Database
PostgreSQL is used as the primary database for this application. It was chosen
because it is a reliable, open-source relational database that provides strong
support for data consistency, indexing, and complex queries.

PostgreSQL works well with a shared schema multi-tenancy model by allowing
efficient filtering using indexed tenant_id columns. It also supports advanced
features such as JSON fields, transactions, and row-level security, which are
useful for SaaS applications.

Alternative databases such as MySQL and MongoDB were considered. MySQL offers
good performance but fewer advanced features compared to PostgreSQL. MongoDB,
being a NoSQL database, is less suitable for relational data and strict
consistency requirements.

PostgreSQL provides the right balance of performance, scalability, and data
integrity for this project.


### 2.4 Authentication Method
JWT (JSON Web Tokens) is used for authentication in this application. JWT was
chosen because it is stateless, scalable, and well-suited for RESTful APIs.

Upon successful login, a JWT token is generated and sent to the client. This
token contains user information such as user_id, role, and tenant_id. The
backend verifies the token on every request to ensure the user is authenticated
and authorized.

Alternative authentication methods such as session-based authentication were
considered. However, session-based systems require server-side storage and are
less scalable in distributed environments.

JWT provides a secure and efficient authentication mechanism for a multi-tenant
SaaS application.

### 2.5 Deployment Platform
The application is deployed using Docker and Docker Compose. Docker enables the
application to run in a consistent environment across development, testing, and
production.

Docker Compose is used to define and manage multiple services such as the
backend API, frontend application, and database. This simplifies setup and
ensures all components work together seamlessly.

Alternative deployment approaches such as traditional VM-based deployment were
considered but rejected due to higher setup complexity and reduced portability.

Docker-based deployment improves reproducibility, scalability, and ease of
maintenance.


---

## 3. Security Considerations

### 3.1 Data Isolation Strategy

Data isolation is enforced using a tenant_id-based approach. Every
tenant-specific database table includes a tenant_id column, which is used to
segregate data between tenants.

The tenant_id is extracted from the authenticated user’s JWT token and applied
to all database queries. This ensures that users can only access data belonging
to their own tenant.

This approach provides logical isolation while maintaining a shared database
architecture.


### 3.2 Authentication & Authorization
Authentication is handled using JWT tokens, ensuring that only authenticated
users can access protected API endpoints.

Authorization is implemented using role-based access control (RBAC). Different
roles such as super_admin, tenant_admin, and user have different permissions
within the system.

Middleware is used to validate both authentication and authorization before
processing requests.


### 3.3 Password Hashing Strategy
User passwords are securely stored using hashing algorithms such as bcrypt.
Plain-text passwords are never stored in the database.

During user registration, passwords are hashed before being saved. During
login, the entered password is compared with the stored hash to verify
credentials.

This approach protects user credentials even if the database is compromised.


### 3.4 API Security Measures
API security is enforced using authentication middleware, input validation, and
proper error handling. Unauthorized requests are rejected early in the request
pipeline.

Rate limiting and request validation help protect the API from abuse and
malicious attacks.

All sensitive endpoints require valid authentication tokens.


### 3.5 Audit Logging
Audit logging is implemented to track critical system actions such as user
logins, data modifications, and administrative operations.

Logs include information such as user_id, tenant_id, action performed, and
timestamp. This improves traceability and helps with debugging and security
monitoring.

Audit logs are essential for maintaining accountability in a multi-tenant SaaS
environment.
