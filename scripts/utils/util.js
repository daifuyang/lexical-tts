const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const now = () => Math.floor(new Date().getTime() / 1000);
module.exports = { now, prisma };
