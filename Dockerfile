# Use an official node.js runtime as a parent image.
FROM node:22-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install all npm packages and dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on (5003)
EXPOSE 5003

# Define the command to run application
CMD ["node", "./src/server.js"]