import { getAccessToken } from "@/lib/apiClient";
import JoditEditor from "jodit-react";
import { useMemo } from "react";

// Utility to resolve relative R2 image paths (e.g. questions/...) to full CDN URLs for Jodit Editor
function resolveEditorImages(html) {
  if (!html || typeof html !== "string") return html;
  const r2Base = (import.meta.env.VITE_R2_PUBLIC_URL || "").replace(/\/+$/, "");
  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

  return html.replace(/src=["'](?!(?:https?:|\/\/|data:|blob:))\/?([^"']+)["']/gi, (match, path) => {
    if (path.startsWith("uploads/")) {
      return `src="${apiBase}/${path}"`;
    }
    if (r2Base) {
      return `src="${r2Base}/${path}"`;
    }
    return `src="${apiBase}/${path}"`;
  });
}

export default function Editor({
  value = "",
  onChange = () => {},
  placeholder = "",
  height = 300,
  ...props
}) {
  const token = getAccessToken();

  // Resolve relative R2 paths so Jodit Editor displays images properly
  const resolvedValue = useMemo(() => {
    return resolveEditorImages(value);
  }, [value]);

  const config = useMemo(() => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    return {
      readonly: false,
      placeholder: placeholder || "এখানে বিস্তারিত লিখুন...",
      height: height,
      showPoweredBy: false,
      addNewLine: false,
      toolbarButtonSize: "middle",
      defaultActionOnPaste: "insert_clear_html",
      image: {
        openOnDblClick: true,
        editSize: true,
        editSrc: true,
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "superscript",
        "subscript",
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
      uploader: token
        ? {
            url: `${apiBaseUrl}/api/upload`,
            format: "json",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            filesVariableName: "image",
            // Map Jodit's upload response
            isSuccess: (resp) => resp.success === true,
            getMessage: (resp) => resp.error || "Image uploaded successfully",
            process: (resp) => {
              return {
                files: resp.files || [resp.url],
                path: resp.url,
                baseurl: "",
                error: resp.error ? 1 : 0,
                msg: resp.error || "",
              };
            },
          }
        : undefined,
    };
  }, [token, placeholder, height]);

  return (
    <div className="jodit-editor-wrapper bg-white rounded-xl overflow-hidden border border-black/[0.08] focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition shadow-sm">
      <JoditEditor
        value={resolvedValue}
        config={config}
        onBlur={(newContent) => onChange(newContent)} // Use onBlur for performance
        {...props}
      />
    </div>
  );
}
