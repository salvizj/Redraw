# Define the binary name
BINARY_NAME=Redraw

# Default target executed when no specific target is specified
default: build

# Build the Go application
build:
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go

# Run the Go application
run: build
	@echo "Running the Go application..."
	./$(BINARY_NAME)

# Clean up build files
clean:
	@echo "Cleaning up..."
	@rm -f $(BINARY_NAME)

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

.PHONY: build run clean fmt test deps
