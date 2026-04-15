# Use Node.js environment
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]