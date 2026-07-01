# Docker Setup Guide

## What is Docker?

Docker allows us to package an application and all required software into containers.

Benefits:

* Same environment for all developers
* Easy deployment
* No manual software installation
* Faster project setup

---

# Project Architecture

```text
+-------------------+
| Spring Boot       |
| Container         |
| Port 8080         |
+---------+---------+
          |
          |
          v
+-------------------+
| MySQL Container   |
| Port 3306         |
+-------------------+
```

Docker creates an internal network.

Containers communicate using service names.

Example:

```text
db
```

instead of

```text
localhost
```

---

# Dockerfile

Dockerfile describes how to build the backend image.

Example:

```dockerfile
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY backend/target/jobportal.jar jobportal.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","jobportal.jar"]
```

---

## Line by Line Explanation

### Base Image

```dockerfile
FROM eclipse-temurin:21-jre
```

Uses Java 21 Runtime Environment.

The container already contains Java.

---

### Working Directory

```dockerfile
WORKDIR /app
```

All following commands run inside:

```text
/app
```

---

### Copy JAR File

```dockerfile
COPY backend/target/jobportal.jar jobportal.jar
```

Copies the Spring Boot jar from local machine into the container.

Local:

```text
target/jobportal.jar
```

Container:

```text
/app/jobportal.jar
```

---

### Expose Port

```dockerfile
EXPOSE 8080
```

Documents that the application uses port 8080.

---

### Start Command

```dockerfile
ENTRYPOINT ["java","-jar","jobportal.jar"]
```

Starts Spring Boot automatically when the container starts.

---

# Docker Compose

Docker Compose manages multiple containers together.

Example:

```yaml
services:
  db:
    image: mysql:8.0

  backend:
    build: .
```

---

## MySQL Service

```yaml
db:
  image: mysql:8.0
```

Creates a MySQL container.

---

### Container Name

```yaml
container_name: jobportal
```

Container can be referenced as:

```bash
docker logs jobportal
```

---

### Environment Variables

```yaml
environment:
  MYSQL_ROOT_PASSWORD: example
  MYSQL_DATABASE: jobportaldb
  MYSQL_USER: jobportal
  MYSQL_PASSWORD: 12345
```

Creates:

Database:

```text
jobportaldb
```

User:

```text
jobportal
```

Password:

```text
12345
```

---

### Port Mapping

```yaml
ports:
  - "3307:3306"
```

Meaning:

```text
Host      Container
3307  ->  3306
```

Local machine connects using:

```text
localhost:3307
```

Container connects using:

```text
db:3306
```

---

### Volume

```yaml
volumes:
  - db_data:/var/lib/mysql
```

Stores database data permanently.

Without volume:

```text
Container deleted
=> Data deleted
```

With volume:

```text
Container deleted
=> Data remains
```

---

## Backend Service

```yaml
backend:
  build: .
```

Build image from Dockerfile in current folder.

---

### depends_on

```yaml
depends_on:
  - db
```

Starts MySQL before backend.

Note:

```text
depends_on
```

does NOT guarantee MySQL is fully ready.

---

### Port Mapping

```yaml
ports:
  - "8080:8080"
```

Meaning:

```text
Host      Container
8080  ->  8080
```

Application becomes available at:

```text
http://localhost:8080
```

---

# Spring Boot Configuration

Inside Docker:

```properties
spring.datasource.url=jdbc:mysql://db:3306/jobportaldb
spring.datasource.username=jobportal
spring.datasource.password=12345
```

Important:

Use:

```text
db
```

NOT:

```text
localhost
```

because backend runs inside another container.

---

# Build Process

## Step 1

Build jar:

```bash
mvn clean package
```

Output:

```text
target/jobportal.jar
```

---

## Step 2

Build image:

```bash
docker compose build
```

---

## Step 3

Start containers:

```bash
docker compose up
```

---

# Useful Commands

List containers:

```bash
docker ps
```

Stop containers:

```bash
docker compose down
```

Rebuild image:

```bash
docker compose build --no-cache
```

View logs:

```bash
docker logs jobportal-api
```

Open container shell:

```bash
docker exec -it jobportal-api sh
```

---

# Common Problems

## JAR Not Found

```text
COPY target/jobportal.jar
not found
```

Fix:

```bash
mvn clean package
```

first.

---

## Connection Refused

```text
Communications link failure
```

Possible causes:

* MySQL not running
* Wrong database URL
* Backend starts before MySQL is ready

---

## Wrong Hostname

Wrong:

```properties
jdbc:mysql://localhost:3306/jobportaldb
```

Correct:

```properties
jdbc:mysql://db:3306/jobportaldb
```

when backend runs inside Docker.
