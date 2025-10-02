import express from 'express';
import { 
  getSchoolSettings, 
  updateSchoolSettings, 
  uploadSchoolLogo 
} from '../controllers/schoolController.js';


const router = express.Router();

router.get('/settings', getSchoolSettings);

router.put('/settings', updateSchoolSettings);

router.post('/upload-logo', uploadSchoolLogo);

export default router;
