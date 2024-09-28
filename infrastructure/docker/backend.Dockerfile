# Use Node.js 14 Alpine as the base image for a lightweight container
FROM node:14-alpine

# Set the NODE_ENV environment variable to 'production'
ENV NODE_ENV=production

# Set the working directory to /app
WORKDIR /app

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

# Set up a healthcheck to ensure the application is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Set the start command to run the built application
CMD ["npm", "start"]

# Human tasks:
# TODO: Verify that Node.js 14 is the correct version for production use
# TODO: Implement and test the /health endpoint in the backend application
# TODO: Review and potentially optimize the Docker image size
# TODO: Consider using multi-stage builds to further reduce image size