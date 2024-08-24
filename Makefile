# Define the binary name
BINARY_NAME=Redraw

# Default target executed when no specific target is specified
default: all

# All target: build the entire project (both frontend and backend)
all: format frontend-build build

# Format the code
format:
	@echo "Formatting the code..."
	npx prettier --write "**/*.tsx" "**/*.ts" 
	go fmt ./...                          

# Build the Go application
build:
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go

# Build the frontend application
frontend-build:
	@echo "Building the frontend application..."
	npm run build --prefix frontend

# Run the Go application
run: format build
	@echo "Running the Go application..."
	./$(BINARY_NAME)

# Clean up build files
clean:
	@echo "Cleaning up..."
	@rm -f $(BINARY_NAME)
	@rm -rf frontend/dist

# Run tests
test:
	@echo "Running tests..."
	go test ./...

# Install dependencies
deps:
	@echo "Installing dependencies..."
	go mod tidy

.PHONY: default all format build frontend-build run clean test deps
