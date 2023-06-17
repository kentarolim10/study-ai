import { api } from "~/utils/api";
import Editor from "./Editor";
import Transcript from "./Transcript";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import { v4 as uuid } from "uuid";
import { env } from "~/env.mjs";

const appId = env.NEXT_PUBLIC_SPEECHLY_APP_ID;

const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

export type Word = {
  id: string;
  word: string;
  importance: number;
};

export default function EditorTranscriptClient() {
  const router = useRouter();
  const {
    listening,
    transcript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const {
    data: lecture,
    isLoading,
    ...rest
  } = api.lecture.getLecture.useQuery(
    { lectureId: router.query.lectureId as string },
    {
      enabled: !!router.query.lectureId && !transcript.length,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!lecture) {
    return <div>Somethings wrong</div>;
  }

  const formattedTranscript = transcript.split(" ").map((word) => {
    return {
      id: uuid(),
      word,
      importance: Object.hasOwn(lecture.keywords, word)
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          lecture.keywords[word]!
        : 0,
    };
  });

  formattedTranscript.unshift(...lecture.transcript);

  if (!isMicrophoneAvailable) {
    return <span>Microphone is not available.</span>;
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&#e9;t support speech recognition.</span>;
  }
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <>
      <section className="flex justify-end gap-2">
        <Controller
          listening={listening}
          startListening={startListening}
          stopListening={stopListening}
          transcript={transcript}
        />
      </section>
      <section className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h2>Editor</h2>
          <Editor />
        </div>
        <div className="flex flex-col gap-4">
          <h2>Transcript</h2>
          <Transcript words={formattedTranscript} />
        </div>
      </section>
    </>
  );
}

type ControllerProps = {
  startListening: () => void;
  stopListening: () => void;
  listening: boolean;
  transcript: string;
};

function Controller({
  listening,
  stopListening,
  startListening,
  transcript,
}: ControllerProps) {
  if (!listening && !transcript) {
    return <Button onClick={startListening}>Start</Button>;
  } else if (!listening && transcript) {
    return <Button onClick={startListening}>Resume</Button>;
  }

  return <Button onClick={stopListening}>Pause</Button>;
}
