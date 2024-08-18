import { faker } from "@faker-js/faker";
import { subDays, addMinutes, startOfDay, endOfDay } from "date-fns";
import { Chat } from "../models/chat.models.js";
import { ChatMessage } from "../models/message.models.js";

export const seedChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat by ID
    const chat = await Chat.findById(chatId).populate("participants");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Extract participants
    const participants = chat.participants;

    if (participants.length === 0) {
      return res.status(400).json({ message: "No participants in this chat" });
    }

    const messages = [];
    const totalMessages = 400;
    const days = 15;

    for (let i = 0; i < days; i++) {
      // Get random number of messages for each day
      const messagesForDay =
        Math.floor(Math.random() * (totalMessages / days)) + 15;

      // Calculate the date for this day
      const dayStart = startOfDay(subDays(new Date(), i));
      const dayEnd = endOfDay(dayStart);

      for (let j = 0; j < messagesForDay; j++) {
        // Pick a random participant as sender
        const sender =
          participants[Math.floor(Math.random() * participants.length)];

        // Randomize the message time within the day
        const messageTime = addMinutes(
          dayStart,
          Math.floor(Math.random() * (dayEnd.getTime() - dayStart.getTime())) /
            60000
        );

        // Create a message object
        const message = new ChatMessage({
          sender: sender._id,
          content: faker.lorem.sentence(), // Optional: Replace with desired content
          chat: chatId,
          createdAt: messageTime,
          updatedAt: messageTime,
        });

        messages.push(message);
      }
    }

    // Shuffle and limit messages to the desired count
    // messages.sort(() => 0.5 - Math.random());
    // const finalMessages = messages.slice(0, totalMessages);

    // Save all messages to the database
    await ChatMessage.insertMany(messages);

    res.status(200).json({
      message: `${messages.length} messages seeded successfully.`,
        data: messages,
    });
  } catch (error) {
    console.error("Error seeding chat messages:", error);
    res.status(500).json({ message: "Failed to seed chat messages" });
  }
};
