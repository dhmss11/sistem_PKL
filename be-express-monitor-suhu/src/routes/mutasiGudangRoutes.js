import {Router} from "express"
import {
    createmutasi,
    receivemutasi,
    getAllmutasi,
    getPendingMutasi,
    getMutasiByFaktur,
} from "../controllers/mutasiGudangController.js";

const router = Router();

router.post ("/create",createmutasi);
router.post("/receive/:faktur",receivemutasi);
router.get("/",getAllmutasi);
router.get("/pending", getPendingMutasi);
router.get("/receive/:faktur", getMutasiByFaktur);

export default router;