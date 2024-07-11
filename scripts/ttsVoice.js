const { now, prisma } = require("./utils/util");

async function initVoice() {
  const first = await prisma.ttsVoiceStyle.findFirst();
  if (!first) {
    const style = await prisma.ttsVoiceStyle.createMany({
      data: [
        {
          style: "affectionate",
          name: "撒娇",
          desc: "用温柔和亲切的语气表达情感。"
        },
        {
          style: "angry",
          name: "愤怒",
          desc: "用激动和生气的语气表达不满。"
        },
        {
          style: "assistant",
          name: "助理",
          desc: "用专业和礼貌的语气提供帮助和建议。"
        },
        {
          style: "calm",
          name: "平静",
          desc: "用平和和放松的语气进行交流。"
        },
        {
          style: "chat",
          name: "聊天",
          desc: "用随意和亲切的语气进行对话。"
        },
        {
          style: "chat-casual",
          name: "聊天-休闲",
          desc: "用轻松和愉快的语气进行非正式的对话。"
        },
        {
          style: "cheerful",
          name: "愉悦",
          desc: "用愉快和开心的语气表达积极情感。"
        },
        {
          style: "customerservice",
          name: "客户服务",
          desc: "用礼貌和专业的语气提供客户支持。"
        },
        {
          style: "disgruntled",
          name: "不满",
          desc: "用沮丧和不满意的语气表达不满情绪。"
        },
        {
          style: "fearful",
          name: "害怕",
          desc: "用紧张和害怕的语气表达恐惧。"
        },
        {
          style: "friendly",
          name: "友好",
          desc: "用亲切和友善的语气进行交流。"
        },
        {
          style: "gentle",
          name: "温柔",
          desc: "用柔和和温暖的语气进行交流。"
        },
        {
          style: "lyrical",
          name: "抒情",
          desc: "用富有感情和诗意的语气表达情感。"
        },
        {
          style: "newscast",
          name: "新闻",
          desc: "用专业和正式的语气播报新闻。"
        },
        {
          "style": "newscast-casual",
          "name": "新闻-休闲",
          "desc": "用轻松和非正式的语气传递新闻。"
        },
        {
          style: "poetry-reading",
          name: "诗歌朗诵",
          desc: "用富有感情和节奏的语气朗诵诗歌。"
        },
        {
          style: "sad",
          name: "悲伤",
          desc: "用低沉和悲伤的语气表达负面情感。"
        },
        {
          style: "serious",
          name: "严厉",
          desc: "用严肃和正式的语气进行交流。"
        },
        {
          style: "sorry",
          name: "抱歉",
          desc: "用真诚和歉意的语气表达歉意。"
        },
        {
          style: "whisper",
          name: "低语",
          desc: "用轻声和秘密的语气进行交流。"
        },
        {
          style: "depressed",
          name: "沮丧",
          desc: "用沉重和失落的语气表达低落情绪。"
        },
        {
          style: "embarrassed",
          name: "尴尬",
          desc: "用困惑和尴尬的语气表达不安。"
        },
        {
          style: "envious",
          name: "羡慕",
          desc: "用渴望和嫉妒的语气表达对他人优越地位或成就的羡慕。"
        },
        {
          style: "advertisement-upbeat",
          name: "广告-欢快",
          desc: "用兴奋和精力充沛的语气推广产品或服务。"
        },
        {
          style: "livecommercial",
          name: "实时广告",
          desc: "用清晰和吸引人的语气进行实时广告宣传。"
        },
        {
          style: "documentary-narration",
          name: "纪录片-旁白",
          desc: "用客观和中立的语气讲述纪录片内容。"
        },
        {
          style: "narration",
          name: "旁白",
          desc: "用清晰和简洁的语气进行旁白。"
        },
        {
          style: "narration-relaxed",
          name: "旁白-放松",
          desc: "用轻松和愉快的语气进行旁白。"
        },
        {
          style: "narration-professional",
          name: "旁白-专业",
          desc: "用专业和正式的语气进行旁白。"
        },
        {
          style: "sports-commentary",
          name: "体育解说",
          desc: "用激动和专业的语气进行体育赛事解说。"
        },
        {
          style: "sports-commentary-excited",
          name: "体育解说-兴奋",
          desc: "用极其兴奋和激动的语气解说体育赛事。"
        }
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
      status: 1,
      styles: [
        "affectionate",
        "angry",
        "assistant",
        "calm",
        "chat",
        "chat-casual",
        "cheerful",
        "customerservice",
        "disgruntled",
        "fearful",
        "friendly",
        "gentle",
        "lyrical",
        "newscast",
        "poetry-reading",
        "sad",
        "serious",
        "sorry",
        "whisper"
      ]
    },
    {
      name: "云希",
      shortName: "zh-CN-YunxiNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 293,
      status: 1,
      styles: [
        "angry",
        "assistant",
        "chat",
        "cheerful",
        "depressed",
        "disgruntled",
        "embarrassed",
        "fearful",
        "narration-relaxed",
        "newscast",
        "sad",
        "serious"
      ],
      roles: ["Boy", "Narrator", "YoungAdultMale"]
    },
    {
      name: "云健",
      shortName: "zh-CN-YunjianNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 279,
      status: 1,
      styles: [
        "angry",
        "cheerful",
        "depressed",
        "disgruntled",
        "documentary-narration",
        "narration-relaxed",
        "sad",
        "serious",
        "sports-commentary",
        "sports-commentary-excited"
      ]
    },
    {
      name: "晓伊",
      shortName: "zh-CN-XiaoyiNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 263,
      status: 1,
      styles: [
        "affectionate",
        "angry",
        "cheerful",
        "disgruntled",
        "embarrassed",
        "fearful",
        "gentle",
        "sad",
        "serious"
      ]
    },
    {
      name: "云扬",
      shortName: "zh-CN-YunyangNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 293,
      status: 1,
      styles: ["customerservice", "narration-professional", "newscast-casual"]
    },
    {
      name: "晓辰",
      shortName: "zh-CN-XiaochenNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 283,
      status: 1,
      styles: ["livecommercial"]
    },
    // {
    //   name: "晓辰(多语言)",
    //   shortName: "zh-CN-XiaochenMultilingualNeural",
    //   gender: 0,
    //   locale: "zh-CN",
    //   sampleRateHertz: 24000,
    //   voiceType: "Neural",
    //   wordsPerMinute: null,
    //   status: 1
    // },
    {
      name: "晓涵",
      shortName: "zh-CN-XiaohanNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 259,
      status: 1,
      styles: [
        "affectionate",
        "angry",
        "calm",
        "cheerful",
        "disgruntled",
        "embarrassed",
        "fearful",
        "gentle",
        "sad",
        "serious"
      ]
    },
    {
      name: "晓梦",
      shortName: "zh-CN-XiaomengNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 272,
      status: 1,
      styles: ["chat"]
    },
    {
      name: "晓墨",
      shortName: "zh-CN-XiaomoNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 286,
      status: 1,
      styles: [
        "affectionate",
        "angry",
        "calm",
        "cheerful",
        "depressed",
        "disgruntled",
        "embarrassed",
        "envious",
        "fearful",
        "gentle",
        "sad",
        "serious"
      ]
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
      status: 1,
      styles: ["angry", "calm", "fearful", "sad"]
    },
    {
      name: "晓双",
      shortName: "zh-CN-XiaoshuangNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 225,
      status: 1,
      styles: ["chat"]
    },
    // {
    //   name: "晓晓(方言)",
    //   shortName: "zh-CN-XiaoxiaoDialectsNeural",
    //   gender: 0,
    //   locale: "zh-CN",
    //   sampleRateHertz: 24000,
    //   voiceType: "Neural",
    //   wordsPerMinute: null,
    //   status: 1
    // },
    // {
    //   name: "晓晓(多语言)",
    //   shortName: "zh-CN-XiaoxiaoMultilingualNeural",
    //   gender: 0,
    //   locale: "zh-CN",
    //   sampleRateHertz: 24000,
    //   voiceType: "Neural",
    //   wordsPerMinute: null,
    //   status: 1
    // },
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
    // {
    //   name: "晓宇(多语言)",
    //   shortName: "zh-CN-XiaoyuMultilingualNeural",
    //   gender: 0,
    //   locale: "zh-CN",
    //   sampleRateHertz: 24000,
    //   voiceType: "Neural",
    //   wordsPerMinute: null,
    //   status: 1
    // },
    {
      name: "晓甄",
      shortName: "zh-CN-XiaozhenNeural",
      gender: 0,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 273,
      status: 1,
      styles: ["angry", "cheerful", "disgruntled", "fearful", "sad", "serious"]
    },
    {
      name: "云枫",
      shortName: "zh-CN-YunfengNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 320,
      status: 1,
      styles: ["angry", "cheerful", "depressed", "disgruntled", "fearful", "sad", "serious"]
    },
    {
      name: "云皓",
      shortName: "zh-CN-YunhaoNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 315,
      status: 1,
      styles: ["advertisement-upbeat"]
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
      status: 1,
      styles: ["angry", "calm", "cheerful", "fearful", "sad"]
    },
    {
      name: "云野",
      shortName: "zh-CN-YunyeNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 278,
      status: 1,
      styles: [
        "angry",
        "calm",
        "cheerful",
        "disgruntled",
        "embarrassed",
        "fearful",
        "sad",
        "serious"
      ]
    },
    // {
    //   name: "云逸(多语言)",
    //   shortName: "zh-CN-YunyiMultilingualNeural",
    //   gender: 1,
    //   locale: "zh-CN",
    //   sampleRateHertz: 24000,
    //   voiceType: "Neural",
    //   wordsPerMinute: null,
    //   status: 1
    // },
    {
      name: "云泽",
      shortName: "zh-CN-YunzeNeural",
      gender: 1,
      locale: "zh-CN",
      sampleRateHertz: 48000,
      voiceType: "Neural",
      wordsPerMinute: 255,
      status: 1,
      styles: [
        "angry",
        "calm",
        "cheerful",
        "depressed",
        "disgruntled",
        "documentary-narration",
        "fearful",
        "sad",
        "serious"
      ]
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

    // 查询是否存在style,不存在则更新
    const existStyleRelation = await prisma.ttsVoiceStyleRelation.findFirst({
      where: {
        voiceId: existVoice.id
      }
    });

    if (!existStyleRelation && voice.styles?.length > 0) {
      await prisma.ttsVoiceStyleRelation.createMany({
        data: voice.styles?.map((style) => ({
          voiceId: existVoice.id,
          style: style
        }))
      });
    }
  }
}

module.exports = { initVoice };
