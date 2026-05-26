# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://mongodb:27017/student-course-registration

# Start the application
CMD ["node", "server.js"]
