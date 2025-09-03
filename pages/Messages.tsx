


import React, { useEffect, useState } from 'react';
import { EnrichedChat } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconArrowLeft, IconPlus } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const handleNewMessage = () => {
        alert("Functionality to start a new chat is coming soon!");
    }
    return (
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-zinc-800">
            <button onClick={() => navigate(-1)}><IconArrowLeft size={22} /></button>
            <h1 className="font-orbitron text-xl font-bold text-white">Inbox</h1>
            <button onClick={handleNewMessage}><IconPlus size={24} /></button>
        </div>
    );
}

interface ChatPreviewProps {
  chat: EnrichedChat;
}
const ChatPreview: React.FC<ChatPreviewProps> = ({ chat }) => (
    <Link to={`/messages/${chat.id}`} className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg transition-colors">
        <Avatar src={chat.otherParticipant.avatarUrl} alt={chat.otherParticipant.name} size="md" />
        <div className="flex-1 overflow-hidden">
            <p className="font-bold text-white truncate">{chat.otherParticipant.name}</p>
            <p className="text-sm text-zinc-400 truncate">{chat.messages[chat.messages.length - 1]?.text}</p>
        </div>
        <p className="text-xs text-zinc-500">{chat.messages[chat.messages.length - 1]?.timestamp}</p>
    </Link>
)


export const Messages = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<EnrichedChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.getEnrichedChatsForUser(user.id).then(data => {
        setChats(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="text-white min-h-full">
      <Header />
      {loading ? (
        <div className="pt-20">
          <Spinner />
        </div>
      ) : (
        <div className="p-2 space-y-1 pb-20">
          {chats.length > 0 ? (
            chats.map(chat => <ChatPreview key={chat.id} chat={chat} />)
          ) : (
            <p className="text-center text-zinc-400 pt-10">No messages yet.</p>
          )}
        </div>
      )}
    </div>
  );
};