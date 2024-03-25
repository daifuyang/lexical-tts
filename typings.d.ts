declare global {
  namespace NodeJS {
    interface ProcessEnv {
      subscriptionKey: string;
      serviceRegion: string;
    }
  }
}
export {};