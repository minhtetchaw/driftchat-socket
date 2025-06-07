import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:4000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New Client connected: ", socket.id);

    const userId = socket.handshake.auth.userId;

    if (userId) {
        axios
            .post("http://localhost:4000/api/user-status", {
                userId,
                isOnline: true,
            })
            .catch(console.error);
    }

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
    });

    socket.on("send-message", (message) => {
        io.to(message.chatId).emit("receive-message", message);
        console.log("New Message EMITTED...");
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);

        if (userId) {
            axios
                .post("http://localhost:4000/api/user-status", {
                    userId,
                    isOnline: false,
                    lastSeen: new Date().toISOString(),
                })
                .catch(console.error);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on port: ${PORT}`);
});
