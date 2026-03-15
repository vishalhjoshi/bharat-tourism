import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, authorizeAdmin);

router.get('/users', async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, _count: { select: { bookings: true } } }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/bookings', async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: { select: { name: true, email: true } },
                travel: { select: { title: true } }
            }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/bookings/:id/status', async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const updated = await prisma.booking.update({
            where: { id: parseInt(req.params.id as string) },
            data: { bookingStatus: status }
        });
        res.json(updated);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Assuming Admin travel CRUD is primarily managed within travelRoutes or expanded here
router.delete('/travel/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.travel.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ message: 'Travel deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
