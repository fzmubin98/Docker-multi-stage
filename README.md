This README provides a comprehensive overview of the steps taken to dockerize a simple Node.js application using Express. The objective was to optimize Docker images for production through multi-stage builds, ensuring that the final image is secure and lightweight.

## Project Overview

The project uses a multi-stage Dockerfile to separate the building and running stages of the application. This approach minimizes the size of the final Docker image by excluding development dependencies and build tools from the production image.

### Key Objectives:

1. **Multi-Stage Build**: Utilize multi-stage builds to keep the final production image as clean and minimal as possible.
2. **Security**: Run the application as a non-root user in the container to enhance security.
3. **Efficiency**: Use Docker's caching mechanism effectively to speed up builds.
4. **Health Checks**: Include a health check endpoint to ensure the application is running correctly.

## Components

### 1. Dockerfile

The `Dockerfile` defines two stages: `builder` and `production`.

- **Builder Stage**: Uses a full `node:16` base image to install dependencies and build the application (if any).
- **Production Stage**: Uses `node:16-alpine`, a minimal base image, copies only necessary artifacts from the builder stage, sets environment variables, exposes the correct port, and specifies how to run the application.

#### Dockerfile Breakdown
```Dockerfile
# Stage 1: Builder
FROM node:16 AS builder

# Set a working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:16-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Copy essential files from builder stage
COPY --from=builder /app ./

EXPOSE 3000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["npm", "start"]
```

### 2. Node.js Application Setup

A basic Express application serves as the backend.

#### Key Files:

- **app.js**: The main server file with Express setup.
- **package.json**: Contains metadata about the project, scripts for building and starting the application, and dependencies.

#### Basic Express Server (`app.js`)

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Health check route
app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app; // Export for testing
```
### 3. Health Check Implementation

Implemented a health check route to monitor the application's status via the Docker container.
#### Health Check 
```javascript
const http = require('http');

  

http.get({host:'localhost', path: '/healthcheck', port: '3000'}, (res) => {

  process.exitCode = res.statusCode === 200 ? 0 : 1;

  process.exit();

}).on('error', (err) => {

  console.error(err);

  process.exit(1);

});
```

### 4. Setup Instructions

**Build the Docker Image:**
```bash
docker build -t mynodeapp .
```

**Run the Docker Container:**
```bash
docker run -p 3000:3000 mynodeapp
```
### 5. Debugging and Validation

Ensure each step functions as expected:

- Verify local running of the Express server.
- Check Docker build logs for potential errors during the multi-stage builds.
- Test the running Docker container by accessing the exposed endpoints.

## Conclusion

This project demonstrates an efficient way to dockerize a Node.js application for production environments. By leveraging Docker's multi-stage build feature, we maintain smaller, more secure images that are tailored for production use while ensuring that all development and build tools do not make it into the final image.
