# Define the binary name
BINARY_NAME=Redraw

# Default target executed when no specific target is specified
default: build

# Build the Go application
build: frontend-build
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go

# Build the frontend application
frontend-build:
	@echo "Building the frontend application..."
	npm run build --prefix frontend

# Run the Go application
run: build
	@echo "Running the Go application..."
	./$(BINARY_NAME)

# Clean up build files
clean:
	@echo "Cleaning up..."
	@rm -f $(BINARY_NAME)
	@rm -rf frontend/dist

# Format the code
fmt:
	@echo "Formatting the code..."
	go fmt ./...

# Run tests
test:
	@echo "Running tests..."
	go test ./...

# Install dependencies
deps:
	@echo "Installing dependencies..."
	go mod tidy

.PHONY: build frontend-build run clean fmt test deps
