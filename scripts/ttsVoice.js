const { now, prisma } = require("./utils/util");

async function initVoice() {

  const first = await prisma.ttsVoiceStyle.findFirst();
  if (!first) {
    const style = await prisma.ttsVoiceStyle.createMany({
      data: [
        {
          style: "advertisement_upbeat",
          name: "兴奋",
          desc: "用兴奋和精力充沛的语气推广产品或服务。"
        },
        {
          style: "affectionate",
          name: "亲切温暖",
          desc: "以较高的音调和音量表达温暖而亲切的语气。说话者处于吸引听众注意力的状态。说话者的个性往往是讨喜的。"
        },
        { style: "angry", name: "生气", desc: "表达生气和厌恶的语气。" },
        { style: "assistant", name: "热情助理", desc: "数字助理用的是热情而轻松的语气。" },
        {
          style: "calm",
          name: "冷静",
          desc: "以沉着冷静的态度说话。语气、音调和韵律与其他语音类型相比要统一得多。"
        },
        { style: "chat", name: "轻松聊天", desc: "表达轻松随意的语气。" },
        { style: "cheerful", name: "愉快", desc: "表达积极愉快的语气。" },
        {
          style: "customerservice",
          name: "友好客服",
          desc: "以友好热情的语气为客户提供支持。"
        },
        { style: "depressed", name: "沮丧", desc: "调低音调和音量来表达忧郁、沮丧的语气。" },
        {
          style: "disgruntled",
          name: "不满",
          desc: "表达轻蔑和抱怨的语气。 这种情绪的语音表现出不悦和蔑视。"
        },
        {
          style: "documentary-narration",
          name: "纪录片叙述",
          desc: "用一种轻松、感兴趣和信息丰富的风格讲述纪录片，适合配音纪录片、专家评论和类似内容。"
        },
        {
          style: "embarrassed",
          name: "尴尬",
          desc: "在说话者感到不舒适时表达不确定、犹豫的语气。"
        },
        { style: "empathetic", name: "关心理解", desc: "表达关心和理解。" },
        {
          style: "envious",
          name: "羡慕",
          desc: "当你渴望别人拥有的东西时，表达一种钦佩的语气。"
        },
        {
          style: "excited",
          name: "兴奋",
          desc: "表达乐观和充满希望的语气。 似乎发生了一些美好的事情，说话人对此满意。"
        },
        {
          style: "fearful",
          name: "恐惧",
          desc: "以较高的音调、较高的音量和较快的语速来表达恐惧、紧张的语气。 说话人处于紧张和不安的状态。"
        },
        {
          style: "friendly",
          name: "友好",
          desc: "表达一种愉快、怡人且温暖的语气。 听起来很真诚且满怀关切。"
        },
        {
          style: "gentle",
          name: "温和",
          desc: "以较低的音调和音量表达温和、礼貌和愉快的语气。"
        },
        {
          style: "hopeful",
          name: "充满希望",
          desc: "表达一种温暖且渴望的语气。 听起来像是会有好事发生在说话人身上。"
        },
        { style: "lyrical", name: "抒情", desc: "以优美又带感伤的方式表达情感。" },
        {
          style: "narration-professional",
          name: "专业叙述",
          desc: "以专业、客观的语气朗读内容。"
        },
        {
          style: "narration-relaxed",
          name: "轻松叙述",
          desc: "为内容阅读表达一种舒缓而悦耳的语气。"
        },
        { style: "newscast", name: "新闻播报", desc: "以正式专业的语气叙述新闻。" },
        {
          style: "newscast-casual",
          name: "随意新闻",
          desc: "以通用、随意的语气发布一般新闻。"
        },
        {
          style: "newscast-formal",
          name: "正式新闻",
          desc: "以正式、自信和权威的语气发布新闻。"
        },
        {
          style: "poetry-reading",
          name: "诗歌朗诵",
          desc: "在读诗时表达出带情感和节奏的语气。"
        },
        { style: "sad", name: "悲伤", desc: "表达悲伤语气。" },
        {
          style: "serious",
          name: "严肃",
          desc: "表达严肃和命令的语气。 说话者的声音通常比较僵硬，节奏也不那么轻松。"
        },
        {
          style: "shouting",
          name: "大声",
          desc: "表达一种听起来好像声音在远处或在另一个地方的语气，努力让别人听清楚。"
        },
        {
          style: "sports_commentary",
          name: "体育评论",
          desc: "表达一种既轻松又感兴趣的语气，用于播报体育赛事。"
        },
        {
          style: "sports_commentary_excited",
          name: "兴奋体育评论",
          desc: "用快速且充满活力的语气播报体育赛事精彩瞬间。"
        },
        {
          style: "whispering",
          name: "低声细语",
          desc: "表达一种柔和的语气，试图发出安静而柔和的声音。"
        },
        {
          style: "terrified",
          name: "恐惧",
          desc: "表达一种害怕的语气，语速快且声音颤抖。 听起来说话人处于不稳定的疯狂状态。"
        },
        { style: "unfriendly", name: "冷淡", desc: "表达一种冷淡无情的语气。" }
      ]
    });
    console.log("create voice style finished", style);
  }

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
