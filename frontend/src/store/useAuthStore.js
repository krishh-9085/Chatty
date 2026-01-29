import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    // ✅ Check auth on refresh
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // ✅ Signup
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // ✅ Login
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // ✅ Logout
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });

            const chatStore = (await import("./useChatStore")).useChatStore.getState();
            chatStore.setSelectedUser(null);
            chatStore.clearMessages();
            chatStore.clearChats();
            chatStore.clearUnreadMessages();

            get().disconnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
        }
    },

    // ✅ Update profile
    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });

            const chatStore = (await import("./useChatStore")).useChatStore.getState();
            chatStore.handleProfileUpdate(res.data._id, res.data.profilePic);

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
        }
    },

    // ✅ Connect Socket.IO (FIXED)
    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io(BACKEND_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        set({ socket: newSocket });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    // ✅ Disconnect socket
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));
