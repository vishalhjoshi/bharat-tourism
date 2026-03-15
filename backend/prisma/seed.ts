import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding the database with luxury travel packages...');

    // Create an Admin user if none exists
    const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@bharattourism.com' } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                name: 'Bharat Admin',
                email: 'admin@bharattourism.com',
                password: hashedPassword,
                phone: '+91 98765 43210',
                role: 'ADMIN',
            },
        });
        console.log('Admin user created (admin@bharattourism.com / admin123)');
    }

    // Define Indian travel destinations
    const travels = [
        {
            title: 'Royal Rajasthan Heritage Tour',
            destination: 'Jaipur, Rajasthan',
            description: 'Experience the grandeur of the Rajput era. Stay in authentic heritage palaces, enjoy private elephant rides at Amer Fort, and witness the spectacular sunset over the Pink City.',
            price: 450.00,
            images: ['https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=1200'],
            availableDates: [new Date('2026-04-10T00:00:00Z'), new Date('2026-05-15T00:00:00Z')],
        },
        {
            title: 'Kerala Backwaters & Houseboat Retreat',
            destination: 'Alleppey, Kerala',
            description: 'Cruise through the serene backwaters of God\'s Own Country. Stay in a premium private houseboat, enjoy authentic Ayurvedic spa treatments, and relish traditional Kerala cuisine.',
            price: 320.00,
            images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200'],
            availableDates: [new Date('2026-06-01T00:00:00Z'), new Date('2026-07-15T00:00:00Z')],
        },
        {
            title: 'Spiritual Awakening in Varanasi',
            destination: 'Varanasi, Uttar Pradesh',
            description: 'Witness the mystic Ganga Aarti from a private boat. Walk through the ancient ghats, stay in a boutique hotel overlooking the river, and experience the cultural heartbeat of India.',
            price: 280.00,
            images: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200'],
            availableDates: [new Date('2026-05-20T00:00:00Z'), new Date('2026-08-10T00:00:00Z')],
        },
        {
            title: 'Himalayan Adventure in Leh-Ladakh',
            destination: 'Leh, Ladakh',
            description: 'Embark on a thrilling journey through high-altitude passes and pristine crystal clear lakes. Includes guided monastery tours, luxury nomadic tents, and breathtaking mountain vistas.',
            price: 600.00,
            images: ['https://images.unsplash.com/photo-1580252875150-1017df8546b5?q=80&w=1200'],
            availableDates: [new Date('2026-07-01T00:00:00Z'), new Date('2026-08-15T00:00:00Z')],
        },
        {
            title: 'Tropical Paradise Resort Getaway',
            destination: 'South Goa, Goa',
            description: 'Unwind on pristine white-sand beaches. Enjoy a luxurious stay at a 5-star oceanfront resort, complete with water sports, vibrant nightlife, and Indo-Portuguese culinary delights.',
            price: 350.00,
            images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200'],
            availableDates: [new Date('2026-01-15T00:00:00Z'), new Date('2026-02-20T00:00:00Z')],
        },
        {
            title: 'The Golden Triangle Explorer',
            destination: 'Agra & Delhi, India',
            description: 'A curated journey through India\'s most iconic historical locations. Marvel at the Taj Mahal at sunrise, explore Delhi\'s bustling bazaars, and dive deep into Mughal history.',
            price: 400.00,
            images: ['https://images.unsplash.com/photo-1564507592208-013009bea074?q=80&w=1200'],
            availableDates: [new Date('2026-11-01T00:00:00Z'), new Date('2026-12-15T00:00:00Z')],
        }
    ];

    for (const travel of travels) {
        const existingTravel = await prisma.travel.findFirst({ where: { title: travel.title } });
        if (!existingTravel) {
            await prisma.travel.create({
                data: travel,
            });
            console.log(`Created travel package: ${travel.title}`);
        } else {
            console.log(`Travel package already exists: ${travel.title}`);
        }
    }

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
