"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { ControllerRenderProps } from "react-hook-form";

import Quill from "quill";

type EditorProps = ControllerRenderProps & {
  id?: string;
  placeholder: string;
};

const Editor = (props: EditorProps) => {
  const { id, ref, value, disabled, placeholder, onBlur, onChange } = props;
  const quill = useRef<Quill | null>(null);
  const container = useRef<HTMLDivElement>({} as HTMLDivElement);

  useEffect(() => {
    if (quill.current) {
      return;
    }

    quill.current = new Quill(container.current, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
      },
      placeholder: placeholder,
      theme: "snow", // or 'bubble'
    });

    if (value) {
      const delta = quill.current.clipboard.convert(value);
      quill.current.setContents(delta);
    }

    console.log("quill.current", quill.current);
    console.log("Quill.events", Quill.events);
  }, []);

  useEffect(() => {
    if (!quill.current) {
      return;
    }

    const onTextChange = () => {
      onChange?.(quill.current?.getSemanticHTML());
    };

    quill.current.on(Quill.events.TEXT_CHANGE, onTextChange);
    quill.current.root.addEventListener("blur", onBlur);

    return () => {
      quill.current?.off(Quill.events.TEXT_CHANGE, onTextChange);
      quill.current?.root.removeEventListener("blur", onBlur);
    };
  }, [onBlur, onChange]);

  useEffect(() => {
    if (!quill.current) {
      return;
    }

    disabled ? quill.current.disable() : quill.current.enable();
  }, [disabled]);

  useImperativeHandle(ref, () => container.current, []);

  return (
    <div
      id={id}
      ref={container}
      className="min-h-14 rounded-md rounded-t-none border border-input bg-transparent shadow-sm"
    />
  );
};

export default Editor;
