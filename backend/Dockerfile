FROM oven/bun:latest

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install production dependencies
RUN bun install --production

# Copy app source
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Run database seeding
RUN bun run seed

# Expose port
EXPOSE 5000

# Run the application
CMD ["bun", "server.js"]