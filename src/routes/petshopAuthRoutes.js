// FILE: src/routes/petshopAuthRoutes.js
import express from 'express';
import { registrarPetshop, loginPetshop } from '../controllers/authPetshopController.js';
const router = express.Router();
router.post('/register', registrarPetshop);
router.post('/login', loginPetshop);
export default router;