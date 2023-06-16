import Editor from "./Editor";
import Transcript from "./Transcript";
import ReactSpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function EditorTranscriptClient() {
  return (
    <>
      <section className="flex justify-end gap-2"></section>
      <section>
        <div className="flex flex-col gap-4">
          <h2>Editor</h2>
          <Editor />
        </div>
        <div className="flex flex-col gap-4">
          <h2>Transcript</h2>
          <Transcript />
        </div>
      </section>
    </>
  );
}
