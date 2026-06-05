# Anthropic Chat App

A simple chat application built with Vite, React, TypeScript, and Anthropic's Claude API.

## Features

- Real-time chat interface with Claude AI
- Message history within conversation
- Responsive design with CSS modules
- TypeScript support
- Environment variable configuration for API keys

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or update the existing one):

```
ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
PORT=3001
```

Get your API key from [Anthropic Console](https://console.anthropic.com)

### 3. Run the Application

In separate terminals:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
AnthropicApi/
├── src/
│   ├── components/
│   │   └── Chat.tsx          # Chat UI component
│   ├── styles/
│   │   ├── App.module.css    # App styling
│   │   └── Chat.module.css   # Chat styling
│   ├── App.tsx               # Main app component
│   └── main.tsx              # React entry point
├── server.ts                 # Express backend
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── index.html               # HTML entry point
```

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start Express backend server

## Architecture

### Frontend
- **React** with TypeScript for UI
- **CSS Modules** for scoped styling
- **Vite** for fast development and building

### Backend
- **Express.js** server
- **Anthropic SDK** for Claude API integration
- **Conversation history** maintained per session

## API Endpoints

### POST /chat
Send a message and get a response from Claude.

**Request:**
```json
{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "response": "Claude's answer"
}
```

### GET /health
Health check endpoint.

## Building for Production

```bash
npm run build
```

This creates optimized builds in the `dist/` folder.

## Notes

- The API key should never be exposed in frontend code (it's kept on the backend)
- Each session maintains its own conversation history
- Messages are cleared when the server restarts
