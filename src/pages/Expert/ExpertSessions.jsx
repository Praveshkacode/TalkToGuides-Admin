import React, { useContext, useEffect, useState } from 'react'
import { ExpertContext } from '../../context/ExpertContext'
import Chat from '../../components/Chat'
import axios from 'axios'
import { toast } from 'react-toastify'

const ExpertSessions = () => {
  const {
    sessions,
    getSessions,
    profileData,
    getProfileData,
    backendUrl
  } = useContext(ExpertContext)

  const [activeChatUserId, setActiveChatUserId] = useState(null)
  const [loadingSessionId, setLoadingSessionId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await getProfileData()
    await getSessions()
  }

  if (!profileData) return <p>Loading expert profile...</p>

  const expertId = profileData._id

  const acceptChat = async (sessionId) => {
    try {
      setLoadingSessionId(sessionId)
      const token = localStorage.getItem('eToken')
      console.log('Accepting session with token:', token)
      console.log('Backend URL:', backendUrl)
      
      const res = await axios.post(`${backendUrl}/api/expert/accept-session/${sessionId}`, {}, {
        headers: {
          eToken: token,
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('Accept session response:', res.data)
      
      if (res.data.success) {
        toast.success('Chat session accepted')
        await getSessions()
      } else {
        toast.error(res.data.message || 'Failed to accept chat')
      }
    } catch (error) {
      console.error('Accept session error:', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoadingSessionId(null)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Sessions</h2>

      {sessions.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-blue-700">No sessions available.</p>
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
                <p className="text-xs text-gray-400 mt-1">Status: {session.status}</p>
              </div>
            </div>

            {session.status === 'pending' && (
              <button
                disabled={loadingSessionId === session._id}
                onClick={() => acceptChat(session._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                {loadingSessionId === session._id ? 'Accepting...' : 'Accept Chat'}
              </button>
            )}

            {session.status === 'active' && (
              <>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                  onClick={() => setActiveChatUserId(userId)}
                >
                  {activeChatUserId === userId ? 'Hide Chat' : 'Open Chat'}
                </button>

                {activeChatUserId === userId && (
                  <div className="mt-4 border-t pt-4">
                    <Chat
                      roomId={session._id}
                      senderId={expertId}
                      senderType="expert"
                      sessionId={session._id}
                      expertId={expertId}
                      userId={userId}
                      userName={session.userName || `User ${userId.substring(0, 6)}`}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ExpertSessions
