import prisma from "@/lib/prisma";
import {getVoiceStyleByStyle} from "./ttsVoiceStyle";
// 根据主播id获取主播风格

export async function getVocieStylesByVoiceId(voiceId: number, tx = prisma) {
    const styles = await tx.ttsVoiceStyleRelation.findMany({
        where: {
            voiceId
        },
        select: {
            style: true
        }
    })

    const voiceStyles = [{
        id: 0,
        name: '默认',
        style: '',
    }];


    for (let index = 0; index < styles.length; index++) {
        const style = styles[index];
        const voiceStyle = await getVoiceStyleByStyle(style.style);
        voiceStyles.push(voiceStyle);
    }
    return voiceStyles;
}