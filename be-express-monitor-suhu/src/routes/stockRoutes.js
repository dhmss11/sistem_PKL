import Router from 'express';
import {
    fetchAllStock,
    addStock,
 
} from '../controllers/stockController.js';

const router = Router();

router.get('/',fetchAllStock);
router.post('/add',addStock);


export default router;