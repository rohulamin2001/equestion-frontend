import { memo, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils.js";
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

function InlineEditable({
  value = "",
  onSave,
  className = "",
  placeholder = "ক্লিক করে লিখুন...",
  singleLine = false,
  renderRichText = true,
  inline = true,
  onActivate,
  onDeactivate,
  style = {},
}) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);
  const clickCoordsRef = useRef(null);

  const handleStartEdit = (e) => {
    clickCoordsRef.current = { x: e.clientX, y: e.clientY };
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && editorRef.current) {
      const displayVal = inline ? stripOuterP(value) : value || "";
      editorRef.current.innerHTML = displayVal;
      editorRef.current.focus();

      if (clickCoordsRef.current) {
        const { x, y } = clickCoordsRef.current;
        clickCoordsRef.current = null;
        try {
          let range;
          if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(x, y);
          } else if (document.caretPositionFromPoint) {
            const position = document.caretPositionFromPoint(x, y);
            if (position) {
              range = document.createRange();
              range.setStart(position.offsetNode, position.offset);
              range.setEnd(position.offsetNode, position.offset);
            }
          }
          if (range) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
          }
        } catch {
          // Ignored
        }
      }

      if (onActivate) {
        const rect = editorRef.current.getBoundingClientRect();
        onActivate(rect);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        onClick={handleStartEdit}
        style={style}
        className={cn(
          "cursor-text rounded px-1 -mx-1 border border-transparent hover:border-dashed hover:border-indigo-400/50 hover:bg-indigo-50/10 transition print:border-none print:p-0 print:m-0",
          inline ? "inline" : "block",
          className,
        )}
        title="এডিট করতে ক্লিক করুন"
      >
        {value ? (
          renderRichText ? (
            <RichTextRender html={value} inline={inline} />
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: inline ? stripOuterP(value) : value,
              }}
            />
          )
        ) : (
          <span className="text-slate-400 italic print:hidden">
            {placeholder || "\u200B"}
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
      style={style}
      className={cn(
        "outline-none border border-indigo-500 rounded px-1 -mx-1 bg-white text-slate-800 [&_*]:inline [&_p]:inline [&_p]:m-0 [&_p]:p-0 break-words",
        inline ? "inline" : "block min-h-[1.2em]",
        className,
      )}
    />
  );
}

const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.className === nextProps.className &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.singleLine === nextProps.singleLine &&
    prevProps.renderRichText === nextProps.renderRichText &&
    prevProps.inline === nextProps.inline &&
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
  );
};

export default memo(InlineEditable, arePropsEqual);
