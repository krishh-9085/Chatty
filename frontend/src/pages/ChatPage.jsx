import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
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

  // Get searchValue from ProfileHeader (window property)
  const [searchValue, setSearchValue] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSearchValue(window.__chatty_searchValue || "");
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full h-screen">
        <div className="flex w-full h-full shadow-2xl overflow-hidden border-0" style={{background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'}}>
          {/* LEFT SIDE - Hide on mobile when chat is open */}
          <div className={`md:w-80 w-full bg-slate-800/60 backdrop-blur-sm flex flex-col transition-all duration-300 ${selectedUser ? 'hidden md:flex' : 'flex'} border-r border-slate-700/40`}>
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {activeTab === "chats" ? <ChatsList searchValue={searchValue} /> : <ContactList searchValue={searchValue} />}
            </div>
          </div>

          {/* RIGHT SIDE - Full width on mobile when chat is open */}
          <div className={`flex-1 flex flex-col bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm transition-all duration-300 ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
            {selectedUser ? (
              <ChatContainer />
            ) : (
              <NoConversationPlaceholder />
            )}
          </div>
        </div>
      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

export default ChatPage
