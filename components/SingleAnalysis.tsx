import React, { useMemo, useState } from 'react';
import { ConflictMatrix } from '../types';
import { CheckCircle2, XCircle, Search } from 'lucide-react';

interface SingleAnalysisProps {
  matrix: ConflictMatrix;
  subjects: string[];
}

const SingleAnalysis: React.FC<SingleAnalysisProps> = ({ matrix, subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const analysis = useMemo(() => {
    if (!selectedSubject || !matrix[selectedSubject]) return null;

    const row = matrix[selectedSubject];
    const conflicts: string[] = [];
    const nonConflicts: string[] = [];

    subjects.forEach((subj) => {
      // Don't compare with self
      if (subj === selectedSubject) return;

      if (row[subj]) {
        conflicts.push(subj);
      } else {
        nonConflicts.push(subj);
      }
    });

    return { conflicts, nonConflicts };
  }, [selectedSubject, matrix, subjects]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">اختر مادة للتحليل:</label>
        <div className="relative">
            <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none outline-none transition-all"
            >
            <option value="">-- اختر المادة --</option>
            {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
            ))}
            </select>
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Conflicts */}
          <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">مواد متعارضة ({analysis.conflicts.length})</h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {analysis.conflicts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.conflicts.map((s) => (
                    <span key={s} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">لا يوجد تعارضات</p>
              )}
            </div>
          </div>

          {/* Non-Conflicts */}
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-900">مواد غير متعارضة ({analysis.nonConflicts.length})</h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {analysis.nonConflicts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.nonConflicts.map((s) => (
                    <span key={s} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">جميع المواد متعارضة</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAnalysis;
