import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { ConflictMatrix } from '../types';

interface FileUploadProps {
  onDataLoaded: (matrix: ConflictMatrix, subjects: string[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const result = await parseExcelFile(file);

    if (result.success && result.matrix && result.subjects) {
      onDataLoaded(result.matrix, result.subjects);
    } else {
      setError(result.error || 'خطأ غير معروف');
    }

    setLoading(false);
    // Reset input to allow re-uploading same file if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div 
        className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-10 flex flex-col items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        {loading ? (
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        ) : (
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mb-2">رفع ملف مصفوفة التعارض</h3>
        <p className="text-gray-500 text-center mb-6">
          انقر هنا لاختيار ملف Excel (.xlsx) يحتوي على مصفوفة المواد
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
           <FileSpreadsheet className="w-4 h-4" />
           <span>يجب أن يحتوي الملف على أسماء المواد في الصف الأول والعمود الأول</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
