import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/create', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    const { travelId, travelDate, travelers } = req.body;
    try {
        const travel = await prisma.travel.findUnique({ where: { id: travelId } });
        if (!travel) {
            res.status(404).json({ message: 'Travel not found' });
            return;
        }
        const totalPrice = travel.price * travelers;
        const booking = await prisma.booking.create({
            data: {
                userId: req.user.userId,
                travelId,
                travelDate: new Date(travelDate),
                travelers,
                totalPrice,
            }
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.userId },
            include: { travel: true }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/cancel/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: parseInt(req.params.id as string) } });
        if (!booking || booking.userId !== req.user.userId) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data: { bookingStatus: 'CANCELLED' }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(req.params.id as string) },
            include: { travel: true }
        });
        if (!booking || booking.userId !== req.user.userId) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
