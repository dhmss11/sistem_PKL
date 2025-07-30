import express from 'express';
import {
  getAllSatuanStock,
  createSatuanStock,
  updateSatuanStock,
  deleteSatuanStock
} from '../controllers/satuanStockController.js';

const router = express.Router();

// GET semua data
router.get('/', getAllSatuanStock);

// POST tambah data
router.post('/create', createSatuanStock);

// PUT edit data berdasarkan KODE
router.put('/edit/:kode', updateSatuanStock);

// DELETE hapus data berdasarkan KODE
router.delete('/delete/:kode', deleteSatuanStock);

export default router;
