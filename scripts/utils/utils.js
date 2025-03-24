const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const now = () => Math.floor(new Date().getTime() / 1000);

 function generateSalt(length = 6) {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
  }
  
  async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

module.exports = { now, prisma, generateSalt, hashPassword };
