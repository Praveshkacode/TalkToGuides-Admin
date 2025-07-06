import React, { useContext, useEffect, useState } from 'react'
import { ExpertContext } from '../../context/ExpertContext'
import Chat from '../../components/Chat'

const ExpertSessions = () => {
  const {
    sessions,
    getSessions,
    profileData,
    getProfileData,
  } = useContext(ExpertContext)

  const [activeChatUserId, setActiveChatUserId] = useState(null)

  useEffect(() => {
    getSessions()
    getProfileData()
  }, [])

  if (!profileData) return <p>Loading expert profile...</p>

  const expertId = profileData._id

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active User Sessions</h2>

      {sessions.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-blue-700">No active sessions found.</p>
          <p className="text-blue-600 text-sm mt-2">
            When users start chatting with you, their sessions will appear here.
          </p>
        </div>
      )}

      {sessions.map((session, index) => {
        const userId = session.userId
        const roomId = `session-${userId}-${expertId}`

        return (
          <div key={index} className="border p-4 mb-6 rounded-md shadow-sm bg-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{session.userName || `User ${userId.substring(0, 6)}`}</p>
                <p className="text-sm text-gray-500">Started: {new Date(session.createdAt || session.date).toLocaleString()}</p>
                {session.userEmail && (
                  <p className="text-xs text-gray-400">{session.userEmail}</p>
                )}
              </div>
              <div className="text-right">
                {session.lastMessage && (
                  <p className="text-xs text-gray-500">Last: {session.lastMessage.substring(0, 30)}...</p>
                )}
              </div>
            </div>

            <button
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
              onClick={() => setActiveChatUserId(userId)}
            >
              {activeChatUserId === userId ? 'Hide Chat' : 'Open Chat'}
            </button>

            {activeChatUserId === userId && (
              <div className="mt-4 border-t pt-4">
                <Chat 
                  roomId={roomId} 
                  senderId={expertId} 
                  senderType="expert"
                  sessionId={roomId}
                  expertId={expertId}
                  userId={userId}
                  userName={session.userName || `User ${userId.substring(0, 6)}`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ExpertSessions
