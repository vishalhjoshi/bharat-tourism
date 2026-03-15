import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Search travel
router.get('/search', async (req: Request, res: Response): Promise<void> => {
    const { destination, minPrice, maxPrice } = req.query;
    try {
        const travels = await prisma.travel.findMany({
            where: {
                ...(destination ? { destination: { contains: destination as string, mode: 'insensitive' } } : {}),
                ...(minPrice || maxPrice ? {
                    price: {
                        ...(minPrice ? { gte: parseFloat(minPrice as string) } : {}),
                        ...(maxPrice ? { lte: parseFloat(maxPrice as string) } : {})
                    }
                } : {})
            }
        });
        res.json(travels);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get travel by id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const travel = await prisma.travel.findUnique({ where: { id: parseInt(req.params.id as string) } });
        if (!travel) {
            res.status(404).json({ message: 'Travel not found' });
            return;
        }
        res.json(travel);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Create travel
router.post('/', authenticate, authorizeAdmin, async (req: Request, res: Response): Promise<void> => {
    const { title, description, destination, price, images, availableDates } = req.body;
    try {
        const travel = await prisma.travel.create({
            data: { title, description, destination, price, images, availableDates }
        });
        res.status(201).json(travel);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
