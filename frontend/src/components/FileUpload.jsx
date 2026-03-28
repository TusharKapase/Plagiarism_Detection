import { useState } from "react";

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) onUpload(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer text-blue-600 underline"
      >
        Click to select file
      </label>
      {file && (
        <div className="mt-4">
          <p className="text-gray-700">{file.name}</p>
          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
