import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList({ searchValue = "" }) {
  const { 
    getAllContacts, 
    allContacts, 
    setSelectedUser, 
    isUsersLoading,
    subscribeToNewUsers,
    unsubscribeFromNewUsers
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
    subscribeToNewUsers();

    return () => {
      unsubscribeFromNewUsers();
    };
  }, [getAllContacts, subscribeToNewUsers, unsubscribeFromNewUsers]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  const filteredContacts = allContacts.filter(contact =>
    contact.fullName.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <>
      {filteredContacts.length === 0 ? (
        <div className="text-slate-400 text-center py-4">No users found.</div>
      ) : (
        filteredContacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={contact.profilePic || "/avatar.png"} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
            </div>
          </div>
        ))
      )}
    </>
  );
}
export default ContactList;