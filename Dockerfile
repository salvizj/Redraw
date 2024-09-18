# Build stage
FROM golang:1.23 AS builder

WORKDIR /app

# Copy go.mod and go.sum files and download Go dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Install system dependencies and frontend tools
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && npm install -g prettier

# Build the frontend assets
RUN cd frontend && npm install && npm run build

# Format and build the Go application
RUN go fmt ./...
RUN cd frontend && npx prettier --write "**/*.tsx" "**/*.ts"
RUN go build -o /app/Redraw cmd/main.go

# Runtime stage
FROM alpine:latest

# Install necessary runtime dependencies
RUN apk add --no-cache libc6-compat

# Copy the built application and frontend assets from the builder stage
COPY --from=builder /app/Redraw /Redraw
COPY --from=builder /app/frontend/dist /frontend/dist

WORKDIR /

# Ensure the binary is executable
RUN chmod +x /Redraw

# Set the entrypoint
ENTRYPOINT ["/Redraw"]
