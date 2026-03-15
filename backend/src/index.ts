import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes';
import travelRoutes from './routes/travelRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';

// Main health-check route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Travel Booking API is running.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// User Profile aliases are handled in authRoutes (/api/auth/me) but can be added separately if needed.
app.use('/api/user', authRoutes); // e.g. /api/user/me

// End of routes

// Import and use routes eventually...

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
