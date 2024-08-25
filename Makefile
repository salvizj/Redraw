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

run: frontend-build build
	@echo "Running the Go application..."
	./$(BINARY_NAME)

clean:
	@echo "Cleaning up..."
	@rm -f $(BINARY_NAME)
	@rm -rf frontend/dist

test:
	@echo "Running tests..."
	go test ./...

deps:
	@echo "Installing dependencies..."
	go mod tidy

.PHONY: default all format build frontend-build run clean test deps
