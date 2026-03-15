import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, phone } = req.body;
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await prisma.user.create({
            data: { name, email, password: hashedPassword, phone }
        });

        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name, email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true, email: true, phone: true, role: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
