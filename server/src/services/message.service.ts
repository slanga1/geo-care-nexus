import { MessageModel } from '../models/message.model.js';
import { UserModel } from '../models/user.model.js';
import { Message, ChatContact } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export const MessageService = {
  sendMessage: (senderId: string, senderName: string, receiverId: string, text: string): Message => {
    // Validate message
    if (!text.trim()) {
      throw new AppError('Message text cannot be empty.', 400);
    }

    if (text.length > 2000) {
      throw new AppError('Message is too long (max 2000 characters).', 400);
    }

    // Verify receiver exists
    const receiver = UserModel.findById(receiverId);
    if (!receiver) {
      throw new AppError('Recipient not found.', 404);
    }

    // Cannot send message to yourself
    if (senderId === receiverId) {
      throw new AppError('Cannot send a message to yourself.', 400);
    }

    return MessageModel.send({ senderId, senderName, receiverId, text: text.trim() });
  },

  getConversation: (user1Id: string, user2Id: string): Message[] => {
    return MessageModel.getConversation(user1Id, user2Id);
  },

  getContacts: (userId: string): ChatContact[] => {
    const recentContacts = MessageModel.getRecentContacts(userId);
    const contacts: ChatContact[] = [];

    for (const rc of recentContacts) {
      const user = UserModel.findById(rc.contactId);
      if (user) {
        contacts.push({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastMessage: rc.lastMessage,
          lastMessageTime: rc.lastTime,
          unreadCount: 0, // Simplified for now
        });
      }
    }

    // Also include all facilities as potential contacts (for new conversations)
    const facilities = UserModel.getAllByRole('facility');
    const existingIds = new Set(contacts.map(c => c.id));

    for (const facility of facilities) {
      if (!existingIds.has(facility.id)) {
        contacts.push({
          id: facility.id,
          name: facility.name,
          email: facility.email,
          role: facility.role,
          avatar: facility.avatar,
          unreadCount: 0,
        });
      }
    }

    return contacts;
  },

  markAsRead: (messageId: string, userId: string): void => {
    const message = MessageModel.getConversation(userId, '').find(m => m.id === messageId);
    // Simplified: just mark as read
    MessageModel.markAsRead(messageId);
  },

  getUnreadCount: (userId: string): number => {
    return MessageModel.getUnreadCount(userId);
  },
};
