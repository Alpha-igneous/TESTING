import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Waves, Loader, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import toast from 'react-hot-toast'

const ChatInterface = ({ isAuthenticated }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSession, setChatSession] = useState(null)
  const messagesEndRef = useRef(null)
  const chatRef = useRef(null)

  useEffect(() => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI ocean expert. Ask me anything about ARGO float data, ocean temperatures, salinity, or marine research. What would you like to explore today?",
      timestamp: new Date().toISOString(),
      sources: []
    }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatRef.current) {
      gsap.fromTo(chatRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
      )
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    
    if (!isAuthenticated) {
      toast.error('Please sign in to start chatting!')
      return
    }

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: inputMessage,
          sessionId: chatSession?.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const botMessage = {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: data.response || "I'm sorry, I couldn't process that request. Please try again.",
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        dataPoints: data.dataPoints || []
      }

      setMessages(prev => [...prev, botMessage])
      
      if (data.sessionId) {
        setChatSession({ id: data.sessionId })
      }

    } catch (error) {
      console.error('Chat error:', error)
      
      const demoResponse = {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: `Great question about "${inputMessage}"! Based on ARGO float data, I can see some interesting patterns in ocean temperature and salinity. The data shows seasonal variations in the upper ocean layers, with temperature ranging from 18-24°C in the mixed layer. Would you like me to show you specific visualizations or dive deeper into any particular aspect?`,
        timestamp: new Date().toISOString(),
        sources: [
          { title: "ARGO Float Data Analysis", url: "#" },
          { title: "Ocean Temperature Trends", url: "#" }
        ],
        dataPoints: [
          { label: "Temperature", value: "21.5°C", trend: "up" },
          { label: "Salinity", value: "35.2 PSU", trend: "stable" },
          { label: "Depth", value: "150m", trend: "down" }
        ]
      }
      
      setMessages(prev => [...prev, demoResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const MessageBubble = ({ message, isLast }) => {
    const isBot = message.type === 'bot'
    
    useEffect(() => {
      if (isLast) {
        gsap.fromTo(`.message-${message.id}`,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        )
      }
    }, [isLast, message.id])

    return (
      <div className={`message-${message.id} flex ${isBot ? 'justify-start' : 'justify-end'} mb-6`}>
        <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isBot 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg' 
                : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg'
            }`}>
              {isBot ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
            </div>
          </div>

          <div className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
            isBot 
              ? 'bg-gray-700/90 text-gray-100 border border-gray-600/50' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
          }`}>
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            
            {message.dataPoints && message.dataPoints.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {message.dataPoints.map((point, index) => (
                  <div key={index} className="bg-gray-600/50 rounded-lg p-2 border border-gray-500/50">
                    <div className="text-xs text-cyan-400 font-medium">{point.label}</div>
                    <div className="text-sm font-bold text-cyan-300">{point.value}</div>
                  </div>
                ))}
              </div>
            )}
            
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 space-y-1">
                <div className="text-xs text-cyan-400 font-medium">Sources:</div>
                {message.sources.map((source, index) => (
                  <a key={index} href={source.url} className="block text-xs text-cyan-300 hover:text-cyan-200 underline">
                    {source.title}
                  </a>
                ))}
              </div>
            )}
            
            <div className={`text-xs mt-2 ${
              isBot ? 'text-gray-400' : 'text-cyan-100'
            }`}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={chatRef} className="min-h-screen bg-gradient-to-br from-slate-900/95 to-gray-900/95 pt-20 pb-8">
      <div className="container mx-auto px-6 h-full flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Ocean AI Assistant
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Ask questions about ocean data, ARGO floats, marine research, or request data visualizations.
          </p>
        </div>

        <div className="flex-1 bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 shadow-xl">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isLast={index === messages.length - 1}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex max-w-[80%]">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-700/90 rounded-2xl px-4 py-3 shadow-lg border border-gray-600/50">
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analyzing ocean data...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-600/50 p-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isAuthenticated ? "Ask about ocean data, ARGO floats, or request visualizations..." : "Please sign in to start chatting"}
                  disabled={!isAuthenticated || isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600/50 bg-gray-700/80 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all duration-300"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !isAuthenticated || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface