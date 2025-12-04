import React, { useState } from 'react';
import { ConflictMatrix, AnalysisMode } from './types';
import FileUpload from './components/FileUpload';
import SingleAnalysis from './components/SingleAnalysis';
import MultiAnalysis from './components/MultiAnalysis';
import { LayoutDashboard, Users, User, RefreshCw, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [matrix, setMatrix] = useState<ConflictMatrix | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [mode, setMode] = useState<AnalysisMode>('single');

  const handleDataLoaded = (loadedMatrix: ConflictMatrix, loadedSubjects: string[]) => {
    setMatrix(loadedMatrix);
    setSubjects(loadedSubjects);
  };

  const handleReset = () => {
    setMatrix(null);
    setSubjects([]);
    setMode('single');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">محلل تعارض الاختبارات</h1>
          </div>
          
          {matrix && (
             <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-md border border-gray-200 hover:border-red-200"
             >
                <RefreshCw className="w-4 h-4" />
                <span>ملف جديد</span>
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!matrix ? (
          // Step 1: Upload
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">أداة تحليل مصفوفة التعارض</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                قم برفع ملف Excel يحتوي على مصفوفة المواد لتحديد التعارضات تلقائياً. 
                يساعدك النظام في تحليل تعارض مادة واحدة أو مجموعة مواد دفعة واحدة.
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
            
            {/* Example Instruction */}
            <div className="mt-12 max-w-2xl mx-auto bg-blue-50 p-6 rounded-xl border border-blue-100 text-sm text-blue-800">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    تعليمات الملف:
                </h4>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>يجب أن يحتوي الصف الأول على أسماء المواد.</li>
                    <li>يجب أن يحتوي العمود الأول على نفس أسماء المواد.</li>
                    <li>القيم داخل الخلايا: "نعم", "Yes", "1" للتعارض، و "لا", "No", "0" لعدم التعارض.</li>
                </ul>
            </div>
          </div>
        ) : (
          // Step 2 & 3: Analysis
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Stats Bar */}
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
               <div>
                  <h2 className="text-2xl font-bold">تم تحميل البيانات بنجاح</h2>
                  <p className="text-indigo-200 mt-1">إجمالي المواد: <span className="text-white font-mono font-bold bg-indigo-700 px-2 py-0.5 rounded">{subjects.length}</span></p>
               </div>
               <div className="flex bg-indigo-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setMode('single')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${mode === 'single' ? 'bg-white text-indigo-900 shadow-sm font-bold' : 'text-indigo-200 hover:text-white hover:bg-indigo-700'}`}
                  >
                    <User className="w-4 h-4" />
                    تحليل فردي
                  </button>
                  <button 
                    onClick={() => setMode('multi')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${mode === 'multi' ? 'bg-white text-indigo-900 shadow-sm font-bold' : 'text-indigo-200 hover:text-white hover:bg-indigo-700'}`}
                  >
                    <Users className="w-4 h-4" />
                    تحليل جماعي
                  </button>
               </div>
            </div>

            {/* Analysis Component Wrapper */}
            <div className="transition-all duration-300">
               {mode === 'single' ? (
                 <SingleAnalysis matrix={matrix} subjects={subjects} />
               ) : (
                 <MultiAnalysis matrix={matrix} subjects={subjects} />
               )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
