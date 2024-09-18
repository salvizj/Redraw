FROM golang:1.20 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && npm install -g prettier \
    && cd frontend && npm install

RUN go fmt ./... && \
    cd frontend && npx prettier --write "**/*.tsx" "**/*.ts" && \
    npm run build

RUN go build -o Redraw cmd/main.go

FROM alpine:latest

COPY --from=builder /app/Redraw /Redraw
COPY --from=builder /app/frontend/dist /frontend/dist

WORKDIR /

ENTRYPOINT ["/Redraw"]
