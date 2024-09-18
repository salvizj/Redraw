BINARY_NAME=Redraw

default: all

all: format frontend-build build

format:
	@echo "Formatting code..."
	npx prettier --write "**/*.tsx" "**/*.ts"
	go fmt ./...

frontend-build:
	@echo "Building the frontend application..."
	@cd frontend && npm install && npm run build || (echo "Frontend build failed" && exit 1)

build:
	@echo "Building the Go application..."
	go build -o $(BINARY_NAME) cmd/main.go

run:
	@echo "Running the application..."
	@make run-prod

run-dev:
	@echo "Running the frontend application in development mode..."
	@cd frontend && npm install && npm run dev || (echo "Frontend development failed" && exit 1)
	@echo "Running the Go application in development mode..."
	go run cmd/main.go

run-prod:
	@echo "Building and running the Go application in production mode..."
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
	@echo "Installing all dependencies..."
	@cd frontend && npm install
	@echo "Installing Go dependencies..."
	go mod tidy

.PHONY: default all format build frontend-build run run-dev run-prod format-frontend clean test install build-without-format
