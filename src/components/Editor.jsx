import { getAccessToken } from "@/lib/apiClient";
import JoditEditor from "jodit-react";
import { useMemo } from "react";

export default function Editor({
  value = "",
  onChange = () => {},
  placeholder = "",
  height = 300,
  ...props
}) {
  const token = getAccessToken();

  const config = useMemo(() => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    return {
      readonly: false,
      placeholder: placeholder || "এখানে বিস্তারিত লিখুন...",
      height: height,
      showPoweredBy: false,
      addNewLine: false,
      toolbarButtonSize: "middle",
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
      // File upload configuration for Cloudinary
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
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)} // Use onBlur for performance
        {...props}
      />
    </div>
  );
}
