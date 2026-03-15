import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
