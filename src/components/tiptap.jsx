"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarteKit from "@tiptap/starter-kit";
import { Toolbar } from "./editor";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Paragraph from "@tiptap/extension-paragraph";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import { useCallback } from "react";

export default function TipTap({ content, onChange, height = 300 }) {
  const clas = `min-h-[${height}px] py-4`;
  const editor = useEditor({
    extensions: [
      StarteKit.configure(),
      Underline,
      Paragraph,
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold",
          levels: [2, 3],
        },
      }),
      ListItem,
      OrderedList,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: `min-h-[${height}px] py-4`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch">
      <Toolbar editor={editor} />
      <div className={`border border-gray-200 mb-4 prose prose-lg`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
