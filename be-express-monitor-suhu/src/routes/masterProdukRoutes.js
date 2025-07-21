import { Router } from "express";
import { 
  createProduk,
  destroyProduk,
  fetchAllProduk,
  fetchProdukById,
  updateProduk,
 } from "../controllers/masterProdukController.js";

 const router = Router();

 router.get("/", fetchAllProduk);
 router.post("/create",createProduk);
 router.put("/edit/:id" ,updateProduk);
 router.delete("/delete/:id",destroyProduk);
 router.get("/:id",fetchProdukById);

 export default router;

 