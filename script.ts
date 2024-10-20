import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';

const prisma = new PrismaClient({ log: ['info'] });

async function main() {
    await prisma.ad.deleteMany();

    const db = enhance(
        prisma,
        {
            user: {
                id: 'user1',
                company: {
                    id: 'company1',
                    name: 'Company 1',
                    companyType: 'Buyer',
                    buyerType: 'RESTAURANT',
                },
            },
        },
        { logPrismaQuery: true }
    );
    const ad = await db.ad.create({
        data: {
            buyerTypes: ['RESTAURANT'],
            listPrice: 1,
        },
    });

    console.log('Created ad:', ad);

    const foundAd = await db.ad.findFirst();
    console.log('Found ad:', foundAd);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
