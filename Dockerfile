# Build stage
FROM golang:1.23 AS builder

WORKDIR /app

# Cache Go module dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build
COPY . .
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && npm install -g prettier \
    && cd frontend && npm install \
    && go fmt ./... \
    && cd frontend && npx prettier --write "**/*.tsx" "**/*.ts" \
    && npm run build \
    && go build -o Redraw cmd/main.go

# Runtime stage
FROM alpine:latest

# Install any required packages (if necessary)
RUN apk --no-cache add ca-certificates

# Copy the binary and frontend assets
COPY --from=builder /app/Redraw /Redraw
COPY --from=builder /app/frontend/dist /frontend/dist

# Optionally, add a non-root user
RUN adduser -D myuser
USER myuser

WORKDIR /

ENTRYPOINT ["/Redraw"]
