BINARY_NAME=Redraw

default: all

all: install build run

install:
	@cd frontend && npm install || (echo "Frontend install failed" && exit 1)
	go mod tidy || (echo "Backend install failed" && exit 1)

build:
	@cd frontend && npm run build || (echo "Frontend build failed" && exit 1)
	go build -o $(BINARY_NAME) cmd/main.go
	@chmod +x $(BINARY_NAME)
	@ls -l $(BINARY_NAME)

run:
	./$(BINARY_NAME)

format:
	npx prettier --write "**/*.tsx" "**/*.ts"
	go fmt ./...

clean:
	@rm -f $(BINARY_NAME)
	@rm -rf frontend/dist

test:
	go test ./...

.PHONY: default all install build run format clean test
