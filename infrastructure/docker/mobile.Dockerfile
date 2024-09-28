FROM node:14-alpine

# Set environment variables
ENV NODE_ENV=production
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Install global React Native CLI
RUN npm install -g react-native-cli

# Expose necessary ports
EXPOSE 8081

# Set the default command to start the React Native packager
CMD ["yarn", "start"]

# Human tasks (commented):
# TODO: Verify that all necessary build tools and dependencies for Android and iOS are included
# TODO (Optional): Ensure that the Dockerfile is optimized for caching and minimal layer size
# TODO (Optional): Consider adding a health check command