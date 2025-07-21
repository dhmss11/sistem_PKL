import { Router } from "express";
import { 
    fetchAllUsers,
    createNewUser,
    updateUser, 
    getUserDetail,
    deleteUser
} from "../controllers/userController.js";

const router = Router();

router.get("/", fetchAllUsers);
router.get("/:id", getUserDetail)
router.post("/create", createNewUser);
router.put("/edit/:id", updateUser);
router.delete("/delete/:id",deleteUser);
export default router;
