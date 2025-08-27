import {Router} from "express"
import {
    createmutasi,
    receivemutasi,
    getAllmutasi,
    getAllFaktur
} from "../controllers/mutasiGudangController.js";

const router = Router();

router.post ("/create",createmutasi);
router.post("/receive/:faktur",receivemutasi);
router.get("/",getAllmutasi);
router.get("/faktur", getAllFaktur);

export default router;