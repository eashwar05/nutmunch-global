# Nutmunch - Premium Nut Concierge

A luxury e-commerce experience offering premium nuts and delicacies. This project demonstrates a full-stack application featuring a sophisticated, high-end design with smooth animations and a robust backend.

## Features

- **Premium UI/UX**: Built with React and Framer Motion for sophisticated animations and a luxury feel.
- **Full-Stack Architecture**: React (Vite) frontend with a fast and efficient FastAPI (Python) backend.
- **E-commerce Functionality**: Product browsing, cart management, and checkout workflow.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **Python** (3.8 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eashwar05/nutmunch-global.git
   cd nutmunch-global
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

## Running the Application

### Option 1: Using the Startup Script (Windows)
The easiest way to run the app is using the provided batch script, which launches both frontend and backend in separate windows.

```bash
start_app.bat
```

### Option 2: Manual Start

**1. Start the Backend server:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

**2. Start the Frontend development server:**
(Open a new terminal window)
```bash
npm run dev
```
The application will be running at `http://localhost:5173`.

## Deployment

This application is hosted on [Vercel](https://vercel.com).
