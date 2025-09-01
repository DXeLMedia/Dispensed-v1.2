



import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { Chat, Message, User } from '../types';
import { PageSpinner, Spinner } from '../components/Spinner';
import { IconArrowLeft, IconSend, IconPaperclip, IconSmile } from '../constants';
import { Avatar } from '../components/Avatar';

interface EnrichedChatWithParticipant extends Chat {
    otherParticipant: User;
}

const Header = ({ user, onBack }: { user: User, onBack: () => void }) => (
    <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
        <button onClick={onBack} className="mr-4"><IconArrowLeft size={22} /></button>
        <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
        <h1 className="font-orbitron text-lg font-bold text-white ml-3 truncate">{user.name}</h1>
    </div>
);

// FIX: Changed component to use React.FC and a props interface to fix TypeScript error with `key` prop.
interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => (
    <div className={`flex items-end gap-2 my-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-4 py-2 rounded-2xl ${isOwnMessage ? 'bg-lime-500 text-black rounded-br-lg' : 'bg-zinc-800 text-white rounded-bl-lg'}`}>
            <p className="break-words">{message.text}</p>
        </div>
    </div>
);


export const ChatRoom = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [chat, setChat] = useState<EnrichedChatWithParticipant | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatId || !currentUser) {
            navigate('/messages');
            return;
        }

        api.getChatById(chatId).then(data => {
            if (data && data.participants.includes(currentUser.id)) {
                const otherId = data.participants.find(p => p !== currentUser.id)!;
                api.getUserById(otherId).then(otherUser => {
                    if(otherUser) {
                        setChat({ ...data, otherParticipant: otherUser });
                    }
                     setLoading(false);
                });
            } else {
                 setLoading(false);
            }
        });
    }, [chatId, currentUser, navigate]);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     }, [chat?.messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId || !currentUser || !chat) return;

        setSending(true);
        // FIX: Swapped senderId and recipientId to match the API and satisfy RLS policy.
        // The current user must be the sender.
        const sentMessage = await api.sendMessage(currentUser.id, chat.otherParticipant.id, newMessage.trim());
        
        if (sentMessage && chat) {
            setChat(prev => prev ? { ...prev, messages: [...prev.messages, sentMessage] } : null);
            setNewMessage('');
        }
        setSending(false);
    };


    if (loading) return <PageSpinner />;
    if (!chat) return <div className="text-center text-red-500 p-8">Chat not found or you don't have access.</div>;

    return (
        <div className="text-white h-full flex flex-col">
            <Header user={chat.otherParticipant} onBack={() => navigate(-1)} />
            <div className="flex-1 overflow-y-auto p-4">
                {chat.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUser?.id} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 bg-black border-t border-zinc-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button type="button" className="p-2 text-zinc-400 hover:text-lime-400"><IconPaperclip size={22}/></button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 text-white pr-10"
                            disabled={sending}
                        />
                         <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-lime-400"><IconSmile size={22}/></button>
                    </div>
                    <button type="submit" className="bg-lime-400 text-black p-3 rounded-full disabled:bg-zinc-600 transition-colors" disabled={sending || !newMessage.trim()}>
                        {sending ? <Spinner /> : <IconSend size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};