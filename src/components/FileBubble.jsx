import { FileText, File, FileType, FileType2, FileDigit } from 'lucide-react';

const fileIconMap = {
  pdf: FileText,       
  doc: FileType,
  docx: FileType2,
  txt: FileDigit,
};

const defaultIcon = File;

const FileBubble = ({ fileName, className }) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const Icon = fileIconMap[extension] || defaultIcon;

  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-base-200 shadow-sm max-w-[70%] border-1 border-white/50 ${className}`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      <span className="text-sm font-medium truncate">{fileName}</span>
    </div>
  );
};

export default FileBubble;