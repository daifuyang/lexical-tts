const { now, prisma } = require("./utils/util");

async function initVoice() {
  // 创建tts分类
  const voiceCategories = [
    { name: "影视解说", desc: "影视解说" },
    { name: "政企宣传", desc: "政企宣传" },
    { name: "教育培训", desc: "教育培训" },
    { name: "广告促销", desc: "广告促销" },
    { name: "产品介绍", desc: "产品介绍" },
    { name: "有声读物", desc: "有声读物" },
    { name: "手机彩铃", desc: "手机彩铃" },
    { name: "游戏动漫", desc: "游戏动漫" },
    { name: "新闻资讯", desc: "新闻资讯" },
    { name: "自媒体", desc: "自媒体" },
    { name: "情感电台", desc: "情感电台" },
    { name: "搞笑娱乐", desc: "搞笑娱乐" },
    { name: "名人", desc: "名人" }
  ];

  for (const category of voiceCategories) {
    const voiceCategory = await prisma.ttsVoiceCategory.findFirst({
      where: {
        name: category.name
      }
    });

    if (!voiceCategory) {
      await prisma.ttsVoiceCategory.create({
        data: {
          name: category.name,
          desc: category.desc,
          status: 1
        }
      });
    }
  }

  // 创建tts 字典和数据

  // 创建类型字典
  /*   const existTtsVoiceType = await prisma.sysDictType.findUnique({
    where: {
      type: "tts_voice_type"
    }
  });
  if (!existTtsVoiceType) {
    const ttsVoiceType = await prisma.sysDictType.create({
      data: {
        name: "tts 类型",
        type: "tts_voice_type",
        status: 1,
        remark: "tts 类型",
        createdId: 1,
        createdAt: now(),
        updatedAt: now()
      }
    });
    if (ttsVoiceType) {
      await prisma.sysDictData.createMany({
        data: [
          {
            label: "影视解说",
            value: "101",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "政企宣传",
            value: "102",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "教育培训",
            value: "103",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "广告促销",
            value: "104",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "产品介绍",
            value: "105",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "有声读物",
            value: "106",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "手机彩铃",
            value: "107",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "游戏动漫",
            value: "108",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "新闻资讯",
            value: "109",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "自媒体",
            value: "110",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "情感电台",
            value: "111",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "搞笑娱乐",
            value: "112",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "名人",
            value: "113",
            type: "tts_voice_type",
            remark: "",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          }
        ]
      });
    }
  } */
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
            value: "0",
            type: "tts_voice_gender",
            remark: "女声",
            createdId: 1,
            createdAt: now(),
            updatedAt: now()
          },
          {
            label: "男声",
            value: "1",
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

  // 创建主播

  const ttsVoices = [
    {
      name: "晓晓",
      shortName: "zh-CN-XiaoxiaoNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 274,
      status: 1
    },
    {
      name: "云希",
      shortName: "zh-CN-YunxiNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 293,
      status: 1
    },
    {
      name: "云健",
      shortName: "zh-CN-YunjianNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 279,
      status: 1
    },
    {
      name: "晓伊",
      shortName: "zh-CN-XiaoyiNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 263,
      status: 1
    },
    {
      name: "云扬",
      shortName: "zh-CN-YunyangNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 293,
      status: 1
    },
    {
      name: "晓辰",
      shortName: "zh-CN-XiaochenNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 283,
      status: 1
    },
    {
      name: "晓辰(多语言)",
      shortName: "zh-CN-XiaochenMultilingualNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 24000,
      voiceType: "Neural",
      wordsPerMinute: null,
      status: 1
    },
    {
      name: "晓涵",
      shortName: "zh-CN-XiaohanNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 259,
      status: 1
    },
    {
      name: "晓梦",
      shortName: "zh-CN-XiaomengNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 272,
      status: 1
    },
    {
      name: "晓墨",
      shortName: "zh-CN-XiaomoNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 286,
      status: 1
    },
    {
      name: "晓秋",
      shortName: "zh-CN-XiaoqiuNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 232,
      status: 1
    },
    {
      name: "晓柔",
      shortName: "zh-CN-XiaorouNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: null,
      status: 1
    },
    {
      name: "晓睿",
      shortName: "zh-CN-XiaoruiNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 243,
      status: 1
    },
    {
      name: "晓双",
      shortName: "zh-CN-XiaoshuangNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 225,
      status: 1
    },
    {
      name: "晓晓(方言)",
      shortName: "zh-CN-XiaoxiaoDialectsNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 24000,
      voiceType: "Neural",
      wordsPerMinute: null,
      status: 1
    },
    {
      name: "晓晓(多语言)",
      shortName: "zh-CN-XiaoxiaoMultilingualNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 24000,
      voiceType: "Neural",
      wordsPerMinute: null,
      status: 1
    },
    {
      name: "晓颜",
      shortName: "zh-CN-XiaoyanNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 279,
      status: 1
    },
    {
      name: "晓悠",
      shortName: "zh-CN-XiaoyouNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 211,
      status: 1
    },
    {
      name: "晓宇(多语言)",
      shortName: "zh-CN-XiaoyuMultilingualNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 24000,
      voiceType: "Neural",
      wordsPerMinute: null,
      status: 1
    },
    {
      name: "晓甄",
      shortName: "zh-CN-XiaozhenNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 273,
      status: 1
    },
    {
      name: "云枫",
      shortName: "zh-CN-YunfengNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 320,
      status: 1
    },
    {
      name: "云皓",
      shortName: "zh-CN-YunhaoNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 315,
      status: 1
    },
    {
      name: "云杰",
      shortName: "zh-CN-YunjieNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: null,
      status: 1
    },
    {
      name: "云夏",
      shortName: "zh-CN-YunxiaNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 269,
      status: 1
    },
    {
      name: "云野",
      shortName: "zh-CN-YunyeNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 278,
      status: 1
    },
    {
      name: "云逸(多语言)",
      shortName: "zh-CN-YunyiMultilingualNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 24000,
      voiceType: "Neural",
      wordsPerMinute: null,
      status: 1
    },
    {
      name: "云泽",
      shortName: "zh-CN-YunzeNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 255,
      status: 1
    }
  ];

  for (const voice of ttsVoices) {
    const existVoice = await prisma.ttsVoice.findFirst({
      where: {
        shortName: voice.shortName
      }
    });

    if (!existVoice) {
      await prisma.ttsVoice.create({
        data: {
          name: voice.name,
          gender: voice.gender,
          locale: voice.locale,
          shortName: voice.shortName,
          sampleRateHertz: voice.sampleRateHertz,
          voiceType: voice.voiceType,
          wordsPerMinute: voice.wordsPerMinute,
          status: 1
        }
      });
    }
  }
}

module.exports = { initVoice };
