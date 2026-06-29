import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Message, User } from '../types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Send, Phone, Video, Search, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('to');
  const { user } = useAuth();

  const [contacts, setContacts] = useState<User[]>([]);
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await api.messages.getContacts();
      if (res.success && res.data) {
        setContacts(res.data);

        if (targetId) {
          const target = res.data.find(c => c.id === targetId);
          if (target) {
            setActiveChat(target);
            setShowSidebar(false);
          }
        } else if (res.data.length > 0) {
          setActiveChat(res.data[0]);
        }
      }
      setLoading(false);
    };
    fetchContacts();
  }, [targetId]);

  useEffect(() => {
    if (activeChat && user) {
      const fetchMessages = async () => {
        const res = await api.messages.getConversation(activeChat.id);
        if (res.success && res.data) {
          setMessages(res.data);
        }
      };
      fetchMessages();
    }
  }, [activeChat, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !newMessage.trim()) return;

    try {
      const res = await api.messages.send({ receiverId: activeChat.id, text: newMessage });
      if (res.success && res.data) {
        setMessages([...messages, res.data]);
        setNewMessage('');
      } else {
        toast.error(res.error || 'Failed to send message.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Message failed: ${errorMessage}`);
    }
  };

  if (loading) return <div className="h-[600px] flex items-center justify-center">Loading chats...</div>;

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-3xl shadow-sm border overflow-hidden relative">
      {/* Sidebar: Contacts */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 border-r flex flex-col bg-white z-10`}>
        <div className="p-4 border-b space-y-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-10" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {contacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => {
                setActiveChat(contact);
                setShowSidebar(false);
              }}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${activeChat?.id === contact.id ? 'bg-slate-100' : ''}`}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="font-semibold truncate">{contact.name}</span>
                  <span className="text-[10px] text-muted-foreground">12:45 PM</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">Click to start chatting</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className={`${!showSidebar ? 'flex' : 'hidden'} lg:flex flex-1 flex flex-col bg-slate-50/30 w-full`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowSidebar(true)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeChat.avatar} />
                  <AvatarFallback>{activeChat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold leading-none">{activeChat.name}</h3>
                  <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Online
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                        isMe ? 'bg-primary text-primary-foreground' : 'bg-white'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8" />
            </div>
            <p>Select a contact to start messaging</p>
            <Button variant="ghost" className="lg:hidden mt-4" onClick={() => setShowSidebar(true)}>
              View Contacts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
