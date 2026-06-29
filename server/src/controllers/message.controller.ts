import { Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service.js';
import { AuthRequest } from '../types/index.js';

export const MessageController = {
  sendMessage: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const { receiverId, text } = req.body;

      const message = MessageService.sendMessage(
        req.user.userId,
        req.user.email,
        receiverId,
        text
      );

      res.status(201).json({
        success: true,
        data: message,
        message: 'Message sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  },

  getConversation: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const contactId = req.params.contactId as string;
      const messages = MessageService.getConversation(req.user.userId, contactId);

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  },

  getContacts: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const contacts = MessageService.getContacts(req.user.userId);

      res.json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  },

  getUnreadCount: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const count = MessageService.getUnreadCount(req.user.userId);

      res.json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      next(error);
    }
  },
};
