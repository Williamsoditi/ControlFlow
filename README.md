# ControlFlow: AI-Powered Content Automation 

ControlFlow is a full-stack web application designed to streamline content generation using artificial intelligence. It leverages a robust Django REST Framework backend with real-time AI capabilities (via Google Gemini) and a responsive React frontend, offering a seamless and interactive user experience.

---

##  Features

* **AI-Powered Content Generation**: Generate various types of content based on user prompts using the Google Gemini large language model.
* **Real-time Streaming**: Experience content generation in real-time. Text appears character by character on the frontend as the AI model processes the request, providing immediate feedback and an engaging user experience.
* **Asynchronous Task Processing**: The backend utilizes Celery and Redis to handle long-running AI generation tasks in the background, ensuring the web application remains responsive.
* **Modern Frontend**: A dynamic and intuitive user interface built with React and Material-UI (MUI).
* **Robust Backend**: A well-structured Django REST Framework API.

---

##  Technologies Used

### Backend
* **Django**: High-level Python Web framework.
* **Django REST Framework**: Toolkit for building Web APIs.
* **Google Gemini API**: For AI-powered content generation.
* **Celery**: Distributed task queue for asynchronous task processing.
* **Redis**: In-memory data store used as a message broker for Celery and a channel layer for Django Channels.
* **Django Channels**: Enables Django to handle WebSockets and other asynchronous protocols.
* **Daphne**: An ASGI HTTP and WebSocket protocol server for Django Channels.
* **`python-dotenv`**: For managing environment variables.

### Frontend
* **React**: A JavaScript library for building user interfaces.
* **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
* **Vite**: A fast frontend build tool.
* **Material-UI (MUI)**: A popular React UI framework for beautiful and responsive components.
* **Axios**: Promise-based HTTP client for the browser and Node.js.

### Tools
* **Docker**: For easily running the Redis message broker.

---

##  Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Python 3.10+**: Download from [python.org](https://www.python.org/downloads/).
* **Node.js & npm/pnpm**: Download Node.js (which includes npm) from [nodejs.org](https://nodejs.org/). We'll be using `pnpm`.
    ```bash
    npm install -g pnpm
    ```
* **Docker Desktop**: Download from [docker.com](https://www.docker.com/products/docker-desktop/). Ensure it's running before starting Redis.
* **Google Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

##  Setup Instructions

Follow these steps to get ContentFlow up and running on your local machine.

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/Williamsoditi/ControlFlow.git
cd ControlFlow

