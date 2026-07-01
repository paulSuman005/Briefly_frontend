import { FileText, File, FileType, FileType2, FileDigit } from 'lucide-react';

const fileIconMap = {
    pdf: FileText,
    doc: FileType,
    docx: FileType2,
    txt: FileDigit,
};

const defaultIcon = File;

const FileIcon = ({ fileName }) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const Icon = fileIconMap[extension] || defaultIcon;

    return (

        <Icon className="w-5 h-5 text-primary" />
    );
};

export default FileIcon;