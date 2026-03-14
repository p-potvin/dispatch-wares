const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

async function main() {
  console.log('Starting Heavy Seed: 50,000+ Jobs...');

  // 1. Create Dispatchers & Drivers first
  const dispatcher = await prisma.dispatcher.create({
    data: { name: 'Lead Dispatcher', email: 'admin@vaultwares.com', passwordHash: '123' }
  });

  const drivers = await Promise.all(
    Array.from({ length: 100 }).map((_, i) => 
      prisma.driver.create({
        data: { 
          name: `Driver ${i}`, 
          dotMxNumber: `DOT-${1000 + i}`, 
          scheduleStart: new Date(), 
          scheduleEnd: new Date() 
        }
      })
    )
  );

  // 2. Heavy Batch Insertion for Deliveries
  const totalDeliveries = 50000;
  const batchSize = 5000;
  
  for (let i = 0; i < totalDeliveries; i += batchSize) {
    const deliveries = Array.from({ length: batchSize }).map((_, j) => ({
      id: uuidv4(),
      sourceAddress: `${Math.floor(Math.random() * 999)} Industrial Way`,
      sourceName: 'Logistics Hub',
      destAddress: `${Math.floor(Math.random() * 999)} Main St, NY`,
      destName: `Customer ${i + j}`,
      weight: Math.random() * 1000,
      dimensions: '20x20x20',
      status: 'UNASSIGNED',
      lat: 40.7 + (Math.random() - 0.5) * 0.5, // Random NYC area lat
      lng: -74.0 + (Math.random() - 0.5) * 0.5, // Random NYC area lng
    }));

    await prisma.delivery.createMany({ data: deliveries });
    console.log(`✅ Progress: ${i + batchSize}/${totalDeliveries} injected.`);
  }

  console.log('Database fully populated with 50k+ jobs');
}

main().catch(console.error).finally(() => prisma.$disconnect());
