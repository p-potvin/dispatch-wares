// backend/src/services/deliveryService.js
export const getPool = async (page = 1, limit = 50) => {
  return await prisma.delivery.findMany({
    where: { status: 'UNASSIGNED' },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: 'desc' }
  });
};
