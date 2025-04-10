import { createSign, randomBytes } from "crypto";
import { Config } from "./config";

export interface SignatureResult {
  authorization: string;
  serialNo: string;
}

export class Signer {
  private signatureCache = new Map<string, string>();
  
  constructor(private config: Config) {}

  async sign(
    method: string,
    url: string,
    body: string | Record<string, unknown>
  ): Promise<SignatureResult> {
    if (!method || !url) {
      throw new Error("Method and URL are required");
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const nonceStr = this.generateNonceStr();
      const bodyStr = typeof body === "string" ? body : JSON.stringify(body || {});

      const cacheKey = `${method}:${url}:${timestamp}:${nonceStr}:${bodyStr}`;
      let signature = this.signatureCache.get(cacheKey);
      
      if (!signature) {
        const message = this.buildMessage(method, url, timestamp, nonceStr, bodyStr);
        signature = this.createSignature(message);
        this.signatureCache.set(cacheKey, signature);
      }

      return {
        authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${this.config.mchId}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${this.config.serialNo}"`,
        serialNo: this.config.serialNo
      };
    } catch (error) {
      throw new Error(`Signing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private buildMessage(
    method: string,
    url: string,
    timestamp: string,
    nonceStr: string,
    body: string
  ): string {
    return `${method}\n${url}\n${timestamp}\n${nonceStr}\n${body}\n`;
  }

  private createSignature(message: string): string {
    if (!this.config.privateKey) {
      throw new Error("Private key not initialized");
    }
    
    const sign = createSign("RSA-SHA256");
    sign.update(message);
    return sign.sign(this.config.privateKey, "base64");
  }

  private generateNonceStr(length = 32): string {
    return randomBytes(length)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, length);
  }
}
