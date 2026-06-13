import { generateClient } from 'aws-amplify/data'
import { useEffect, useMemo, useRef, useState } from 'react'

const formatTimestamp = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const getUserEmail = (user) =>
  user?.signInDetails?.loginId || user?.attributes?.email || user?.username || ''

const getDisplayName = (user, email) =>
  user?.attributes?.name || user?.attributes?.preferred_username || email.split('@')[0] || 'Artist'

const sortByCreatedAt = (messages) =>
  [...messages].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))

export default function StudioChat({ user }) {
  const clientRef = useRef(null)
  if (clientRef.current === null) {
    clientRef.current = generateClient()
  }

  const client = clientRef.current
  const senderEmail = useMemo(() => getUserEmail(user), [user])
  const senderDisplayName = useMemo(
    () => getDisplayName(user, senderEmail),
    [user, senderEmail]
  )
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMessages() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const { data } = await client.models.ChatMessage.list({ limit: 50 })
        if (isMounted) {
          setMessages(sortByCreatedAt(data || []))
        }
      } catch (error) {
        console.error('Error loading chat messages:', error)
        if (isMounted) {
          setErrorMessage('Could not load chat messages.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMessages()

    return () => {
      isMounted = false
    }
  }, [client])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const body = messageText.trim()
    if (!body || isSending) return

    if (!senderEmail) {
      setErrorMessage('Could not identify signed-in user.')
      return
    }

    setIsSending(true)
    setErrorMessage('')

    try {
      const { data } = await client.models.ChatMessage.create({
        body,
        senderEmail,
        senderDisplayName,
      })

      if (data) {
        setMessages((current) => sortByCreatedAt([...current, data]))
      }
      setMessageText('')
    } catch (error) {
      console.error('Error sending chat message:', error)
      setErrorMessage('Could not send message.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-[#120724] border border-ast_blue/20 rounded-xl p-4 h-full flex flex-col">
      <h2 className="text-sm font-bold text-ast_lavender/70 mb-4">STUDIO CHAT</h2>

      <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
        {isLoading && (
          <p className="text-xs text-ast_body/50">Loading chat...</p>
        )}

        {!isLoading && messages.length === 0 && (
          <p className="text-xs text-ast_body/50">No messages yet.</p>
        )}

        {!isLoading && messages.map((message) => (
          <div key={message.id} className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-ast_purple/30 flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="text-xs font-bold text-ast_turquoise">
                  {message.senderDisplayName || message.senderEmail || 'Artist'}
                </p>
                {message.senderEmail && (
                  <p className="truncate text-[10px] text-ast_body/45">
                    {message.senderEmail}
                  </p>
                )}
              </div>
              <p className="text-xs text-ast_body/80 break-words">{message.body}</p>
              {message.createdAt && (
                <p className="mt-0.5 text-[10px] text-ast_body/40">
                  {formatTimestamp(message.createdAt)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {errorMessage && (
        <p className="mb-2 text-xs text-pink-300">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          placeholder="Message..."
          className="flex-1 bg-ast_deep/70 border border-ast_lavender/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-ast_turquoise"
        />
        <button
          type="submit"
          disabled={isSending || !messageText.trim()}
          className="bg-ast_turquoise/20 border border-ast_turquoise text-ast_turquoise px-3 py-2 rounded-lg hover:bg-ast_turquoise/30 transition text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSending ? 'Sending' : 'Send'}
        </button>
      </form>
    </div>
  )
}
