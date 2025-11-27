import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function authCliente(req, res, next) {
    try {
        const auth = req.headers.authorization;

        if (!auth) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        // Aceita: 
        //  "Bearer XXXXX"
        //  "XXXXX"
        const parts = auth.split(' ');
        const token = parts.length === 2 ? parts[1] : parts[0];

        if (!token) {
            return res.status(401).json({ error: 'Token mal formatado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id_cliente) {
            return res.status(403).json({ error: 'Token inválido' });
        }

        req.user = { id_cliente: decoded.id_cliente };

        next();
        
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}
