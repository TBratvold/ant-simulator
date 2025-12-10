# Use Node LTS (22 as of now)
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Vite dev server port
EXPOSE 5173

# Default command: start Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]