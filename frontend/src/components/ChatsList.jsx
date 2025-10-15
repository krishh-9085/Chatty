import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList({ searchValue = "" }) {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  const filteredChats = chats.filter(chat =>
    chat.fullName.toLowerCase().includes(searchValue.toLowerCase())
  );
  if (filteredChats.length === 0) return <div className="text-slate-400 text-center py-4">No users found.</div>;
  return (
    <>
      {filteredChats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
            </div>
            {unreadMessages[chat._id] > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-cyan-500 text-white rounded-full">
                {unreadMessages[chat._id]}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;