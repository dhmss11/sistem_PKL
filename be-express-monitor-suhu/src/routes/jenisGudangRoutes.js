import { fetchAlljenisgudang } from "../controllers/masterGolonganStok.js";
import { Router} from 'express';

const router = Router();

router.get('/',fetchAlljenisgudang);

export default router;

