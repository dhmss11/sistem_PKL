import { Router } from "express";
import { 
    fetchAllGudang,
    createGudang,
    updateGudang,
    destroyGudang,
    fetchGudangByJenis,
} from "../controllers/namaGudangController.js";

const router = Router();

router.get('/', fetchAllGudang);
router.post('/create', createGudang);
router.put('/edit/:id', updateGudang);
router.delete('/delete/:id', destroyGudang);
router.get('/jenis/:jenis', fetchGudangByJenis);

export default router;