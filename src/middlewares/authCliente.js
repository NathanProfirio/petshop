import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export default function authCliente(req, res, next) {
try {
const auth = req.headers.authorization;
if (!auth) return res.status(401).json({ error: 'Token não fornecido' });
const token = auth.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
if (!decoded || !decoded.id_cliente) return res.status(403).json({ error: 'Token inválido' });
req.user = { id_cliente: decoded.id_cliente };
next();
} catch (err) {
return res.status(401).json({ error: 'Token inválido ou expirado' });
}
}