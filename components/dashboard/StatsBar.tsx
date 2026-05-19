import { FileText, Eye, CheckCircle2, FileEdit } from "lucide-react";

interface Page {
  id: string;
  status: "draft" | "published";
  viewCount?: number;
}

export function StatsBar({ pages }: { pages: Page[] }) {
  const total = pages.length;
  const published = pages.filter((p) => p.status === "published").length;
  const draft = pages.filter((p) => p.status === "draft").length;
  const views = pages.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Halaman</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">Published</p>
          <p className="text-2xl font-bold text-gray-900">{published}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
          <FileEdit className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">Draft</p>
          <p className="text-2xl font-bold text-gray-900">{draft}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">{views}</p>
        </div>
      </div>
    </div>
  );
}
