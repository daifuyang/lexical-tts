import * as sdk from "microsoft-cognitiveservices-speech-sdk";

class tts {
  private synthesizer: sdk.SpeechSynthesizer;

  constructor(filename: string) {
    const subscriptionKey = process.env.subscriptionKey;
    const serviceRegion = process.env.serviceRegion;
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    // speechConfig.speechSynthesisLanguage = "zh-CN";
    // speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural";
    this.synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  }

  async synthesizeText(text: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.synthesizer.speakSsmlAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log("Synthesis finished.", JSON.stringify(result));
            resolve({ success: "ok" });
          } else {
            console.error(
              "Speech synthesis canceled, " +
                result.errorDetails +
                "\nDid you update the subscription info?"
            );
            reject(result.errorDetails);
          }
          this.synthesizer.close();
        },
        (err) => {
          console.trace("Error - " + err);
          this.synthesizer.close();
          reject(err);
        }
      );
    });
  }
}

export default tts;
