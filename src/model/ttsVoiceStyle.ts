import prisma from "@/lib/prisma";
import redis from "@/lib/redis";

// 获取列表
export async function getVoiceStyleList(tx = prisma) {
  return await prisma.ttsVoiceStyle.findMany();
}

// 根据style获取主播风格

const voiceStyleStyleKey = `tts:voiceStyle:style:`;

export async function getVoiceStyleByStyle(style: string, tx = prisma) {
  const key = `${voiceStyleStyleKey}${style}`;
  const cache = await redis.get(key);
  let voiceStyle = null;
  if (cache) {
    voiceStyle = JSON.parse(cache);
  } else {
    voiceStyle = await tx.ttsVoiceStyle.findUnique({
      where: {
        style
      }
    });
    if(voiceStyle) {
        redis.set(key, JSON.stringify(voiceStyle));
    }
  }
  return voiceStyle
}
