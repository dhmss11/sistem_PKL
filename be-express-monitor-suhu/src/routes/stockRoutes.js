import Router from 'express';
import {
    fetchAllStock,
    addStock,
    editStock,
    deleteStock,
    fetchStockBySatuan,
 
} from '../controllers/stockController.js';

const router = Router();

router.get('/satuan/:satuan', fetchStockBySatuan);
router.get('/',fetchAllStock);
router.post('/add',addStock);
router.put('/edit/:id', editStock);
router.delete('/:id', deleteStock);
router.delete('/delete/:id', deleteStock);


export default router;