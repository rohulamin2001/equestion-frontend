import React, { useState, useRef, useEffect } from "react";
import RichTextRender from "./RichTextRender.jsx";

function stripOuterP(html) {
  if (!html) return "";
  let trimmed = String(html).trim();
  while (
    trimmed.toLowerCase().startsWith("<p") &&
    trimmed.toLowerCase().endsWith("</p>")
  ) {
    trimmed = trimmed
      .replace(/^<p[^>]*>/i, "")
      .replace(/<\/p>$/i, "")
      .trim();
  }
  return trimmed;
}

export default function InlineEditable({
  value = "",
  onSave,
  className = "",
  placeholder = "ক্লিক করে লিখুন...",
  singleLine = false,
  renderRichText = true,
  inline = true,
  onActivate,
  onDeactivate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      const displayVal = inline ? stripOuterP(value) : (value || "");
      editorRef.current.innerHTML = displayVal;
      editorRef.current.focus();

      if (onActivate) {
        const rect = editorRef.current.getBoundingClientRect();
        onActivate(rect);
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    if (!editorRef.current) return;
    let newHtml = editorRef.current.innerHTML.trim();
    if (inline) {
      newHtml = stripOuterP(newHtml);
    }
    setIsEditing(false);

    if (onDeactivate) {
      onDeactivate();
    }

    if (newHtml !== value && onSave) {
      onSave(newHtml);
    }
  };

  const handleKeyDown = (e) => {
    if (singleLine && e.key === "Enter") {
      e.preventDefault();
      editorRef.current?.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);
      if (onDeactivate) onDeactivate();
    }
  };

  if (!isEditing) {
    return (
      <span
        key="viewer"
        onClick={() => setIsEditing(true)}
        className={`cursor-text rounded px-1 -mx-1 border border-transparent hover:border-dashed hover:border-indigo-400/50 hover:bg-indigo-50/10 transition print:border-none print:p-0 print:m-0 ${
          inline ? "inline" : "block"
        } ${className}`}
        title="এডিট করতে ক্লিক করুন"
      >
        {value ? (
          renderRichText ? (
            <RichTextRender html={value} inline={inline} />
          ) : (
            <span
              dangerouslySetInnerHTML={{ __html: inline ? stripOuterP(value) : value }}
            />
          )
        ) : (
          <span className="text-slate-400 italic print:hidden">
            {placeholder}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      key="editor"
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none border border-indigo-500 ring-2 ring-indigo-500/20 rounded px-1 -mx-1 bg-white text-slate-800 ${
        inline ? "inline-block min-w-[40px]" : "block min-h-[32px]"
      } ${className}`}
    />
  );
}
