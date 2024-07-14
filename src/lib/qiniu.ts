import qiniu from "qiniu";

// 上传文件到七牛云
export function uploadFile(fname: string, key: string ,localFile: string) {
  const bucket = process.env.qiniuBucket;

  const accessKey = process.env.qiniuAccessKey;
  const secretKey = process.env.qiniuSecretKey;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  const options = {
    scope: bucket
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  const config = new qiniu.conf.Config();

  const resumeUploader = new qiniu.resume_up.ResumeUploader(config);
  const putExtra = new qiniu.resume_up.PutExtra();
  putExtra.fname = fname;
  // 如果指定了断点记录文件，那么下次会从指定的该文件尝试读取上次上传的进度，以实现断点续传
  putExtra.resumeRecordFile = `logs/progress.log`;
  // 分片上传可指定 version 字段，v2 表示分片上传 v2
  putExtra.version = "v2";
  // 当使用分片上传 v2 时，默认分片大小为 4MB，也可自定义分片大小，单位为 Bytes。例如设置为 6MB
  // putExtra.partSize = 6 * 1024 * 1024

  return new Promise((resolve, reject) => {
    // 文件分片上传
    resumeUploader
      .putFile(uploadToken, key, localFile, putExtra)
      .then(({ data, resp }) => {
        if (resp.statusCode === 200) {
          console.log("data",data);
          resolve(data);
        } else {
          reject(resp);
        }
      })
      .catch((err) => {
        console.log("failed", err);
        reject(err);
      });
  });
}
