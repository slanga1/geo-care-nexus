import { Router } from 'express';
import { MessageController } from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const sendMessageSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  text: z.string().min(1, 'Message text is required').max(2000, 'Message is too long'),
});

// All routes require authentication
router.use(authenticate);

// POST /api/messages - Send a message
router.post('/', validate(sendMessageSchema), MessageController.sendMessage);

// GET /api/messages/contacts - Get all contacts
router.get('/contacts', MessageController.getContacts);

// GET /api/messages/unread - Get unread count
router.get('/unread', MessageController.getUnreadCount);

// GET /api/messages/:contactId - Get conversation with a contact
router.get('/:contactId', MessageController.getConversation);

export default router;
