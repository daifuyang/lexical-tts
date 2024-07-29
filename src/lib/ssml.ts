import dayjs from "dayjs";
import { existsSync, mkdirSync } from "fs";
import { convert, pinyin } from "pinyin-pro";
import { v4 } from "uuid";
import tts from "./tts";
import { uploadFile } from "./qiniu";

let existStartVoice = false; //存在结尾闭合标签
const parseSSMLNode = (nodes: any = [], shortName: string) => {
  let ssml = "";
  nodes.forEach((node: any, i: number) => {
    switch (node.type) {
      case "paragraph":
      case "sampleNode":
        existStartVoice = true;
        ssml += `<voice name="${shortName}">`;
        const childrenNodes = node.children;
        const content = parseSSMLNode(childrenNodes, shortName);
        if (content) {
          ssml += content;
        }
        ssml += "</voice>";
        break;
      case "voiceNode":
        let start = "";
        if (existStartVoice) {
          start = "</voice>";
        }

        let end = `<voice name="${shortName}">`;

        if (i > 1) {
          const previous = nodes[i - 1];
          if (previous.type === "voiceNode") {
            start = "";
          }
        }

        if (i < nodes.length - 1) {
          const next = nodes[i + 1];
          if (next.type === "voiceNode") {
            end = "";
          }
        }

        // 如果是结尾
        if (i === nodes.length - 1) {
          end = "";
          existStartVoice = false;
        }

        let voiceChildrenSsml = parseSSMLNode(node.children, shortName);
        let voice = `${start}<voice name="${node.voice}">${voiceChildrenSsml}</voice>${end}`;

        if (voiceChildrenSsml) {
          ssml += voice;
        }
        break;
      case "pinyinNode":
        let pinyinNodeText = "";
        if (node?.children?.length > 0) {
          pinyinNodeText = node.children.map((item: any) => item.text)?.join("");
        }
        let ph = convert(node.pinyin, { format: "symbolToNum" });
        if (ph) {
          let num = ph.slice(-1);
          if (num == "0") {
            num = "1";
          }
          ph = ph.slice(0, -1) + " " + num;
          ssml += `<phoneme alphabet="sapi" ph="${ph}">${pinyinNodeText}</phoneme>`;
        } else {
          ssml += `${pinyinNodeText}`;
        }
        break;

      case "symbolNode":
        let symbolNodeText = "";
        if (node?.children?.length > 0) {
          symbolNodeText = node.children.map((item: any) => item.text)?.join("");
        }
        // 数字，符号的逻辑不同
        switch (node.readType) {
          case "序列":
          case "数值":
            const reads = pinyin(node.value, { toneType: "num", type: "array" });
            const ph = reads.map((read) => read.slice(0, -1) + " " + read.slice(-1)).join(" ");
            ssml += `<phoneme alphabet="sapi" ph="${ph}">${symbolNodeText}</phoneme>`;
            return;
          default:
            ssml += `${symbolNodeText}`;
        }
        break;

      case "speedNode":
        let speedChildrenSsml = parseSSMLNode(node.children, shortName);
        // const speedNodetext = speedNodes?.map((item: any) => item.text)?.join("");
        ssml += `<prosody rate="${node.speed}0%">${speedChildrenSsml}</prosody>`;
        break;

      case "wrapNode":
        let wrapChildrenSsml = parseSSMLNode(node.children, shortName);
        ssml += wrapChildrenSsml;
        break;
      default:
        ssml += `${node.text}`;
        break;
    }
  });
  return ssml;
};

export const getSsml = (nodes: any = [], shortName: string = "zh-CN-XiaoxiaoNeural") => {
  let ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-cn">`;
  ssml += parseSSMLNode(nodes, shortName);
  ssml += `</speak>`;
  return ssml;
};

// 生成音频
export const generateAudio = async (editorState: string, voiceName: string, predix="") => {
  const nodes = JSON.parse(editorState);
  const ssml = getSsml(nodes, voiceName);
  // 统计字数

  // 判断vip

  // 其他逻辑

  const localDir = "tts";
  const currentDate = dayjs().format("YYYY-MM-DD");
  const keyDir = `${localDir}/${currentDate}/`;
  const assetDir = process.cwd() + `/output/`; // 资源根路径
  const target = assetDir + keyDir;
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }

  // 增加文件安全显示，可加上加密转换逻辑
  const name = predix + v4();
  const localFile = target + name + ".mp3";
  const res = await new tts(localFile).synthesizeText(ssml);

  if (res.success === "ok") {
    const filename = name + ".mp3";
    const key = keyDir + filename;

    // 上传到七牛云
    const uploadRes: any = await uploadFile(filename, key, localFile);
    return { status: "ok", res: uploadRes, filename };
  }
  return { status: "error", res };
};
