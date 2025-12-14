import React from "react";

const EditorToolbar = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className="flex gap-2 border p-2 rounded bg-gray-100">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "font-bold" : ""}
            >
                Bold
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "italic" : ""}
            >
                Italic
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "line-through" : ""}
            >
                Strike
            </button>

            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
            >
                Paragraph
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                H2
            </button>
        </div>
    );
};

export default EditorToolbar;
