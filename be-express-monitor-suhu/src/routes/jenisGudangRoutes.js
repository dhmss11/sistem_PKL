import express from 'express';
import {
  getJumlahGudangPerJenis
} from '../controllers/jenisGudangController.js';

const router = express.Router();

router.get('/jumlah', getJumlahGudangPerJenis);

export default router;
