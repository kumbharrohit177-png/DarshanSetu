import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! I am Nandi, your spiritual guide. 🙏 How can I assist you with your pilgrimage today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setLoading(true);

        try {
            const { data } = await api.post('/chat/message', { message: userMsg.text });
            const botMsg = { text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { text: "I am having trouble connecting to the divine network. Please try again later.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-orange-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Sparkles size={20} className="text-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Nandi AI</h3>
                                    <span className="text-xs text-orange-100 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="h-80 overflow-y-auto p-4 bg-orange-50/30 scrollbar-thin scrollbar-thumb-orange-200">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                                ? 'bg-orange-500 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} className="mb-1 last:mb-0">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask about bookings, temples..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="flex-grow px-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || loading}
                                className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-600 text-white rotate-90' : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}
            </motion.button>
        </div>
    );
};

export default ChatBot;
