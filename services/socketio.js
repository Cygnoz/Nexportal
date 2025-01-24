const Chat = require('../database/model/ticketChat'); // Chat Schema
const Leads = require('../database/model/leads'); // For customers
const User = require('../database/model/user'); // For agents
 
const Socket = (socket, io) => {
    console.log(`User connected: ${socket.id}`);
 
    // Join room based on ticketId
    socket.on('joinRoom', (ticketId) => {
        socket.join(ticketId);
        console.log(`User joined room: ${ticketId}`);
 
        // Emit the chat history when a user joins a room
        socket.emit('requestChatHistory', ticketId);
    });
 
    // Listen for new messages
    socket.on('sendMessage', async (data) => {
        const { ticketId, senderId, receiverId, message } = data;
 
        // Save the message in the database
        const newMessage = await Chat.create({
            ticketId,
            senderId,
            receiverId,
            message,
            isRead: false
        });
 
        console.log('Saved message:', newMessage);
 
       
 
        // Emit the message to the room identified by ticketId
        io.to(ticketId).emit('newMessage', {
            ticketId,
            senderId,
            message,
            timestamp: new Date(),
        });
 
        console.log(`Message in room ${ticketId} from ${senderId}: ${message}`);
    });
 
    // Handle request for chat history
    socket.on('requestChatHistory', async (ticketId) => {
        try {
            // Fetch messages associated with the ticketId from the database
            const messages = await Chat.find({ ticketId })
                .sort({ createdAt: -1 })
                .limit(50); // Optionally limit number of messages
 
            // Process messages to populate names and roles dynamically
            const processedMessages = await Promise.all(
                messages.map(async (message) => {
                    const processedMessage = { ...message.toObject() };
 
                    // Fetch sender details
                    if (message.senderId) {
                        const lead = await Leads.findOne({ email: message.senderId });
                        if (lead) {
                            processedMessage.senderId = {
                                name: lead.fullName || `${lead.firstName} ${lead.lastName}`,
                                role: 'Customer'
                            };
                        } else {
                            const user = await User.findById(message.senderId); // Otherwise, sender is a support agent
                            if (user) {
                                processedMessage.senderId = {
                                    name: user.userName,
                                    role: user.role
                                };
                            }
                        }
                    }
 
                    // Fetch receiver details
                    if (message.receiverId) {
                        const lead = await Leads.findOne({ email: message.receiverId });
                        if (lead) {
                            processedMessage.receiverId = {
                                name: lead.fullName || `${lead.firstName} ${lead.lastName}`,
                                role: 'Customer'
                            };
                        } else {
                            const user = await User.findById(message.receiverId); // Otherwise, receiver is a support agent
                            if (user) {
                                processedMessage.receiverId = {
                                    name: user.userName,
                                    role: user.role
                                };
                            }
                        }
                    }
 
                    return processedMessage;
                })
            );
 
            // Emit the chat history back to the client
            socket.emit('chatHistory', processedMessages);
        } catch (error) {
            console.error(error);
            socket.emit('error', { message: 'Failed to retrieve chat history', error });
        }
    });
 
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
};
 
module.exports = Socket;
 