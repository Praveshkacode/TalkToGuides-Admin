import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'

// Create socket instance outside component to avoid multiple connections
let socket = null

const Chat = ({ roomId, senderId, senderType = 'expert', sessionId, expertId, userId, userName }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const currentRoomRef = useRef(null)

  useEffect(() => {
    if (!socket) {
      socket = io(backendUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      })
    }
    if (socket.connected) setIsConnected(true)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('eToken') || localStorage.getItem('aToken')
        if (!token) {
          setError('Authentication required.')
          setLoading(false)
          return
        }
        
        console.log('Admin loading messages for room:', roomId, 'session:', sessionId)
        
        const res = await axios.get(`${backendUrl}/api/chat/messages`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            sessionId: sessionId || roomId,
            roomId,
            page: 1,
            limit: 50
          }
        })
        
        console.log('Admin messages response:', res.data)
        
        if (res.data.success) setMessages(res.data.messages)
        else setError(res.data.message || 'Failed to load messages')
      } catch (err) {
        console.error('Admin error loading messages:', err)
        setError('Error loading messages: ' + (err.response?.data?.message || err.message))
      } finally {
        setLoading(false)
      }
    }
    if (roomId) loadMessages()
  }, [roomId, sessionId])

  useEffect(() => {
    if (!roomId || !socket) return
    
    console.log('Admin joining room:', roomId, 'senderId:', senderId)
    
    if (currentRoomRef.current && currentRoomRef.current !== roomId) {
      console.log('Admin leaving previous room:', currentRoomRef.current)
      socket.emit('leave_room', currentRoomRef.current)
    }
    socket.emit('join_room', roomId)
    currentRoomRef.current = roomId

    const onConnect = () => {
      console.log('Admin socket connected')
      setIsConnected(true)
      setError(null)
    }
    const onDisconnect = () => {
      console.log('Admin socket disconnected')
      setIsConnected(false)
    }
    const onConnectError = () => {
      console.log('Admin socket connection error')
      setError('Connection failed.')
      setIsConnected(false)
    }
    const onReceiveMessage = (data) => {
      console.log('Admin received message:', data, 'for room:', roomId)
      if (data.roomId === roomId) {
        setMessages(prev => [...prev, data])
      }
    }
    const onUserTyping = (data) => {
      console.log('Admin typing indicator:', data)
      if (data.roomId === roomId && data.userId !== senderId) {
        setTypingUsers(prev =>
          data.isTyping
            ? [...new Set([...prev, data.userId])]
            : prev.filter(id => id !== data.userId)
        )
      }
    }
    const onMessageRead = (data) => {
      if (data.roomId === roomId) {
        setMessages(prev => prev.map(msg =>
          msg.senderId !== data.readerId ? { ...msg, isRead: true } : msg
        ))
      }
    }
    const onJoinSuccess = (data) => {
      console.log('Admin successfully joined room:', data)
    }
    const onJoinError = (data) => {
      console.error('Admin failed to join room:', data)
      setError('Failed to join chat room: ' + data.error)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('receive_message', onReceiveMessage)
    socket.on('user_typing', onUserTyping)
    socket.on('message_read', onMessageRead)
    socket.on('join_success', onJoinSuccess)
    socket.on('join_error', onJoinError)

    if (socket.connected) setIsConnected(true)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('receive_message', onReceiveMessage)
      socket.off('user_typing', onUserTyping)
      socket.off('message_read', onMessageRead)
      socket.off('join_success', onJoinSuccess)
      socket.off('join_error', onJoinError)
    }
  }, [roomId, senderId])

  useEffect(() => {
    return () => {
      if (socket && currentRoomRef.current) {
        socket.emit('leave_room', currentRoomRef.current)
        currentRoomRef.current = null
      }
    }
  }, [])

  const handleTyping = () => {
    if (!isTyping && socket) {
      setIsTyping(true)
      socket.emit('typing_start', { roomId, senderId })
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (socket) socket.emit('typing_stop', { roomId, senderId })
    }, 1000)
  }

  const sendMessage = () => {
    if (!message.trim()) return
    
    const msgData = {
      roomId,
      sessionId: sessionId || roomId,
      senderId,
      senderType,
      content: message.trim(),
      timestamp: new Date(),
      userId,
      expertId
    }
    
    console.log('Admin sending message:', msgData)
    socket.emit('send_message', msgData)
    setMessage('')
    if (isTyping) {
      setIsTyping(false)
      socket.emit('typing_stop', { roomId, senderId })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    } else {
      handleTyping()
    }
  }

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      <div className="bg-indigo-50 px-4 py-3 border-b border-gray-300 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">
              {userName ? `Chat with ${userName}` : 'Chat'}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-2 text-red-700 text-sm">{error}</div>
      )}

      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                msg.senderId === senderId ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm">{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.senderId === senderId ? 'text-indigo-100' : 'text-gray-500'}`}>
                {formatTime(msg.timestamp)}
                {msg.senderId === senderId && (
                  <span className="ml-2">{msg.isRead ? '✓✓' : '✓'}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
              <div className="text-sm text-gray-500 italic">
                {typingUsers.length === 1 ? 'User is typing...' : 'Multiple users typing...'}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-300 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
