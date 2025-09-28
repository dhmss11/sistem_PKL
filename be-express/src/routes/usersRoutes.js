import Router from 'express';
import { fetchAllUsers,createUser,updateUser,deleteUser } from '../controllers/userController.js';

const router = Router();

router.get('/', fetchAllUsers);                
router.post('/add', createUser);         
router.put('/edit/:id', updateUser);                      
router.delete('/delete/:id', deleteUser);      

export default router;
