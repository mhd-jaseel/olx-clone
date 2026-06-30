import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FiSend, FiUser, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Chats = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selected conversation
  const [activeChat, setActiveChat] = useState(null); // { product, otherUser }
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Fetch all conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations');
        setConversations(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load chats');
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Poll chat messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const fetchHistory = async () => {
      try {
        const { data } = await api.get(
          `/messages/chat/${activeChat.product._id}/${activeChat.otherUser._id}`
        );
        setMessages(data);
      } catch (err) {
        console.error('Failed to update message logs');
      }
    };

    fetchHistory(); // Fetch immediately
    const timer = setInterval(fetchHistory, 3000); // Poll every 3 seconds for updates

    return () => clearInterval(timer);
  }, [activeChat]);

  // Scroll to bottom of chat logs when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;

    setSending(true);
    try {
      const { data } = await api.post('/messages', {
        receiver: activeChat.otherUser._id,
        product: activeChat.product._id,
        content: replyText,
      });
      setMessages([...messages, data]);
      setReplyText('');
      
      // Update last message in the local conversation list
      setConversations((prev) =>
        prev.map((c) => {
          if (
            c.product._id === activeChat.product._id &&
            c.otherUser._id === activeChat.otherUser._id
          ) {
            return {
              ...c,
              lastMessage: {
                content: data.content,
                createdAt: data.createdAt,
                senderId: user._id,
              },
            };
          }
          return c;
        })
      );
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto md:px-4 py-6 bg-gray-50 min-h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4">
      {/* Conversations Sidebar (Left Pane) */}
      <div
        className={`w-full md:w-80 bg-white border md:rounded-lg shadow-sm flex flex-col ${
          activeChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b bg-primary text-white md:rounded-t-lg">
          <h2 className="font-extrabold text-lg">Inbox Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">
              No conversations found.
            </div>
          ) : (
            conversations.map((convo, idx) => {
              const isActive =
                activeChat &&
                activeChat.product._id === convo.product._id &&
                activeChat.otherUser._id === convo.otherUser._id;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveChat(convo)}
                  className={`p-4 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isActive ? 'bg-blue-50 hover:bg-blue-50 border-l-4 border-primary' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center border">
                    {convo.product.images && convo.product.images.length > 0 ? (
                      <img
                        src={convo.product.images[0]}
                        alt={convo.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">No Img</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-sm text-primary truncate max-w-[70%]">
                        {convo.otherUser.name}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(convo.lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 truncate mb-1">
                      {convo.product.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate italic">
                      {convo.lastMessage.senderId === user._id ? 'You: ' : ''}
                      {convo.lastMessage.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Messages Pane (Right Pane) */}
      <div
        className={`flex-grow bg-white border md:rounded-lg shadow-sm flex flex-col h-[calc(100vh-8rem)] ${
          !activeChat ? 'hidden md:flex justify-center items-center text-gray-500' : 'flex'
        }`}
      >
        {activeChat ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b flex items-center gap-3 bg-gray-50 md:rounded-t-lg">
              {/* Back Button (Mobile only) */}
              <button
                onClick={() => setActiveChat(null)}
                className="md:hidden text-primary hover:text-[#002f34] mr-1 p-1 hover:bg-gray-200 rounded-full"
              >
                <FiArrowLeft size={20} />
              </button>

              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {activeChat.otherUser.profileImage && activeChat.otherUser.profileImage !== 'default.jpg' ? (
                  <img
                    src={activeChat.otherUser.profileImage}
                    alt={activeChat.otherUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={20} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-primary text-sm">
                  {activeChat.otherUser.name}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  Item: <span className="font-semibold">{activeChat.product.title}</span> (₹
                  {activeChat.product.price.toLocaleString()})
                </p>
              </div>
            </div>

            {/* Message logs */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f2f4f5]">
              {messages.map((msg, idx) => {
                const isMine = msg.sender._id === user._id || msg.sender === user._id;

                return (
                  <div
                    key={idx}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${
                        isMine
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white text-primary rounded-bl-none border border-gray-200'
                      }`}
                    >
                      <p className="leading-relaxed break-words">{msg.content}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          isMine ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t bg-gray-50 flex gap-2 md:rounded-b-lg">
              <input
                type="text"
                placeholder="Type a message..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-grow border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-primary text-white p-2 rounded-full hover:bg-opacity-95 flex items-center justify-center cursor-pointer transition-colors w-10 h-10 flex-shrink-0"
              >
                <FiSend size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center p-8">
            <FiMessageSquare size={48} className="mx-auto text-gray-300 mb-2" />
            <h3 className="font-bold text-gray-700 text-lg">Select a conversation</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose a contact from the inbox list on the left to start sending messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
