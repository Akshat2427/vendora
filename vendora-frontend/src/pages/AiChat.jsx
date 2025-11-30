import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdSend, MdSmartToy } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import { apiRequest } from '../services/api'

function AiChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I'm your AI assistant for Vendora. How can I help you with auctions, bidding, or anything else today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || loading) return

    const userMessage = {
      role: 'user',
      text: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        text: msg.text
      }))

      const response = await apiRequest('/ai_chat/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.text,
          conversation_history: conversationHistory
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to get response')
      }

      const assistantMessage = {
        role: 'assistant',
        text: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error(error.message || 'Failed to get AI response')
      const errorMessage = {
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto h-screen flex flex-col py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500">
              <MdSmartToy className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">AI Assistant</h1>
              <p className="text-sm text-slate-400">Powered by Gemini AI</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white'
                      : message.error
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                      : 'bg-white/6 backdrop-blur-sm border border-white/6 text-slate-100'
                  }`}
                >
                  {message.role === 'assistant' && !message.error && (
                    <div className="flex items-center gap-2 mb-2">
                      <MdSmartToy className="text-cyan-400" />
                      <span className="text-xs font-semibold text-cyan-400">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/6 backdrop-blur-sm border border-white/6 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-slate-400">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/6 backdrop-blur-sm border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-slate-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <MdSend className="text-xl" />
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default AiChat

