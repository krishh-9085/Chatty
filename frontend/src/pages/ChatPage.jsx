import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ProfileHeader from '../components/ProfileHeader';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';
import ChatContainer from '../components/ChatContainer';

function ChatPage() {
  const { activeTab, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    // Subscribe to messages at the page level
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className='relative w-full max-w-6xl min-h-[650px] h-[calc(100vh-2rem)]'>
      <BorderAnimatedContainer>
        {/* LEFT SIDE - Hide on mobile when chat is open */}
        <div className={`md:w-80 w-full bg-slate-800/50 backdrop-blur-sm flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className='flex-1 overflow-y-auto p-4 space-y-2'>
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE - Full width on mobile when chat is open */}
        <div className={`flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage
