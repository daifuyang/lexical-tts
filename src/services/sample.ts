import request from "@/lib/request";
// 新建作品
export function getSample(data: any) {
    // return new Promise((resolve) => {
    //     resolve({
    //         code: 1,
    //         msg: "生成成功！",
    //         data: {
    //           filename: "2024-07-15-31.mp3",
    //           filePath: "tts/sample/2024-07-15-31.mp3",
    //           prevPath: "https://cdn.vlog-v.com/tts/sample/2024-07-15-31.mp3"
    //         }
    //       });
    //   });
    return request.post("/api/member/sample", data);
}