import { Router } from 'express';
import {fetchSisaStock, fetchMutasiGudang} from '../controllers/laporanController.js'

const router = Router();

router.get('/stock',fetchSisaStock);
router.get('/mutasi', fetchMutasiGudang)

export default router;