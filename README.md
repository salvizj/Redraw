# Drawing Game

## Overview

In this drawing game, players each write a prompt and then randomly draw a prompt written by someone else. It’s a fun way to challenge your creativity and see how others interpret your prompts.
You can set it up locally or visit my hosted site [here](https://redraw.onrender.com/).

## To set up locally

### Prerequisites

-   **Node.js (NPM)** (for frontend)
-   **Go** (for backend)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/salvizj/Redraw
    cd Redraw
    ```

2. **Install Dependencies**
    ```bash
    make install
    ```

#### Environment Setup

1. **Create and Configure `.env` File**

    You need to set up environment variables for the application to work. Copy the `.env.example` file to `.env` and configure the necessary variables:

    ```bash
    cp .env.example .env
    ```

    Then, edit the `.env` file to include your database URL and authentication token:

    ```env
    TURSO_DATABASE_URL=your_database_url_here
    TURSO_AUTH_TOKEN=your_auth_token_here
    VITE_BASE_URL=http://localhost
    VITE_PORT=80
    ```

    You need to create a Turso database and obtain the URL and authentication token from your [Turso account](https://turso.tech/).

2. **Running the Application**

    - To build application :

        ```bash
        make build
        ```

    - To run application:

        ```bash
        make run
        ```

    - Default for installing, building and running:

        ```bash
        make all
        ```

## Game Instructions

1. **Create or Join a Game Lobby**: You can create your own game lobby or join an existing one. Wait for the game leader to start the game.

2. **Write a Prompt**: Each player writes a creative prompt in the game lobby.

3. **Draw a Prompt**: Once the game starts, each player randomly receives a prompt written by someone else and tries to draw it.

4. **Guess the Drawing**: After drawing, other players will guess what the drawing represents.

5. **Share and Enjoy**: Share the drawings and guesses with the group and enjoy the interpretations!
