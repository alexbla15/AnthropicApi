import { useState, useRef, useEffect } from 'react'
import Chat from './components/Chat'
import styles from './styles/App.module.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

interface ChatError {
  message: string
  details: string
  type: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ChatError | null>(null)

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        setError({
          message: errorData.error || 'Failed to get response',
          details: errorData.details || 'An error occurred while processing your request',
          type: errorData.errorType || 'unknown',
        })

        setLoading(false)
        return
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to server'

      setError({
        message: 'Connection Error',
        details: errorMessage,
        type: 'connection',
      })

      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Anthropic Chat</h1>
        <p className={styles.subtitle}>Powered by Claude</p>
      </div>

      <Chat
        messages={messages}
        loading={loading}
        error={error}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default App
