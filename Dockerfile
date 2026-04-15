# Use Node 20 runtime
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build TypeScript code
RUN npm run build


RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]