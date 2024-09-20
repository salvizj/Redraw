BINARY_NAME=Redraw

default: all

all: format frontend-build build

format:
	npx prettier --write "**/*.tsx" "**/*.ts"
	go fmt ./...

frontend-build:
	@cd frontend && npm install && npm run build || (echo "Frontend build failed" && exit 1)

build:
	go build -o $(BINARY_NAME) cmd/main.go
	@chmod +x $(BINARY_NAME)
	@ls -l $(BINARY_NAME)  

run:
	@make run-prod

run-dev:
	@cd frontend && npm install && npm run dev || (echo "Frontend development failed" && exit 1)
	go run cmd/main.go

run-prod:
	@cd frontend && npm install && npm run build || (echo "Frontend build failed" && exit 1)
	go build -o $(BINARY_NAME) cmd/main.go
	@chmod +x $(BINARY_NAME)
	@ls -l $(BINARY_NAME)  # Verify that permissions are set
	./$(BINARY_NAME)

format-frontend:
	@cd frontend && npx prettier --write "**/*.tsx" "**/*.ts"

clean:
	@rm -f $(BINARY_NAME)
	@rm -rf frontend/dist

test:
	go test ./...

install:
	@cd frontend && npm install
	go mod tidy

.PHONY: default all format build frontend-build run run-dev run-prod format-frontend clean test install build-without-format
