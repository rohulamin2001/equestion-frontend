import apiClient, { getAccessToken } from "@/lib/apiClient";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import MathFormulaDialog from "./MathEditor/MathFormulaDialog";
import {
  createMathEditorPill,
  extractLatexFromPill,
} from "./MathEditor/mathUtils";

// Utility to resolve relative R2 image paths (e.g. questions/...) to full CDN URLs for Jodit Editor
function resolveEditorImages(html) {
  if (!html || typeof html !== "string") return html;
  const r2Base = (import.meta.env.VITE_R2_PUBLIC_URL || "").replace(/\/+$/, "");
  const apiBase = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  return html.replace(
    /src=["'](?!(?:https?:|\/\/|data:|blob:))\/?([^"']+)["']/gi,
    (match, path) => {
      if (path.startsWith("uploads/")) {
        return `src="${apiBase}/${path}"`;
      }
      if (r2Base) {
        return `src="${r2Base}/${path}"`;
      }
      return `src="${apiBase}/${path}"`;
    },
  );
}

export default function Editor({
  value = "",
  onChange = () => {},
  placeholder = "",
  height = 300,
  ...props
}) {
  const activeEditorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isFormulaDialogOpen, setIsFormulaDialogOpen] = useState(false);
  const [formulaDialogLatex, setFormulaDialogLatex] = useState("");
  const [formulaDialogDisplayMode, setFormulaDialogDisplayMode] =
    useState(false);
  const [editingTargetNode, setEditingTargetNode] = useState(null);

  // Resolve relative R2 paths so Jodit Editor displays images properly
  const resolvedValue = useMemo(() => {
    return resolveEditorImages(value);
  }, [value]);

  const handleInsertFormula = ({ latex, displayMode }) => {
    const editor = activeEditorRef.current;
    if (!editor) return;

    const pillHtml = createMathEditorPill(latex, displayMode);

    if (editingTargetNode && editingTargetNode.parentNode) {
      // Editing existing formula: replace in DOM
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = pillHtml;
      const newNode = tempDiv.firstElementChild;
      editingTargetNode.parentNode.replaceChild(newNode, editingTargetNode);
      setEditingTargetNode(null);
      // Trigger onChange with updated HTML
      onChange(editor.value);
    } else {
      // Inserting new formula at saved selection
      if (savedRangeRef.current) {
        try {
          editor.selection.restore(savedRangeRef.current);
        } catch (e) {
          console.warn("Could not restore selection range", e);
        }
        savedRangeRef.current = null;
      }
      const toInsert = displayMode
        ? `<p></p>${pillHtml}<p></p>`
        : `${pillHtml}&nbsp;`;
      editor.selection.insertHTML(toInsert);
      onChange(editor.value);
    }
  };

  const config = useMemo(() => {
    const apiBaseUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/+$/, "");

    return {
      readonly: false,
      placeholder: placeholder || "এখানে বিস্তারিত লিখুন...",
      height: height,
      showPoweredBy: false,
      addNewLine: false,
      toolbarButtonSize: "middle",
      defaultActionOnPaste: "insert_clear_html",
      enableDragAndDropFileToEditor: true,
      image: {
        openOnDblClick: true,
        editSize: true,
        editSrc: true,
      },
      controls: {
        formula: {
          name: "formula",
          text: "fx",
          tooltip: "গাণিতিক ও বৈজ্ঞানিক সূত্র (Insert Math Formula)",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4"/><path d="M14 4h6"/><path d="m8 20 6-16"/><path d="m4 12h8"/><path d="m15 15 5 5"/><path d="m20 15-5 5"/></svg>`,
          exec: (editor) => {
            activeEditorRef.current = editor;
            try {
              savedRangeRef.current = editor.selection.save();
            } catch (e) {
              console.warn("Could not save selection range", e);
            }
            setEditingTargetNode(null);
            setFormulaDialogLatex("");
            setFormulaDialogDisplayMode(false);
            setIsFormulaDialogOpen(true);
          },
        },
      },
      events: {
        afterInit: (editor) => {
          activeEditorRef.current = editor;
          // Bind double click listener to open formula editor on existing math formula pill
          editor.e.on(editor.editor, "dblclick", (e) => {
            const target = e.target;
            const pill = target ? target.closest(".math-formula-pill") : null;
            if (pill) {
              e.preventDefault();
              e.stopPropagation();
              activeEditorRef.current = editor;
              const { latex, displayMode } = extractLatexFromPill(pill);
              setEditingTargetNode(pill);
              setFormulaDialogLatex(latex);
              setFormulaDialogDisplayMode(displayMode);
              setIsFormulaDialogOpen(true);
            }
          });
        },
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "superscript",
        "subscript",
        "formula",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "table",
        "image",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "source",
      ],
      // File upload configuration for Cloudflare R2
      uploader: {
        url: `${apiBaseUrl}/api/upload`,
        insertImageAsBase64URI: false,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        filesVariableName: () => "image",
        withCredentials: true,
        headers: () => {
          const token = getAccessToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        isSuccess: (resp) =>
          Boolean(resp && (resp.success === true || !!resp.url)),
        getMessage: (resp) => resp?.error || "ছবি আপলোড ব্যর্থ হয়েছে",
        process: (resp) => {
          const publicUrl = resp?.url || (resp?.files && resp?.files[0]) || "";
          return {
            files: publicUrl ? [publicUrl] : [],
            path: publicUrl,
            baseurl: "",
            isImages: [true],
            error: resp?.success === false ? 1 : 0,
            msg: resp?.error || "",
          };
        },
        customUploadFunction: async (formData, showProgress) => {
          try {
            if (showProgress) showProgress(15);

            if (formData instanceof FormData) {
              if (!formData.has("folder")) {
                formData.append("folder", "questions");
              }
              // Ensure field name is 'image' as expected by multer
              if (!formData.has("image")) {
                for (const [, val] of formData.entries()) {
                  if (val instanceof File || val instanceof Blob) {
                    formData.set("image", val);
                    break;
                  }
                }
              }
            }

            const res = await apiClient.post("/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (evt) => {
                if (evt.total && showProgress) {
                  showProgress(Math.round((evt.loaded * 100) / evt.total));
                }
              },
            });

            if (showProgress) showProgress(100);
            toast.success("ছবি সফলভাবে আপলোড হয়েছে!");
            return res.data;
          } catch (err) {
            if (showProgress) showProgress(100);
            const errMsg =
              err.response?.data?.error ||
              err.message ||
              "ছবি আপলোড করা যায়নি!";
            toast.error(errMsg);
            return {
              success: false,
              error: errMsg,
            };
          }
        },
      },
    };
  }, [placeholder, height]);

  return (
    <>
      <div className="jodit-editor-wrapper bg-white rounded-xl overflow-hidden border border-black/[0.08] focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition shadow-sm">
        <JoditEditor
          value={resolvedValue}
          config={config}
          onBlur={(newContent) => onChange(newContent)} // Use onBlur for performance
          {...props}
        />
      </div>

      <MathFormulaDialog
        key={
          isFormulaDialogOpen
            ? `${formulaDialogLatex}-${formulaDialogDisplayMode}-${editingTargetNode ? "edit" : "new"}`
            : "closed"
        }
        open={isFormulaDialogOpen}
        onOpenChange={setIsFormulaDialogOpen}
        initialLatex={formulaDialogLatex}
        initialDisplayMode={formulaDialogDisplayMode}
        onInsert={handleInsertFormula}
        isEditing={Boolean(editingTargetNode)}
      />
    </>
  );
}
