const { now, prisma } = require("./utils/util");

async function initVoice() {
  // 创建tts 字典和数据

  // 创建性别字典

  const existTtsVoiceGender = await prisma.sysDictType.findUnique({
    where: {
      type: "tts_voice_gender"
    }
  });

  if (!existTtsVoiceGender) {
    const ttsVoiceGender = await prisma.sysDictType.create({
      data: {
        name: "主播性别",
        type: "tts_voice_gender",
        status: 1,
        remark: "配音主播性别",
        createdId: 1,
        createdAt: now(),
        updatedAt: now()
      }
    });

    if (ttsVoiceGender) {
      await prisma.sysDictData.createMany({
        data: [
          {
            label: "女声",
            value: "female",
            type: "tts_voice_gender",
            remark: "女声",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "男声",
            value: "male",
            type: "tts_voice_gender",
            remark: "男声",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          }
        ]
      });
    }
  }

  // 创建年龄字典

  const existTtsVoiceAge = await prisma.sysDictType.findUnique({
    where: {
      type: "tts_voice_age"
    }
  });

  if (!existTtsVoiceAge) {
    // 创建年龄字典
    const ttsVoiceAge = await prisma.sysDictType.create({
      data: {
        name: "主播年龄",
        type: "tts_voice_age",
        status: 1,
        remark: "配音主播年龄",
        createdId: 1,
        createdAt: now(),
        updatedAt: now()
      }
    });

    if (ttsVoiceAge) {
      await prisma.sysDictData.createMany({
        data: [
          {
            label: "老年",
            value: "senior",
            type: "tts_voice_age",
            remark: "模仿老年的声音",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "中年",
            value: "older",
            type: "tts_voice_age",
            remark: "模仿中年的声音",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "青年",
            value: "young",
            type: "tts_voice_age",
            remark: "模仿青年的声音",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "少儿",
            value: "children",
            type: "tts_voice_age",
            remark: "模仿少儿的声音",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          }
        ]
      });
    }
  }

  // 创建语种字典

  const existTtsVoiceLanguage = await prisma.sysDictType.findUnique({
    where: {
      type: "tts_voice_language"
    }
  });

  if (!existTtsVoiceLanguage) {
    // 创建语种字典
    const ttsVoiceLanguage = await prisma.sysDictType.createMany({
      data: {
        name: "主播语种",
        type: "tts_voice_language",
        status: 1,
        remark: "配音主播语种",
        createdId: 1,
        createdAt: now(),
        updatedAt: now()
      }
    });

    if (ttsVoiceLanguage) {
      await prisma.sysDictData.createMany({
        data: [
          {
            label: "普通话",
            value: "zh",
            type: "tts_voice_language",
            remark: "中文普通话",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "英文",
            value: "en",
            type: "tts_voice_language",
            remark: "英文",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          }
        ]
      });
    }
  }
}

module.exports = { initVoice };
