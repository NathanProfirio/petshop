import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function authPetshop(req, res, next) {
    try {
        const auth = req.headers.authorization;

        if (!auth)
            return res.status(401).json({ error: 'Token não fornecido' });

        // Aceita tanto:
        // Authorization: Bearer XXXX
        // Authorization: XXXX
        const token = auth.startsWith("Bearer ")
            ? auth.split(" ")[1]
            : auth;

        if (!token)
            return res.status(401).json({ error: 'Token inválido' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id_petshop)
            return res.status(403).json({ error: 'Acesso permitido apenas para petshops' });

        // Adiciona os dados do petshop na requisição
        req.user = decoded;

        next();

    } catch (err) {
        console.error("Erro no middleware authPetshop:", err.message);
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}
