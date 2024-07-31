import { Suspense } from "react";
import Editor from "@/components/lexical";

export default function Home() {
  return (
    <div className="tts-editor-root">
      <Suspense>
        <Editor />
      </Suspense>
    </div>
  );
}
