# Use the official Node.js image as base
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Copy OpenAPI specification for server usage
COPY openapi.json ./openapi.json

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build frontend (React app into /build)
RUN npm run buildReact

# Build backend (compile TypeScript server with Webpack into /dist)
RUN npm run buildServer

# -----------------------
# Production image
# -----------------------
FROM node:18-slim

WORKDIR /app

# Copy only needed files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
COPY --from=build /app/openapi.json ./openapi.json

# Install only production dependencies
RUN npm install --only=production

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]

