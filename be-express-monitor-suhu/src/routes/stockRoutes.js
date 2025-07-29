import Router from 'express';
import {
    fetchAllStock,
    addStock,
    editStock,
    deleteStock,
 
} from '../controllers/stockController.js';

const router = Router();

router.get('/',fetchAllStock);
router.post('/add',addStock);
router.put('/edit/:id', editStock);
router.delete('/delete/:id', deleteStock);


export default router;