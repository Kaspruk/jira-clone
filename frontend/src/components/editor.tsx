"use client";

import React, {
  memo,
  useEffect,
  useRef,
  useImperativeHandle,
  RefObject,
  useState,
} from "react";
import { ControllerRenderProps } from "react-hook-form";
import { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

const theme = 'snow';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],

    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],

    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'align',
  'list',
  'indent',
  'size',
  'header',
  'link',
  'image',
  'video',
  'color',
  'background',
];

function assign(target: any, _varArgs: any) {
  'use strict';
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const to = Object(target);

  for (let index = 1; index < arguments.length; index++) {
    const nextSource = arguments[index];

    if (nextSource !== null && nextSource !== undefined) {
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}

export function useQuill(options: QuillOptions | undefined = { theme, modules, formats }) {
  const quillRef: RefObject<any> = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [obj, setObj] = useState({
    Quill: undefined as any | undefined,
    quillRef,
    quill: undefined as any,
    editorRef: quillRef,
    editor: undefined as any,
  });

  useEffect(() => {
    if (!obj.Quill) {
      setObj(prev => assign(prev, { Quill: require('quill').default }));
    }
    if (obj.Quill && !obj.quill && quillRef && quillRef.current && isLoaded) {
      const opts = assign(options, {
        modules: assign(modules, options.modules),
        formats: options.formats || formats,
        theme: options.theme || theme,
      });
      const quill = new obj.Quill(quillRef.current, opts);

      setObj(assign(assign({}, obj), { quill, editor: quill }));
    }
    setIsLoaded(true);
  }, [isLoaded, obj, options]);

  return obj;
};

type EditorProps = Partial<ControllerRenderProps> & {
  id?: string;
  placeholder: string;
  defaultValue?: string;
};

const Editor = memo((props: EditorProps) => {
  const { id, ref, disabled, placeholder, defaultValue, onBlur, onChange } = props;
  const container = useRef<HTMLDivElement>({} as HTMLDivElement);

  const { Quill, quill, quillRef } = useQuill({
    placeholder: placeholder,
  });

  useEffect(() => {
    if (!quill) {
      return;
    }

    if (defaultValue) {
      const delta = quill.clipboard.convert({
        html: defaultValue,
      });
      quill.setContents(delta);
    }
  }, [quill, defaultValue]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    const onTextChange = () => {
      onChange?.(quill?.getSemanticHTML());
    };

    if (onBlur) {
      quill.root.addEventListener("blur", onBlur);
    }

    quill.on(Quill.events.TEXT_CHANGE, onTextChange);

    return () => {
      quill?.off(Quill.events.TEXT_CHANGE, onTextChange);
      if (onBlur) {
        quill?.root.removeEventListener("blur", onBlur);
      }
    };
  }, [quill, onBlur, onChange]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    disabled ? quill.disable() : quill.enable();
  }, [disabled]);

  useImperativeHandle(ref, () => container.current, []);

  return (
    <div
      id={id}
      ref={quillRef}
      className="min-h-14 rounded-md rounded-t-none border border-input bg-transparent shadow-sm"
    />
  );
});

export default Editor;
