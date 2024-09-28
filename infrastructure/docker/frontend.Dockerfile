FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Set the environment variable
ENV NODE_ENV=production

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Install serve package globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Set the command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]
```

This Dockerfile follows the specifications provided in the JSON representation. Here's a breakdown of each step:

1. We use `node:14-alpine` as the base image, which is a lightweight Node.js 14 image.
2. Set the working directory to `/app`.
3. Set the `NODE_ENV` environment variable to `production`.
4. Copy `package.json` and `package-lock.json` files.
5. Install production dependencies using `npm ci --only=production`.
6. Copy the entire application code to the working directory.
7. Build the application using `npm run build`.
8. Install the `serve` package globally to serve the built static files.
9. Expose port 3000 for the application.
10. Set the command to run the application using `serve -s build -l 3000`.

Here are the human tasks mentioned in the JSON specification, added as comments:

```
# Human tasks:
# TODO: Verify that the Node.js version (14) is the most appropriate for the project (Optional)
# TODO: Ensure that all necessary environment variables are properly set in the Dockerfile or through Docker Compose (Required)
# TODO: Optimize the Docker image size by removing unnecessary files and using multi-stage builds if applicable (Optional)