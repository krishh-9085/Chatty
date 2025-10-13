import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        res.status(500).json({ message: "server error" })
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;
        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(message);

    } catch (error) {
        console.log("Error in getMessagesByUserId:", error.message);
        res.status(500).json({ message: "server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(": ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all messages and their latest timestamps for each chat partner
        const latestMessages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ]
                }
            },
            {
                $project: {
                    chatPartnerId: {
                        $cond: {
                            if: { $eq: ["$senderId", loggedInUserId] },
                            then: "$receiverId",
                            else: "$senderId"
                        }
                    },
                    createdAt: 1
                }
            },
            {
                $group: {
                    _id: "$chatPartnerId",
                    lastMessageAt: { $max: "$createdAt" }
                }
            },
            {
                $sort: { lastMessageAt: -1 }
            }
        ]);

        const chatPartnerIds = latestMessages.map(msg => msg._id);
        
        // Get user details in the same order as the sorted messages
        const chatPartners = [];
        for (const partnerId of chatPartnerIds) {
            const partner = await User.findById(partnerId).select("-password");
            if (partner) chatPartners.push(partner);
        }

        res.status(200).json(chatPartners)
    } catch (error) {
        console.log("Error in getMessagesByUserId:", error.message);
        res.status(500).json({ message: "server error" });


    }
};