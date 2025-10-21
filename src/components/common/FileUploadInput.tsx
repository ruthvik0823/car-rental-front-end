import { Upload, Trash2 } from "lucide-react";

interface Props {
  label: string;
  value?: File;
  onChange: (file?: File) => void;
  onRemove: () => void;
  error?: string;
}

 function FileUploadInput({ label, value, onChange, onRemove, error }: Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) onChange(file);
  };

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <div className="border rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center h-32 relative overflow-hidden">
        {!value ? (
          <label htmlFor={`upload-${label}`} className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <Upload size={28} className="mx-auto mb-2 text-gray-400" />
            <span className="text-gray-700">Click to upload or drag and drop</span>
            <input
              id={`upload-${label}`}
              type="file"
              onChange={handleInputChange}
              className="opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer"
              accept="image/*,.pdf"
              tabIndex={0}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 truncate max-w-[140px]">{value.name}</span>
              <span className="text-gray-400 text-xs">{Math.round(value.size/1024)} KB</span>
            </div>
            <button type="button" onClick={onRemove} className="p-1 hover:text-red-600">
              <Trash2 size={22} />
            </button>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
export default FileUploadInput;