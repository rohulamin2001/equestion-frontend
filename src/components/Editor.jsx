import apiClient, { getAccessToken } from "@/lib/apiClient";
import JoditEditor from "jodit-react";
import { useMemo } from "react";
import { toast } from "sonner";

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
  // Resolve relative R2 paths so Jodit Editor displays images properly
  const resolvedValue = useMemo(() => {
    return resolveEditorImages(value);
  }, [value]);

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
