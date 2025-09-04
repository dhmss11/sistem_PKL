import {Router} from "express"
import {
    createmutasi,
    receivemutasi,
    getAllmutasi,
    getPendingMutasi,
    getMutasiByFaktur,
    exportDataToExcel
} from "../controllers/mutasiGudangController.js";

const router = Router();

router.post ("/create",createmutasi);
router.post("/receive/:faktur",receivemutasi);
router.get("/",getAllmutasi);
router.get("/pending", getPendingMutasi);
router.get("/receive/:faktur", getMutasiByFaktur);
router.get("/mutasi", getAllmutasi)
router.get("/export", exportDataToExcel)

export default router;