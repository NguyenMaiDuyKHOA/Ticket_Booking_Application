"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Extension } from "@tiptap/core";
import { EditorContent, type Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  type LucideIcon,
  UnderlineIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { uploadImage } from "@/lib/uploads-api";

type RichTextEditorProps = {
  label: string;
  onChange: (html: string) => void;
  placeholder?: string;
  value: string;
};

const Indent = Extension.create({
  name: "indent",

  addGlobalAttributes() {
    return [
      {
        types: ["heading", "paragraph"],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const marginLeft = element.style.marginLeft;
              const match = /^(\d+(?:\.\d+)?)rem$/.exec(marginLeft);

              return match ? Number(match[1]) / 2 : 0;
            },
            renderHTML: (attributes) => {
              const indent = Number(attributes.indent || 0);

              return indent > 0 ? { style: `margin-left: ${indent * 2}rem` } : {};
            },
          },
        },
      },
    ];
  },
});

const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Underline,
  Link.configure({
    autolink: true,
    openOnClick: false,
    protocols: ["http", "https", "mailto", "tel"],
  }),
  Image.configure({
    allowBase64: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Indent,
];

/// <summary>
/// Rich text editor used by management screens to produce HTML descriptions for catalog items.
/// </summary>
export function RichTextEditor({ label, onChange, placeholder, value }: RichTextEditorProps) {
  const editor = useEditor({
    content: value,
    editorProps: {
      attributes: {
        class:
          "rich-content min-h-64 rounded-b-md border-x border-b border-black/10 bg-white px-4 py-3 text-sm leading-7 text-neutral-800 outline-none",
      },
    },
    extensions: editorExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) {
      return;
    }

    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="block md:col-span-2">
      <span className="text-sm font-bold text-neutral-800">{label}</span>
      <div className="mt-2 overflow-hidden rounded-md">
        <RichTextToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      {placeholder ? <span className="mt-2 block text-xs font-semibold text-neutral-500">{placeholder}</span> : null}
    </div>
  );
}

function RichTextToolbar({ editor }: { editor: Editor | null }) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  if (!editor) {
    return <div className="min-h-11 rounded-t-md border border-black/10 bg-neutral-50" />;
  }

  const currentEditor = editor;

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setImageUploadError(null);
    setIsUploadingImage(true);

    try {
      const result = await uploadImage(file, "rich-text");
      currentEditor.chain().focus().setImage({ src: result.secureUrl }).run();
    } catch (error) {
      setImageUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <div className="rounded-t-md border border-black/10 bg-neutral-50 p-2">
      <div className="flex flex-wrap gap-1">
        <ToolbarButton label="Heading 2" icon={Heading2} active={currentEditor.isActive("heading", { level: 2 })} onClick={() => currentEditor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton label="Heading 3" icon={Heading3} active={currentEditor.isActive("heading", { level: 3 })} onClick={() => currentEditor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <ToolbarButton label="Bold" icon={Bold} active={currentEditor.isActive("bold")} onClick={() => currentEditor.chain().focus().toggleBold().run()} />
        <ToolbarButton label="Italic" icon={Italic} active={currentEditor.isActive("italic")} onClick={() => currentEditor.chain().focus().toggleItalic().run()} />
        <ToolbarButton label="Underline" icon={UnderlineIcon} active={currentEditor.isActive("underline")} onClick={() => currentEditor.chain().focus().toggleUnderline().run()} />
        <ToolbarButton label="Bullet list" icon={List} active={currentEditor.isActive("bulletList")} onClick={() => currentEditor.chain().focus().toggleBulletList().run()} />
        <ToolbarButton label="Numbered list" icon={ListOrdered} active={currentEditor.isActive("orderedList")} onClick={() => currentEditor.chain().focus().toggleOrderedList().run()} />
        <ToolbarButton label="Blockquote" icon={Quote} active={currentEditor.isActive("blockquote")} onClick={() => currentEditor.chain().focus().toggleBlockquote().run()} />
        <ToolbarButton label="Align left" icon={AlignLeft} active={currentEditor.isActive({ textAlign: "left" })} onClick={() => currentEditor.chain().focus().setTextAlign("left").run()} />
        <ToolbarButton label="Align center" icon={AlignCenter} active={currentEditor.isActive({ textAlign: "center" })} onClick={() => currentEditor.chain().focus().setTextAlign("center").run()} />
        <ToolbarButton label="Align right" icon={AlignRight} active={currentEditor.isActive({ textAlign: "right" })} onClick={() => currentEditor.chain().focus().setTextAlign("right").run()} />
        <ToolbarButton label="Decrease indent" icon={IndentDecrease} onClick={() => outdent(editor)} />
        <ToolbarButton label="Increase indent" icon={IndentIncrease} onClick={() => indent(editor)} />
        <ToolbarButton label="Insert link" icon={LinkIcon} onClick={() => setLink(editor)} />
        <ToolbarButton
          label={isUploadingImage ? "Uploading image" : "Insert image"}
          icon={ImageIcon}
          disabled={isUploadingImage}
          onClick={() => imageInputRef.current?.click()}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {imageUploadError ? (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
          {imageUploadError}
        </p>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  active = false,
  disabled = false,
  icon: Icon,
  label,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => boolean | void | Promise<boolean | void>;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      title={label}
      onMouseDown={(event) => {
        // Tiptap toolbar actions must not steal focus from the editor selection before the command runs.
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={onClick}
      className={`inline-grid h-9 w-9 place-items-center rounded-md transition ${
        active ? "bg-red-700 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"
      } ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function setLink(editor: Editor) {
  const previousUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("URL", previousUrl ?? "");

  if (url === null) {
    return;
  }

  if (!url.trim()) {
    editor.chain().focus().unsetLink().run();
    return;
  }

  editor.chain().focus().setLink({ href: url.trim(), rel: "noopener noreferrer", target: "_blank" }).run();
}

function indent(editor: Editor) {
  if (editor.can().sinkListItem("listItem")) {
    editor.chain().focus().sinkListItem("listItem").run();
    return;
  }

  updateBlockIndent(editor, 1);
}

function outdent(editor: Editor) {
  if (editor.can().liftListItem("listItem")) {
    editor.chain().focus().liftListItem("listItem").run();
    return;
  }

  updateBlockIndent(editor, -1);
}

function updateBlockIndent(editor: Editor, delta: 1 | -1) {
  const nodeType = editor.isActive("heading") ? "heading" : "paragraph";
  const currentIndent = Number(editor.getAttributes(nodeType).indent || 0);
  const nextIndent = Math.max(0, Math.min(6, currentIndent + delta));

  editor.chain().focus().updateAttributes(nodeType, { indent: nextIndent }).run();
}
