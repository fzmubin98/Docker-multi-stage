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