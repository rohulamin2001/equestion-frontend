import { useAuth } from "@clerk/react";
import JoditEditor from "jodit-react";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Editor({ value = "", onChange = () => {}, placeholder = "", height = 300, ...props }) {
  const { getToken } = useAuth();
  const [token, setToken] = useState("");
  const [loadingToken, setLoadingToken] = useState(true);

  // Fetch token for uploader authentication
  useEffect(() => {
    async function fetchToken() {
      try {
        const jwt = await getToken();
        setToken(jwt || "");
      } catch (err) {
        console.error("Error fetching Clerk auth token for editor upload:", err);
      } finally {
        setLoadingToken(false);
      }
    }
    fetchToken();
  }, [getToken]);

  const config = useMemo(() => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8001";
    
    return {
      readonly: false,
      placeholder: placeholder || "এখানে বিস্তারিত লিখুন...",
      height: height,
      showPoweredBy: false,
      addNewLine: false,
      toolbarButtonSize: "middle",
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|",
        "superscript", "subscript", "|",
        "ul", "ol", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "table", "image", "link", "|",
        "align", "undo", "redo", "|",
        "hr", "eraser", "source"
      ],
      // File upload configuration for Cloudinary
      uploader: token ? {
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
      } : undefined,
    };
  }, [token, placeholder, height]);

  if (loadingToken) {
    return (
      <div className="h-[200px] border border-black/[0.08] rounded-xl flex items-center justify-center bg-white/[0.45] backdrop-blur-sm">
        <Loader2 className="animate-spin text-slate-400 size-6" />
      </div>
    );
  }

  return (
    <div className="jodit-editor-wrapper bg-white rounded-xl overflow-hidden border border-black/[0.08] focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition shadow-sm">
      <JoditEditor
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)} // Use onBlur for performance as onChange re-renders too frequently
        {...props}
      />
    </div>
  );
}
