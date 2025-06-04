// useChatSocket.js
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatEventEnum } from "constants";
import api from "api";
import { useSocket } from "context/SocketContext";
import { markAsRead } from "reducer/notification/notification.thunk";

const useChatSocket = (chatId) => {
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const [activeChat, setActiveChat] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const getActiveChat = async () => {
      try {
        const response = await api.get(`/chats/c/${chatId}`);
        const chat = response.data.data;
        setActiveChat(chat);
        setRecipient(
          chat.participants.find((participant) => participant._id !== user._id)
        );
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    const getMessages = async () => {
      try {
        const response = await api.get(`/messages/${chatId}`);
        setMessages(response.data.data.messages);

        await dispatch(markAsRead({ chatId })).unwrap();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (chatId) {
      getActiveChat();
      getMessages();
      socket?.emit(ChatEventEnum.JOIN_CHAT_EVENT, chatId);

      return () => {
        socket?.emit(ChatEventEnum.LEAVE_CHAT_EVENT, chatId);
      };
    }
  }, [chatId, socket]);

  useEffect(() => {
    if (socket) {
      const handleMessageReceived = (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload]);
      };
      const handleTyping = () => setIsTyping(true);
      const handleStopTyping = () => setIsTyping(false);

      socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, handleMessageReceived);
      socket.on(ChatEventEnum.TYPING_EVENT, handleTyping);
      socket.on(ChatEventEnum.STOP_TYPING_EVENT, handleStopTyping);

      return () => {
        socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT, handleMessageReceived);
        socket.off(ChatEventEnum.TYPING_EVENT, handleTyping);
        socket.off(ChatEventEnum.STOP_TYPING_EVENT, handleStopTyping);
      };
    }
  }, [socket]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage.trim() !== "") {
      try {
        const res = await api.post(`/messages/${chatId}`, {
          content: newMessage,
        });
        setMessages((prevMessages) => [...prevMessages, res.data.data]);
        setNewMessage("");
        socket.emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
        setSelfTyping(false);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleOnMessageChange = useCallback(
    (e) => {
      setNewMessage(e.target.value);
      if (!socket) return;

      if (!selfTyping) {
        setSelfTyping(true);
        socket.emit(ChatEventEnum.TYPING_EVENT, chatId);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
        setSelfTyping(false);
      }, 2000);
    },
    [chatId, selfTyping, socket]
  );

  return {
    activeChat,
    recipient,
    messages,
    newMessage,
    isTyping,
    handleOnMessageChange,
    sendMessage,
    setNewMessage,
  };
};

export default useChatSocket;
