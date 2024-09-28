FROM node:14-alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install production dependencies and Knex CLI globally
RUN npm ci --only=production && \
    npm install -g knex

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Set the start command to run the built application
CMD ["npm", "start"]

# Add health check instructions
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Add labels for better container management
LABEL maintainer="Mint Replica Team <team@mintreplica.com>"
LABEL version="1.0"
LABEL description="Dockerfile for Mint Replica backend application"

# Use multi-stage build to optimize image size
FROM node:14-alpine AS production
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
EXPOSE 3000
CMD ["npm", "start"]