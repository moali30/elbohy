import React, { useMemo, useState } from 'react';
import { ConflictMatrix } from '../types';
import { AlertTriangle, Info } from 'lucide-react';

interface MultiAnalysisProps {
  matrix: ConflictMatrix;
  subjects: string[];
}

const MultiAnalysis: React.FC<MultiAnalysisProps> = ({ matrix, subjects }) => {
  const [selectedGroup, setSelectedGroup] = useState<Set<string>>(new Set());

  const toggleSubject = (subject: string) => {
    const newSet = new Set(selectedGroup);
    if (newSet.has(subject)) {
      newSet.delete(subject);
    } else {
      newSet.add(subject);
    }
    setSelectedGroup(newSet);
  };

  const selectAll = () => setSelectedGroup(new Set(subjects));
  const clearAll = () => setSelectedGroup(new Set());

  const groupConflicts = useMemo(() => {
    const conflicts: { a: string; b: string }[] = [];
    const subjectsArray = Array.from(selectedGroup);

    // Compare each pair only once (i vs j where j > i)
    for (let i = 0; i < subjectsArray.length; i++) {
      for (let j = i + 1; j < subjectsArray.length; j++) {
        const subA = subjectsArray[i];
        const subB = subjectsArray[j];

        // Check matrix for conflict
        // Assuming symmetric matrix, but checking A->B is usually sufficient if built correctly
        if (matrix[subA]?.[subB]) {
          conflicts.push({ a: subA, b: subB });
        }
      }
    }
    return conflicts;
  }, [selectedGroup, matrix]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-gray-700">حدد مجموعة المواد للتحليل ({selectedGroup.size}):</label>
          <div className="space-x-2 space-x-reverse text-sm">
            <button onClick={selectAll} className="text-blue-600 hover:text-blue-800 font-medium">تحديد الكل</button>
            <span className="text-gray-300">|</span>
            <button onClick={clearAll} className="text-gray-500 hover:text-gray-700">إلغاء التحديد</button>
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {subjects.map((subj) => {
              const isSelected = selectedGroup.has(subj);
              return (
                <div 
                  key={subj}
                  onClick={() => toggleSubject(subj)}
                  className={`
                    cursor-pointer p-2 rounded-md text-sm transition-all select-none flex items-center gap-2 border
                    ${isSelected 
                      ? 'bg-blue-100 border-blue-200 text-blue-800 font-medium' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}
                  `}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                     {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="truncate">{subj}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom-2">
        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          {groupConflicts.length > 0 ? (
             <AlertTriangle className="w-6 h-6 text-amber-500" />
          ) : (
             <Info className="w-6 h-6 text-blue-500" />
          )}
          نتائج التحليل الجماعي
        </h3>

        {selectedGroup.size < 2 ? (
           <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
             يرجى اختيار مادتين على الأقل للمقارنة.
           </p>
        ) : groupConflicts.length === 0 ? (
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
               <p className="text-emerald-700 font-semibold text-lg">لا يوجد أي تعارض بين المواد المختارة!</p>
               <p className="text-emerald-600 text-sm mt-1">يمكن جدولة هذه المواد معاً بأمان.</p>
            </div>
        ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">تم العثور على <span className="font-bold text-red-600">{groupConflicts.length}</span> تعارض في المجموعة المختارة:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupConflicts.map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                    <span className="font-medium text-gray-800">{pair.a}</span>
                    <div className="h-px bg-red-300 flex-1 mx-3 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-100 px-1">
                            <span className="text-xs text-red-500">X</span>
                         </div>
                    </div>
                    <span className="font-medium text-gray-800">{pair.b}</span>
                  </div>
                ))}
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MultiAnalysis;
