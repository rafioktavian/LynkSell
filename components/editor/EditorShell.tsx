"use client";

import { useState } from "react";
import { EditorPanel } from "./EditorPanel";
import { PreviewFrame } from "./PreviewFrame";

export function EditorShell({ pageData }: { pageData: any }) {
  const [localPage, setLocalPage] = useState(pageData);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  const handleUpdateLocal = (updates: any) => {
    setLocalPage((prev: any) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-1 w-full overflow-hidden bg-white relative">
      {/* Mobile Tabs */}
      <div className="lg:hidden absolute top-0 left-0 right-0 z-40 flex bg-white border-b">
        <button
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "editor" ? "border-blue-600 text-blue-600" : "border-transparent text-neutral-500"
          }`}
          onClick={() => setActiveTab("editor")}
        >
          📝 Editor
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-neutral-500"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          👁️ Preview
        </button>
      </div>

      {/* Editor Panel (Left side on desktop, toggled on mobile) */}
      <div
        className={`w-full lg:w-[40%] flex-shrink-0 border-r bg-neutral-50 relative overflow-y-auto no-scrollbar 
        ${activeTab === "editor" ? "block" : "hidden lg:block"} lg:mt-0 mt-[49px]`}
      >
        <EditorPanel page={localPage} onUpdateLocal={handleUpdateLocal} />
      </div>

      {/* Preview Frame (Right side on desktop, toggled on mobile) */}
      <div
        className={`w-full lg:w-[60%] flex-1 bg-neutral-100 relative lg:mt-0 mt-[49px]
        ${activeTab === "preview" ? "block" : "hidden lg:block"}`}
      >
        <PreviewFrame page={localPage} />
      </div>
    </div>
  );
}
