BINARY_NAME=Redraw

default: all

all: format frontend-build build

format:
	@echo "Formatting the code..."
	npx prettier --write "**/*.tsx" "**/*.ts"
	go fmt ./...

build:
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go

frontend-build:
	@echo "Building the frontend application..."
	@cd frontend && npm install && npm run build || (echo "Frontend build failed" && exit 1)

run:
	@echo "Building the frontend application..."
	@cd frontend && npm install && npm run build || (echo "Frontend build failed" && exit 1)
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go
	@echo "Running the Go application..."
	./$(BINARY_NAME)

run-with-format:
	@echo "Formatting code..."
	npx prettier --write "**/*.tsx" "**/*.ts"
	go fmt ./...
	@echo "Building the frontend application..."
	@cd frontend && npm install && npm run build || (echo "Frontend build failed" && exit 1)
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go
	@echo "Running the Go application..."
	./$(BINARY_NAME)

format-frontend:
	@echo "Formatting frontend code..."
	@cd frontend && npx prettier --write "**/*.tsx" "**/*.ts"

clean:
	@echo "Cleaning up..."
	@rm -f $(BINARY_NAME)
	@rm -rf frontend/dist

test:
	@echo "Running tests..."
	go test ./...

install:
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "Installing Go dependencies..."
	go mod tidy

build-without-format:
	@echo "Building the frontend application without formatting..."
	@cd frontend && npm install && npm run build || (echo "Frontend build failed" && exit 1)
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go

.PHONY: default all format build frontend-build run run-with-format format-frontend clean test install build-without-format
