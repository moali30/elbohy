import { read, utils } from 'xlsx';
import { ConflictMatrix, ParseResult } from '../types';

/**
 * Normalizes values to boolean.
 * Accepts: "yes", "no", "true", "false", "1", "0", "نعم", "لا"
 */
const normalizeConflictValue = (val: any): boolean => {
  if (val === true || val === 1) return true;
  if (val === false || val === 0 || val === null || val === undefined) return false;

  const str = String(val).trim().toLowerCase();
  
  if (['yes', 'true', 'نعم', 'y'].includes(str)) return true;
  return false;
};

export const parseExcelFile = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({ success: false, error: 'فشل في قراءة الملف.' });
          return;
        }

        const workbook = read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to JSON array of arrays (header: 1 means raw array output)
        const jsonData = utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          resolve({ success: false, error: 'الملف فارغ أو لا يحتوي على بيانات كافية.' });
          return;
        }

        // Row 0 is headers (Subject names start from index 1)
        const headerRow = jsonData[0];
        // The cell at 0,0 is usually empty or "Subject", data starts at 1
        const colHeaders = headerRow.slice(1).map(h => String(h).trim());

        if (colHeaders.length === 0) {
           resolve({ success: false, error: 'لم يتم العثور على مواد في الصف الأول.' });
           return;
        }

        const matrix: ConflictMatrix = {};
        const subjects: string[] = [];

        // Validate structure: The rows following should match the columns
        // We iterate starting from index 1 (the data rows)
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          // First cell in row is the Subject Name
          const subjectName = String(row[0]).trim();
          
          // Basic validation to ensure we aren't reading empty trailing rows
          if (!subjectName) continue;

          subjects.push(subjectName);
          matrix[subjectName] = {};

          // Iterate through the rest of the cells in the row
          // They correspond to the colHeaders by index (cell index - 1)
          for (let j = 0; j < colHeaders.length; j++) {
            const targetSubject = colHeaders[j];
            // Safe access to row data, using index j + 1 because row[0] is the name
            const rawValue = row[j + 1]; 
            
            const isConflict = normalizeConflictValue(rawValue);
            matrix[subjectName][targetSubject] = isConflict;
          }
        }

        // Optional: strict validation that row subjects match column subjects
        // Checking if we have roughly a square matrix logic regarding keys
        
        // Check for mismatch size or content if critical, 
        // but for robustness we proceed with what we parsed.
        // Let's at least ensure we found subjects.
        if (subjects.length === 0) {
             resolve({ success: false, error: 'لم يتم العثور على صفوف للمواد.' });
             return;
        }

        resolve({ success: true, matrix, subjects });

      } catch (err) {
        console.error(err);
        resolve({ success: false, error: 'حدث خطأ أثناء معالجة ملف Excel.' });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'خطأ في قراءة الملف.' });
    };

    reader.readAsArrayBuffer(file);
  });
};