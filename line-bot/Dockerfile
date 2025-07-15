FROM oven/bun:latest

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install production dependencies
RUN bun install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 4000

# Run the application
CMD ["bun", "app.js"]