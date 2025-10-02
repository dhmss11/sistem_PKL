import express from 'express';
import { 
  getSchoolSettings, 
  updateSchoolSettings, 
  uploadSchoolLogo 
} from '../controllers/schoolController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get school settings (accessible to all authenticated users)
router.get('/settings', authenticate, getSchoolSettings);

// Update school settings (admin only)
router.put('/settings', authenticate, adminOnly, updateSchoolSettings);

// Upload school logo (admin only)
router.post('/upload-logo', authenticate, adminOnly, uploadSchoolLogo);

export default router;
