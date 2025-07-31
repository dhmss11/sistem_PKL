import { fetchAlljenisgudang,
         fetchAllKeteranganGolongan,
         createJenisGudang,
         editJenisGudang,
         deleteJenisGudang
 } from "../controllers/masterGolonganStok.js";
import { Router} from 'express';

const router = Router();


router.get('/keterangan/:keterangan',fetchAllKeteranganGolongan);
router.get('/',fetchAlljenisgudang);
router.post('/create',createJenisGudang);
router.put('/edit/:id',editJenisGudang);
router.delete('/delete/:id',deleteJenisGudang);

export default router;

