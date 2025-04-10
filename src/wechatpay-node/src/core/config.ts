import fs from "fs";
import path from "path";
import { WeChatPayV3Config } from "../types/common";

export class Config implements WeChatPayV3Config {
  appId: string;
  mchId: string;
  privateKey: string;
  privateKeyPath: string;
  serialNo: string;
  apiV3Key: string;
  notifyUrl: string;

  constructor(config: WeChatPayV3Config) {
    if (
      !config.appId ||
      !config.mchId ||
      !config.serialNo ||
      !config.apiV3Key ||
      !config.privateKeyPath ||
      !config.apiV3Key ||
      !config.notifyUrl
    ) {
      console.log("config", config);
      throw new Error("Missing required configuration fields");
    }

    this.appId = config.appId;
    this.mchId = config.mchId;
    this.serialNo = config.serialNo;
    this.apiV3Key = config.apiV3Key;
    this.notifyUrl = config.notifyUrl || "";
    this.privateKeyPath = config.privateKeyPath;

    if (!config.privateKeyPath) {
      throw new Error("privateKeyPath must be provided");
    }

    const privateKeyPath = path.resolve(process.cwd(), this.privateKeyPath);
    this.privateKey = fs.readFileSync(privateKeyPath, "utf-8");
  }

  getConfig(): WeChatPayV3Config {
    return {
      ...this,
      privateKey: this.privateKey,
      privateKeyPath: this.privateKeyPath
    };
  }

  updateConfig(newConfig: Partial<WeChatPayV3Config>): void {
    if (newConfig.privateKeyPath) {
      throw new Error("Cannot update privateKeyPath after initialization");
    }
    Object.assign(this, newConfig);
  }
}
