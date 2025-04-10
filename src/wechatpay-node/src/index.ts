import { IHttpClient } from "./core/interfaces";
import { INativeService, IJsapiService, WeChatPayV3Config } from "./types/common";
import { Config } from "./core/config";
import { HttpClient } from "./core/http";
import { NativeService } from "./services/native";
import { JsapiService } from "./services/jsapi";

export class WeChatPayV3 {
  public native: INativeService;
  public jsapi: IJsapiService;

  constructor(config: Config) {
    const conf = new Config(config);
    const http = new HttpClient(conf);
    this.native = new NativeService(http);
    this.jsapi = new JsapiService(http);
  }
}
