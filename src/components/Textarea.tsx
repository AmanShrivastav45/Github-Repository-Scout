import React, { useEffect, useRef, useState } from "react";

interface Props {
  fileStructure: string[];
  dummyStructure: string[];
}

const TextArea: React.FC<Props> = ({ fileStructure, dummyStructure }) => {

  const contentArray: string[] = fileStructure.length ? fileStructure : dummyStructure;
  const fullText: string = contentArray.join("\n");

  const [displayedText, setDisplayedText] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(() => {
        const updated = fullText.slice(0, index);
        return updated;
      });
      index++;

      if (index > fullText.length) clearInterval(interval);
    }, 5);

    return () => clearInterval(interval);
  }, [fullText]);

  useEffect(() => {
    if (textAreaRef.current)
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
  }, [displayedText]);

  return (
    <textarea wrap="off" style={{ zIndex: 20000 }} ref={textAreaRef} readOnly rows={20} value={displayedText} className="bg-[#1e1e1e] text-green-400 Fira-Code text-sm sm:text-base resize-none h-full w-full outline-none p-4 sm:p-6 hide-scrollbar border border-[#3a3a3a] mr-4" />
  );
};

export default TextArea;
