import {Router} from "express"
import {
    createmutasi,
    receivemutasi,
    getAllmutasi
} from "../controllers/mutasiGudangController.js";

const router = Router();

router.post ("/create",createmutasi);
router.post("/receive/:id",receivemutasi);
router.get("/",getAllmutasi);

export default router;