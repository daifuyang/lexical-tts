const bcrypt = require("bcrypt");
const { now, prisma } = require("./utils/util");
const { initVoice } = require("./ttsVoice");

async function main() {
  console.log("sql init start");

  // 创建初始管理员

  const admin = await prisma.umsAdmin.findFirst({
    where: {
      username: "admin"
    }
  });

  if (!admin) {
    const { DEFAULT_PASSWORD = "123456" } = process.env;
    const password = bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10));
    await prisma.umsAdmin.create({
      data: {
        username: "admin",
        password,
        loginAt: 0,
        createdAt: now()
      }
    });
  }

  // 创建系统默认字典
  const sysUserGender = await prisma.sysDictType.findFirst({
    where: {
      type: "sys_user_gender"
    }
  });

  if (!sysUserGender) {
    const newSysUserGender = await prisma.sysDictType.create({
      data: {
        type: "sys_user_gender",
        name: "性别",
        status: 1,
        remark: "用户性别列表	",
        createdId: 1,
        createdAt: now(),
        updatedAt: now()
      }
    });

    if (newSysUserGender) {
      await prisma.sysDictData.createMany({
        data: [
          {
            type: "sys_user_gender",
            label: "男",
            value: "1",
            status: 1,
            remark: "性别男",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            type: "sys_user_gender",
            label: "女",
            value: "0",
            status: 1,
            remark: "性别女",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          }
        ]
      });
    }
  }

  initVoice();

  console.log("sql init finished");
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
