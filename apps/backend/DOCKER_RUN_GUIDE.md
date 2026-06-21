# Docker Run Guide

## Requirements

Before running this project, make sure you have installed:

* Docker Desktop
* Git

Check installation:

```bash
docker --version
docker compose version
```

---

## Clone Project

```bash
git clone <repository-url>
cd backend
```

---

## Run Application

Build and start all containers:

```bash
docker compose up --build
```

Run in background:

```bash
docker compose up -d --build
```

---

## Check Running Containers

```bash
docker ps
```

Expected containers:

* jobportal
* jobportal-api

---

## Access Application

Backend API:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

or

```text
http://localhost:8080/swagger-ui/index.html
```

---

## View Logs

Backend logs:

```bash
docker logs jobportal-api
```

MySQL logs:

```bash
docker logs jobportal
```

Follow logs continuously:

```bash
docker logs -f jobportal-api
```

---

## Stop Containers

```bash
docker compose down
```

---

## Restart Containers

```bash
docker compose restart
```

Restart only backend:

```bash
docker restart jobportal-api
```

---

## Rebuild After Code Changes

```bash
mvn clean package

docker compose build

docker compose up
```

---

## Remove Containers and Volumes

Warning: this removes database data.

```bash
docker compose down -v
```

---

## Common Issues

### Backend cannot connect to MySQL

Restart backend after MySQL becomes ready:

```bash
docker restart jobportal-api
```

### Port already in use

Check running processes and free ports:

```bash
8080
3307
```

### Docker image is outdated

Rebuild image:

```bash
docker compose build --no-cache
```
