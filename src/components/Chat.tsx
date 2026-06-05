import { useState, useRef, useEffect } from 'react'
import styles from '../styles/Chat.module.css'

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
  suggestions?: string[]
}

interface ChatProps {
  messages: Message[]
  loading: boolean
  error: ChatError | null
  onSendMessage: (message: string) => void
}

export default function Chat({ messages, loading, error, onSendMessage }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const renderErrorInstructions = (errorType: string) => {
    switch (errorType) {
      case 'invalid_api_key':
        return (
          <div className={styles.errorInstructions}>
            <p><strong>🔑 How to fix:</strong></p>
            <ol>
              <li>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">Anthropic Console</a></li>
              <li>Copy your API key</li>
              <li>Open the <code>.env</code> file in your project folder</li>
              <li>Find this line: <code>ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here</code></li>
              <li>Replace it with: <code>ANTHROPIC_API_KEY=sk-ant-your-key-here</code></li>
              <li>Save the file</li>
              <li><strong>Restart the backend server</strong> (stop and run <code>npm run server</code> again)</li>
              <li>Try your message again</li>
            </ol>
          </div>
        )
      case 'rate_limit':
        return (
          <div className={styles.errorInstructions}>
            <p><strong>⏱️ How to fix:</strong></p>
            <ul>
              <li>Wait a few moments before sending another message</li>
              <li>Check your usage at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">Anthropic Console</a></li>
              <li>Consider upgrading your plan if you're hitting limits often</li>
            </ul>
          </div>
        )
      case 'timeout':
        return (
          <div className={styles.errorInstructions}>
            <p><strong>⏳ How to fix:</strong></p>
            <ul>
              <li>Check your internet connection</li>
              <li>Try a simpler question</li>
              <li>Wait a moment and try again</li>
            </ul>
          </div>
        )
      case 'connection':
        return (
          <div className={styles.errorInstructions}>
            <p><strong>🌐 How to fix:</strong></p>
            <ul>
              <li>Verify your internet connection is working</li>
              <li>Check if you have a firewall blocking the connection</li>
              <li>Try restarting the backend server</li>
            </ul>
          </div>
        )
      case 'quota':
        return (
          <div className={styles.errorInstructions}>
            <p><strong>📊 How to fix:</strong></p>
            <ul>
              <li>Your API quota has been exceeded</li>
              <li>Visit <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">Anthropic Console</a> to check your usage</li>
              <li>Wait for your quota to reset, or upgrade your plan</li>
            </ul>
          </div>
        )
      default:
        return (
          <div className={styles.errorInstructions}>
            <p><strong>🔧 How to fix:</strong></p>
            <ul>
              <li>Check that the backend server is running: <code>npm run server</code></li>
              <li>Make sure your API key is set in the <code>.env</code> file</li>
              <li>Check the backend server console for more details</li>
            </ul>
          </div>
        )
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <p>Start a conversation with Claude</p>
            <p className={styles.emptyStateSubtitle}>Ask me anything!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.sender]}`}
          >
            <div className={styles.messageContent}>
              <p>{message.text}</p>
            </div>
            <span className={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <p className={styles.errorTitle}>❌ {error.message}</p>
            <p className={styles.errorDetails}>{error.details}</p>
            {renderErrorInstructions(error.type)}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={loading || !input.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
