import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/index.js';

// In-memory message store
const messages: Message[] = [];

export const MessageModel = {
  getConversation: (user1Id: string, user2Id: string): Message[] => {
    return messages
      .filter(m =>
        (m.senderId === user1Id && m.receiverId === user2Id) ||
        (m.senderId === user2Id && m.receiverId === user1Id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  send: (data: {
    senderId: string;
    senderName: string;
    receiverId: string;
    text: string;
  }): Message => {
    const message: Message = {
      id: uuidv4(),
      ...data,
      timestamp: new Date().toISOString(),
      read: false,
    };
    messages.push(message);
    return message;
  },

  markAsRead: (messageId: string): boolean => {
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      msg.read = true;
      return true;
    }
    return false;
  },

  getUnreadCount: (userId: string): number => {
    return messages.filter(m => m.receiverId === userId && !m.read).length;
  },

  getRecentContacts: (userId: string): { contactId: string; lastMessage: string; lastTime: string }[] => {
    const contactMap = new Map<string, { lastMessage: string; lastTime: string }>();

    messages
      .filter(m => m.senderId === userId || m.receiverId === userId)
      .forEach(m => {
        const contactId = m.senderId === userId ? m.receiverId : m.senderId;
        const existing = contactMap.get(contactId);
        if (!existing || new Date(m.timestamp) > new Date(existing.lastTime)) {
          contactMap.set(contactId, {
            lastMessage: m.text,
            lastTime: m.timestamp,
          });
        }
      });

    return Array.from(contactMap.entries())
      .map(([contactId, data]) => ({ contactId, ...data }))
      .sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
  },
};
