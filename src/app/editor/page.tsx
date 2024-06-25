import Header from "./header";
import Editor from "@/components/lexical";

export default function Home() {
  return (
    <div className="tts-editor-root">
      <Header />
      <Editor />
    </div>
  );
}
