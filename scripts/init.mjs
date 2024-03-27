import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
        password
      }
    });
  }

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
