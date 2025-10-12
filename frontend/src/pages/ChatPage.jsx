import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

function ChatPage() {
  const {logout} = useAuthStore();
  return (
    <div>
      <button className="z-10 " onClick={logout}>Logout</button>
    </div>
  )
}

export default ChatPage
