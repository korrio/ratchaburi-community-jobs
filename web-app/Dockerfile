FROM oven/bun:latest AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy app source
COPY . .

# Build the Next.js app
RUN bun run build

# Production stage
FROM oven/bun:latest AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb* ./
COPY --from=builder /app/next.config.js ./

# Install only production dependencies
RUN bun install --production

# Expose port
EXPOSE 3000

# Run the application
CMD ["bun", "run", "start"]