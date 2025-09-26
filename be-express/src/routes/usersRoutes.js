import Router from 'express';
import { fetchAllUsers,createNewUser,updateUser,deleteUser } from '../controllers/userController.js';

const router = Router();

router.get('/', fetchAllUsers);                
router.post('/create', createNewUser);         
router.put('/edit/:id', updateUser);                      
router.delete('/delete/:id', deleteUser);      

export default router;
