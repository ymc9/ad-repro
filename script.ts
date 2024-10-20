import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';

const prisma = new PrismaClient();

async function main() {
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();
    await prisma.ad.deleteMany();

    const user = await prisma.user.create({
        data: {
            isAdmin: false,
            company: {
                create: {
                    name: 'Company 1',
                    companyType: 'Buyer',
                    buyerType: 'RESTAURANT',
                },
            },
        },
        include: { company: true },
    });

    console.log('Created user:', user);

    // the cast `user as any` is needed likely due to a typing bug, I'll investigate it
    const db = enhance(prisma, { user: user as any });
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
