import express from "express";
import {
  fetchAllDudi,
  getDudiStats,
  createDudi,
  updateDudi,
  deleteDudi,
  getDashboardAdmin,
  getDudiSummary,
} from "../controllers/dudiController.js";

const router = express.Router();
router.get("/", fetchAllDudi);
router.get("/stats", getDudiStats);
router.post("/create", createDudi);
router.put("/edit/:id", updateDudi);
router.delete("/delete/:id", deleteDudi);
router.get('/admin/dashboard', getDashboardAdmin);


export default router;
