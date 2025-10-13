import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    unreadMessages: typeof window !== "undefined" && window.localStorage.getItem("unreadMessages") !== null
        ? JSON.parse(window.localStorage.getItem("unreadMessages"))
        : {}, // {userId: count}
    isSoundEnabled: typeof window !== "undefined" && window.localStorage.getItem("isSoundEnabled") !== null
        ? JSON.parse(window.localStorage.getItem("isSoundEnabled")) === true
        : false,
    subscribeToNewUsers: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newUser", (newUser) => {
            const { allContacts } = get();
            // Only add if user is not already in contacts
            if (!allContacts.find(contact => contact._id === newUser._id)) {
                set({ allContacts: [...allContacts, newUser] });
            }
        });

        // Subscribe to profile updates
        socket.on("profileUpdate", ({ userId, profilePic }) => {
            get().handleProfileUpdate(userId, profilePic);
        });
    },
    unsubscribeFromNewUsers: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newUser");
            socket.off("profileUpdate");
        }
    },
    toggleSound: () => {
        if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        }
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    handleProfileUpdate: (userId, profilePic) => {
        const { allContacts, chats, selectedUser } = get();
        
        // Update contacts
        const updatedContacts = allContacts.map(contact => 
            contact._id === userId ? { ...contact, profilePic } : contact
        );
        
        // Update chats
        const updatedChats = chats.map(chat => 
            chat._id === userId ? { ...chat, profilePic } : chat
        );
        
        // Update selected user if it's the same user
        const updatedSelectedUser = selectedUser && selectedUser._id === userId
            ? { ...selectedUser, profilePic }
            : selectedUser;
        
        set({ 
            allContacts: updatedContacts,
            chats: updatedChats,
            selectedUser: updatedSelectedUser
        });
    },
    
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => {
        const { unreadMessages } = get();
        // Clear unread messages when selecting a user
        if (selectedUser) {
            const newUnreadMessages = { ...unreadMessages };
            delete newUnreadMessages[selectedUser._id];
            // Save to localStorage
            if (typeof window !== "undefined") {
                window.localStorage.setItem("unreadMessages", JSON.stringify(newUnreadMessages));
            }
            set({ selectedUser, unreadMessages: newUnreadMessages });
        } else {
            set({ selectedUser });
        }
    },

    incrementUnreadMessages: (userId) => {
        const { unreadMessages, selectedUser } = get();
        // Don't increment if the chat with this user is currently open
        if (selectedUser?._id === userId) return;
        
        const currentCount = unreadMessages[userId] || 0;
        const newUnreadMessages = {
            ...unreadMessages,
            [userId]: currentCount + 1
        };
        
        // Save to localStorage
        if (typeof window !== "undefined") {
            window.localStorage.setItem("unreadMessages", JSON.stringify(newUnreadMessages));
        }
        set({ unreadMessages: newUnreadMessages });
    },

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("messages/chats");
            set({ chats: res.data });

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    clearMessages: () => set({ messages: [] }),
    clearChats: () => set({ chats: [] }),
    clearUnreadMessages: () => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("unreadMessages");
        }
        set({ unreadMessages: {} });
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });

            // Clear unread messages when loading messages
            const { unreadMessages } = get();
            const newUnreadMessages = { ...unreadMessages };
            delete newUnreadMessages[userId];
            if (typeof window !== "undefined") {
                window.localStorage.setItem("unreadMessages", JSON.stringify(newUnreadMessages));
            }
            set({ unreadMessages: newUnreadMessages });

        } catch (error) {
            toast.error(error.response?.data?.message || "Something Went Wrong");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage:async (messageData)=>{
        const {selectedUser, messages, chats} = get();
        const {authUser}=useAuthStore.getState()
        const tempId = `temp-${Date.now()}`

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        //immideately show the message in the UI
        set({ messages: [...messages, optimisticMessage] });

        // Optimistically update chat order
        if (chats.length > 0) {
            const receiverIndex = chats.findIndex(chat => chat._id === selectedUser._id);
            if (receiverIndex !== -1) {
                const updatedChats = [...chats];
                const [receiver] = updatedChats.splice(receiverIndex, 1);
                updatedChats.unshift(receiver);
                set({ chats: updatedChats });
            }
        }

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            const serverMessage = res.data;
            // replace optimistic message with server message
            const updatedMessages = get().messages.map((m) => (m._id === tempId ? serverMessage : m));
            set({ messages: updatedMessages });
        } catch (error) {
            // revert to messages without the optimistic one
            const reverted = get().messages.filter((m) => m._id !== tempId);
            set({ messages: reverted });

            // Revert chat order
            const { getMyChatPartners } = get();
            getMyChatPartners();

            const msg = error?.response?.data?.message || error?.message || "Something went wrong";
            toast.error(msg);
        }
    },
    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const { selectedUser, isSoundEnabled, chats, messages } = get();
            const { authUser } = useAuthStore.getState();

            // Don't count messages from the current user
            if (newMessage.senderId === authUser._id) {
                return;
            }

            // Update messages if chat is open with sender
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                set({ messages: [...messages, newMessage] });
            } 
            
            // Always increment unread count if not in the selected chat
            if (!selectedUser || newMessage.senderId !== selectedUser._id) {
                const { incrementUnreadMessages } = get();
                incrementUnreadMessages(newMessage.senderId);
            }

            // Update chats order when new message arrives
            if (chats.length > 0) {
                const senderIndex = chats.findIndex(chat => chat._id === newMessage.senderId);
                if (senderIndex !== -1) {
                    // Move the sender to the top of the list
                    const updatedChats = [...chats];
                    const [sender] = updatedChats.splice(senderIndex, 1);
                    updatedChats.unshift(sender);
                    set({ chats: updatedChats });
                } else if (newMessage.senderId !== authUser._id) {
                    // If sender not in chats, refresh the list
                    const { getMyChatPartners } = get();
                    getMyChatPartners();
                }
            } else if (newMessage.senderId !== authUser._id) {
                // If no chats yet, refresh the list
                const { getMyChatPartners } = get();
                getMyChatPartners();
            }

            // Play notification sound if enabled
            if (isSoundEnabled) {
                const notificationSound = new Audio("/sounds/notification.mp3");
                notificationSound.currentTime = 0;
                notificationSound.play().catch((e) => console.log("Audio play failed:", e));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))