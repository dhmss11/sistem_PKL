import {Router} from "express";
import {
    createMutasiGudangKe,
    createMutasiGudangDari,
    getAllMutasiGudangKe,
    getAllMutasiGudangDari
} from "../controllers/mutasiGudangController.js";

const router = Router();

router.post("/createke", createMutasiGudangKe);
router.get("/ke", getAllMutasiGudangKe);

router.post("/createdari", createMutasiGudangDari);
router.get("/dari", getAllMutasiGudangDari);

export default router;
