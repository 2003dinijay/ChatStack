# Use the same Node version as your Chat Service for consistency
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files first to take advantage of Docker's layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Next.js runs on 3000 by default
EXPOSE 3000

# Run Next.js in development mode with hot-reloading
CMD ["npm", "run", "dev"]