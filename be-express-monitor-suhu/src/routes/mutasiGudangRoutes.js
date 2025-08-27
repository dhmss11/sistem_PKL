import {Router} from "express"
import {
    createmutasi,
    receivemutasi,
    getAllmutasi,
<<<<<<< HEAD
    getAllFaktur
=======
    getPendingMutasi,
    getMutasiByFaktur,
>>>>>>> 554dbad560fc5bca7065799fab64f003e9c43651
} from "../controllers/mutasiGudangController.js";

const router = Router();

router.post ("/create",createmutasi);
router.post("/receive/:faktur",receivemutasi);
router.get("/",getAllmutasi);
<<<<<<< HEAD
router.get("/faktur", getAllFaktur);
=======
router.get("/pending", getPendingMutasi);
router.get("/receive/:faktur", getMutasiByFaktur);
>>>>>>> 554dbad560fc5bca7065799fab64f003e9c43651

export default router;