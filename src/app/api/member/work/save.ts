import { createTtsWork, getTtsWorkFirst, updateTtsWork } from "@/model/ttsWork";

import { now } from "@/lib/date";
import { generateAudio, getSsml } from "@/lib/ssml";
import { uploadFile } from "@/lib/qiniu";
import dayjs from "dayjs";
import { createSample, getSampleFirst } from "@/model/ttsSample";
import ffmpeg from "fluent-ffmpeg";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/user";
import response from "@/lib/response";

export async function Save(request: NextRequest, id: string = "") {
  const { userId } = await getCurrentUser();
  let duration = 0;

  const json = await request.json();
  const { title = "", voiceName = "", contents = [], editorState = "", status = 0 } = json;

  if (!title) {
    return response.error("标题不能为空！");
  }

  // 将contents转出字符串，并删除空格，回车等特殊空格
  const content = contents?.join("").replace(/\s/g, "");

  // 先判断是否存在，存在则直接返回，不存在则生成
  const existWork: any = await getTtsWorkFirst({
    content,
    voiceName,
    creatorId: Number(userId),
    status: 1
  });

  let prevPath = null;
  let audioUrl = "";

  if (existWork) {
    prevPath = `https://cdn.vlog-v.com${existWork.audioUrl}`;
  }

  if (status === 1 && !prevPath && contents.length > 0) {
    let audios: string[] = [];
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index];

      let url = "";

      const sample = await getSampleFirst({
        voiceName,
        content,
        creatorId: Number(userId)
      });

      if (sample) {
        url = sample.audioUrl;
      } else {
        const generateRes = await generateAudio(content, voiceName);
        if (generateRes.status === "error") {
          return response.error("生成失败！");
        }

        const { filename, res: uploadRes } = generateRes;

        const nodes = JSON.parse(content);
        const ssml = getSsml(nodes, voiceName);

        // 入库
        await createSample({
          voiceName,
          content,
          ssml,
          count: ssml.length,
          audioUrl: "/" + uploadRes.key,
          creatorId: Number(userId),
          createdAt: now()
        });

        url = uploadRes.key;
      }

      audios.push(url);
    }

    // 使用ffmpeg合并音频
    if (audios.length > 0) {
      try {
        // 创建日期目录
        const currentDate = dayjs().format("YYYY-MM-DD");
        const workDir = join(process.cwd(), "output", "work", currentDate);
        if (!existsSync(workDir)) {
          mkdirSync(workDir, { recursive: true });
        }

        // 处理输入文件路径
        const inputFiles = audios.map((audio) => {
          return join(process.cwd(), "output", audio);
        });

        // 生成输出文件名
        const outputFilename = `merged_${uuidv4()}.mp3`;
        const outputPath = join(workDir, outputFilename);

        // 执行合并并获取时长
        let duration = 0;
        await new Promise((resolve, reject) => {
          let command = ffmpeg();
          inputFiles.forEach((file) => command.input(file));

          command
            .on("error", reject)
            .on("end", () => {
              // 获取合并后文件的时长
              ffmpeg.ffprobe(outputPath, (err, metadata) => {
                if (!err && metadata.format && metadata.format.duration) {
                  duration = Math.round(metadata.format.duration);
                }
                resolve(undefined);
              });
            })
            .mergeToFile(outputPath, workDir);
        });

        const audioKey = `work/${currentDate}/${outputFilename}`;

        // 上传合并后的音频到七牛云
        const uploadRes: any = await uploadFile(outputFilename, audioKey, outputPath);
        if (uploadRes?.key) {
          audioUrl = "/" + audioKey;
        }
      } catch (error) {
        console.error("Audio merge failed:", error);
      }
    }

    prevPath = `https://cdn.vlog-v.com${audioUrl}`;
  }

  let work: any = null;
  const idInt = Number(id);
  const saveData: Prisma.TtsWorkCreateInput | Prisma.TtsWorkUpdateInput = {
    title: title,
    voiceName: voiceName,
    content: content,
    editorState,
    audioUrl: audioUrl,
    status,
    duration
  };

  if (idInt > 0) {
    work = await updateTtsWork(idInt, saveData as Prisma.TtsWorkUpdateInput);
    if (prevPath) {
      work.prevPath = prevPath;
    }
    return response.success("更新成功！", work);
  } else {
    saveData.creatorId = Number(userId);
    saveData.createdAt = now();
    work = await createTtsWork(saveData as Prisma.TtsWorkCreateInput);
    if (prevPath) {
      work.prevPath = prevPath;
    }
    return response.success("保存成功！", work);
  }
}
