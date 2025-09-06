
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { Chat, Message, User, EnrichedChat } from '../types';
import { PageSpinner, Spinner } from '../components/Spinner';
import { IconArrowLeft, IconSend, IconPaperclip, IconSmile } from '../constants';
import { Avatar } from '../components/Avatar';
import { supabase } from '../services/supabaseClient';

interface EnrichedChatWithParticipant extends Chat {
    otherParticipant: User;
}

// Define the shape of the message row from the database
type MessageRow = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
};

const Header = ({ user, onBack }: { user: User, onBack: () => void }) => (
    <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
        <button onClick={onBack} className="mr-4"><IconArrowLeft size={22} /></button>
        <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
        <h1 className="font-orbitron text-lg font-bold text-white ml-3 truncate">{user.name}</h1>
    </div>
);

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

        const fetchChatData = async () => {
            setLoading(true);
            const enrichedChats = await api.getEnrichedChatsForUser(currentUser.id);
            let currentChat: EnrichedChat | undefined | null = enrichedChats.find(c => c.id === chatId);

            // If chat is not found (i.e., it's a new, empty chat), create a virtual one.
            if (!currentChat) {
                const otherParticipant = await api.getUserById(chatId);
                if (otherParticipant) {
                    // The User type is a subset of UserProfile, so this is safe.
                    const otherParticipantAsUser: User = {
                        id: otherParticipant.id,
                        name: otherParticipant.name,
                        avatarUrl: otherParticipant.avatarUrl,
                        role: otherParticipant.role,
                    };
                    currentChat = {
                        id: otherParticipant.id,
                        participants: [currentUser.id, otherParticipant.id],
                        messages: [],
                        otherParticipant: otherParticipantAsUser,
                    };
                }
            }

            if (currentChat) {
                setChat({
                    id: currentChat.id,
                    participants: currentChat.participants,
                    messages: currentChat.messages,
                    otherParticipant: currentChat.otherParticipant,
                });
            }
            setLoading(false);
        }
        fetchChatData();

    }, [chatId, currentUser, navigate]);
    
    // Real-time message listener
    useEffect(() => {
        if (!chat || !currentUser) return;
    
        const channel = supabase
            .channel(`messages:${currentUser.id}:${chat.id}`)
            .on<MessageRow>(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'app_e255c3cdb5_messages',
                    filter: `or(and(sender_id.eq.${currentUser.id},recipient_id.eq.${chat.otherParticipant.id}),and(sender_id.eq.${chat.otherParticipant.id},recipient_id.eq.${currentUser.id}))`,
                },
                (payload) => {
                    const newMessageRow = payload.new;
                    const appMessage: Message = {
                        id: newMessageRow.id,
                        senderId: newMessageRow.sender_id,
                        recipientId: newMessageRow.recipient_id,
                        text: newMessageRow.content,
                        timestamp: newMessageRow.created_at,
                    };

                    // Only add the message if it's from the other participant to avoid duplicates
                    if (appMessage.senderId !== currentUser.id) {
                        setChat(prev => {
                            if (!prev || prev.messages.some(m => m.id === appMessage.id)) {
                                return prev;
                            }
                            return { ...prev, messages: [...prev.messages, appMessage] };
                        });
                    }
                }
            )
            .subscribe();
    
        return () => {
            supabase.removeChannel(channel);
        };
    }, [chat, currentUser]);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     }, [chat?.messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId || !currentUser || !chat) return;

        setSending(true);
        // Optimistic update
        const tempId = `temp_${Date.now()}`;
        const optimisticMessage: Message = {
            id: tempId,
            senderId: currentUser.id,
            recipientId: chat.otherParticipant.id,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };
        setChat(prev => prev ? { ...prev, messages: [...prev.messages, optimisticMessage] } : null);
        setNewMessage('');
        
        const sentMessage = await api.sendMessage(currentUser.id, chat.otherParticipant.id, optimisticMessage.text);
        
        // Replace optimistic message with real one from the server
        if (sentMessage && chat) {
            setChat(prev => prev ? {
                ...prev,
                messages: prev.messages.map(m => m.id === tempId ? sentMessage : m)
            } : null);
        } else {
            // Revert on failure
            setChat(prev => prev ? {
                ...prev,
                messages: prev.messages.filter(m => m.id !== tempId)
            } : null);
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
