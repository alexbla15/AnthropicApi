import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []

app.post('/chat', async (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not set. Please check your .env file.',
      details: 'Missing ANTHROPIC_API_KEY',
    })
  }

  try {
    conversationHistory.push({
      role: 'user',
      content: message,
    })

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: 'You are a helpful and friendly assistant. Provide clear, concise, and informative responses.',
      messages: conversationHistory,
    })

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : 'Unable to process response'

    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage,
    })

    res.json({ response: assistantMessage })
  } catch (error) {
    console.error('Anthropic API Error:', error)

    let errorMessage = 'Failed to get response from Claude'
    let details = 'Unknown error occurred'
    let errorType = 'unknown'

    if (error instanceof Error) {
      details = error.message

      if (
        error.message.includes('401') ||
        error.message.includes('authentication') ||
        error.message.includes('invalid_api_key') ||
        error.message.includes('Unauthorized')
      ) {
        errorMessage = 'Invalid or expired API key'
        errorType = 'invalid_api_key'
        details = 'Your ANTHROPIC_API_KEY is invalid or has expired'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout'
        errorType = 'timeout'
        details = 'The request took too long. Please try again.'
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded'
        errorType = 'rate_limit'
        details = 'Too many requests. Please wait a moment and try again.'
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot connect to Anthropic API'
        errorType = 'connection'
        details = 'Check your internet connection and try again'
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded'
        errorType = 'quota'
        details = 'Your Anthropic API account has reached its quota'
      } else {
        errorType = 'api_error'
      }
    }

    res.status(500).json({
      error: errorMessage,
      details: details,
      errorType: errorType,
    })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Validate API key on startup
const validateApiKey = () => {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.trim() === '' || process.env.ANTHROPIC_API_KEY === 'your_actual_anthropic_api_key_here') {
    console.error('\n❌ ERROR: ANTHROPIC_API_KEY is not set or is invalid!\n')
    console.error('📋 Instructions:')
    console.error('1. Get your API key from: https://console.anthropic.com')
    console.error('2. Open the .env file in this directory')
    console.error('3. Replace "your_actual_anthropic_api_key_here" with your actual API key')
    console.error('4. Save the file and restart the server\n')
    console.error('Example .env file:')
    console.error('ANTHROPIC_API_KEY=sk-ant-xxx...your-key-here')
    console.error('PORT=3001\n')
    process.exit(1)
  }
}

validateApiKey()

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`)
  console.log('✅ Chat API available at POST /chat')
  console.log('🚀 Frontend: http://localhost:5173')
})
