import { useEffect, useRef } from "react";
import { type Word } from "./EditorTranscriptClient";

export default function Transcript({ words }: { words: Word[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const shouldScrollIntoViewRef = useRef(true);
  const previousScrollHeightRef = useRef(0);

  const hasScolledUp = () => {
    if (!containerRef.current) return false;
    return containerRef.current.scrollTop < previousScrollHeightRef.current;
  };

  const hasScrolledToBottom = () => {
    if (!containerRef.current) return false;
    return (
      Math.abs(
        containerRef.current.scrollHeight -
          containerRef.current.clientHeight -
          containerRef.current.scrollTop
      ) < 1
    );
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (hasScolledUp()) {
      shouldScrollIntoViewRef.current = false;
    } else if (hasScrolledToBottom()) {
      shouldScrollIntoViewRef.current = true;
    }

    previousScrollHeightRef.current = e.currentTarget.scrollTop;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (shouldScrollIntoViewRef.current) {
      pRef.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [words]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full max-h-[200px] overflow-y-auto rounded border-2 border-input p-2"
    >
      <p ref={pRef} className="flex flex-wrap gap-1">
        {words.length > 0 && words[0] && words[0].word !== ""
          ? words.map(({ word, id, importance }, index) => {
              return (
                <span key={id} className={importanceStyler(importance)}>
                  {word}
                </span>
              );
            })
          : "No transcript yet."}
      </p>
    </div>
  );
}
const importanceStyler = (importance: number) => {
  if (importance == 0) {
    return "text-white text-opacity-50";
  } else if (importance == 1) {
    return "text-white text-opacity-50";
  } else {
    return "text-white text-opacity-90 font-bold";
  }
};
