import { fetchAlljenisgudang,
         fetchAllKeteranganGolongan
 } from "../controllers/masterGolonganStok.js";
import { Router} from 'express';

const router = Router();


router.get('/keterangan/:keterangan',fetchAllKeteranganGolongan);
router.get('/',fetchAlljenisgudang);

export default router;

