import React, { useState, useRef } from "react";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  ExternalLink,
} from "lucide-react";

const MultipartUploadAndView = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null); // { url, type, name }
  const fileInputRef = useRef(null);
  const abortControllersRef = useRef({});

  // API Configuration
  const API_BASE_URL = "https://v2-dev-api.esigns.io/v1.0";
  const API_HEADERS = {
    "Content-Type": "application/json",
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTM1ZmNmYmU5Mzk4YWNiOGVjZDRjMSIsImVtYWlsIjoia2F2eWFrYWRhbGkyMDAzQGdtYWlsLmNvbSIsImlhdCI6MTc1MzUzMTkwNiwiZXhwIjoxNzUzNjE4MzA2fQ.aE6vaNvP7S6HgWMonR95fWSK3YaQ9Cy3BNP6CMyHBZw",
  };

  // Calculate chunk size and total chunks
  const calculateChunks = (fileSize, chunkSize = 5 * 1024 * 1024) => {
    const totalChunks = Math.ceil(fileSize / chunkSize);
    return { chunkSize, totalChunks };
  };

  // API calls
  const startMultipartUpload = async (fileName, fileType, fileSize) => {
    try {
      const response = await fetch(`${API_BASE_URL}/start-multipart-upload`, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          file_path: fileName,
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Start multipart upload error:", error);
      throw error;
    }
  };

  const getPresignedUrls = async (fileKey, uploadId, parts) => {
    try {
      const response = await fetch(`${API_BASE_URL}/multipart-upload-urls`, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({
          file_key: fileKey,
          upload_id: uploadId,
          parts: parts,
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data.upload_urls;
    } catch (error) {
      console.error("Get presigned URLs error:", error);
      throw error;
    }
  };

  const completeMultipartUpload = async (fileKey, uploadId, parts) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/complete-multipart-upload`,
        {
          method: "POST",
          headers: API_HEADERS,
          body: JSON.stringify({
            file_key: fileKey,
            upload_id: uploadId,
            parts: parts,
          }),
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Complete multipart upload error:", error);
      throw error;
    }
  };

  // Upload chunk to S3
  const uploadChunk = async (
    presignedUrl,
    chunk,
    partNumber,
    fileId,
    totalChunks
  ) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress((prev) => {
            const currentProgress = prev[fileId] || { chunks: {}, overall: 0 };
            const updatedChunks = {
              ...currentProgress.chunks,
              [partNumber]: percentComplete,
            };
            const chunkProgresses = Object.values(updatedChunks);
            const overallProgress =
              chunkProgresses.length > 0
                ? chunkProgresses.reduce((sum, p) => sum + p, 0) / totalChunks
                : 0;
            return {
              ...prev,
              [fileId]: {
                chunks: updatedChunks,
                overall: Math.round(overallProgress),
              },
            };
          });
        }
      });
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const etag = xhr.getResponseHeader("ETag");
          resolve({ etag: etag.replace(/"/g, ""), partNumber });
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send(chunk);
    });
  };

  // Main upload function
  const uploadFile = async (file) => {
    const fileId = `${file.name}-${Date.now()}`;
    try {
      setUploadStatus((prev) => ({ ...prev, [fileId]: "uploading" }));
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { chunks: {}, overall: 0 },
      }));
      const { chunkSize, totalChunks } = calculateChunks(file.size);
      const { upload_id, file_key } = await startMultipartUpload(
        file.name,
        file.type,
        file.size
      );
      const presignedUrls = await getPresignedUrls(
        file_key,
        upload_id,
        totalChunks
      );
      const uploadPromises = [];
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        const partNumber = i + 1;
        uploadPromises.push(
          uploadChunk(presignedUrls[i], chunk, partNumber, fileId, totalChunks)
        );
      }
      const uploadResults = await Promise.all(uploadPromises);
      const parts = uploadResults
        .map((result) => ({ ETag: result.etag, PartNumber: result.partNumber }))
        .sort((a, b) => a.PartNumber - b.PartNumber);
      const completionResult = await completeMultipartUpload(
        file_key,
        upload_id,
        parts
      );
      setUploadStatus((prev) => ({ ...prev, [fileId]: "completed" }));
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: { ...prev[fileId], overall: 100 },
      }));
      const uploadedFileData = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        downloadUrls: completionResult.download_urls || [],
        docPaths: completionResult.doc_paths || [],
        convertedDownloadUrls: completionResult.converted_download_urls || [],
      };
      setUploadedFiles((prev) => [...prev, uploadedFileData]);
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      setUploadStatus((prev) => ({ ...prev, [fileId]: "error" }));
      let errorMessage = "Upload failed";
      if (error.message.includes("401"))
        errorMessage =
          "Authentication failed - Please check your API credentials";
      else if (error.message.includes("403"))
        errorMessage = "Access denied - Please check your permissions";
      else if (error.message.includes("404"))
        errorMessage = "API endpoint not found";
      alert(`${errorMessage}: ${error.message}`);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove file
  const removeFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileId];
      return newStatus;
    });
  };

  // Upload all files
  const uploadAllFiles = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = selectedFiles
        .filter((fileData) => uploadStatus[fileData.id] !== "completed")
        .map((fileData) => uploadFile(fileData.file));
      await Promise.all(uploadPromises);
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get status icon
  const getStatusIcon = (fileId) => {
    const status = uploadStatus[fileId];
    if (status === "completed")
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "error")
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (status === "uploading")
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  // Handle file download
  const handleDownload = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file preview
  const handlePreview = (file) => {
    const url = file.downloadUrls[0] || file.convertedDownloadUrls[0];
    if (!url) return;
    setPreviewFile({ url, type: file.type, name: file.name });
  };

  // Check if file is previewable
  const isPreviewable = (fileType) => {
    return ["application/pdf", "image/jpeg", "image/png", "image/gif"].includes(
      fileType
    );
  };

  // Render preview content
  const renderPreview = () => {
    if (!previewFile) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <File className="w-12 h-12 mb-4 text-gray-400" />
          <p>Select a file to preview</p>
        </div>
      );
    }
    if (!isPreviewable(previewFile.type)) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
          <p>Preview not available for this file type</p>
        </div>
      );
    }
    return previewFile.type === "application/pdf" ? (
      <iframe
        src={previewFile.url}
        className="w-full h-full rounded-md border border-gray-200"
        title={previewFile.name}
      />
    ) : (
      <img
        src={previewFile.url}
        alt={previewFile.name}
        className="w-full h-auto max-h-full object-contain rounded-md border border-gray-200"
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        S3 Multipart Upload
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload Section */}
        <div>
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={isUploading}
            >
              <Upload className="w-5 h-5" />
              Select Files
            </button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedFiles.map((fileData) => {
                  const progress = uploadProgress[fileData.id]?.overall || 0;
                  const status = uploadStatus[fileData.id];
                  return (
                    <div
                      key={fileData.id}
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(fileData.id)}
                          <div>
                            <p className="font-medium text-gray-800">
                              {fileData.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(fileData.size)} • {fileData.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(fileData.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          disabled={status === "uploading"}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {(status === "uploading" || status === "completed") && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                status === "completed"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {status === "error" && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                          Upload failed. Please check console for details.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="flex gap-4">
              <button
                onClick={uploadAllFiles}
                disabled={isUploading || selectedFiles.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload All Files
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setUploadProgress({});
                  setUploadStatus({});
                }}
                disabled={isUploading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-semibold mb-2">Upload Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Files:</span>
                  <span className="ml-2 font-medium">
                    {selectedFiles.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Completed:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {
                      Object.values(uploadStatus).filter(
                        (status) => status === "completed"
                      ).length
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Failed:</span>
                  <span className="ml-2 font-medium text-red-600">
                    {
                      Object.values(uploadStatus).filter(
                        (status) => status === "error"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Middle Column - Uploaded Files */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          {uploadedFiles.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center text-gray-500">
              <File className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No files uploaded yet</p>
              <p className="text-sm">Upload files to see them here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="border border-green-200 bg-green-50 rounded-md p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • Uploaded at{" "}
                          {new Date(file.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {file.downloadUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <button
                          onClick={() => handleDownload(url, file.name)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => handlePreview(file)}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    ))}
                    {file.convertedDownloadUrls &&
                      file.convertedDownloadUrls.length > 0 && (
                        <button
                          onClick={() =>
                            handlePreview({
                              ...file,
                              downloadUrls: file.convertedDownloadUrls,
                            })
                          }
                          className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Converted
                        </button>
                      )}
                  </div>
                  {file.docPaths && file.docPaths.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-medium">Path:</span>{" "}
                      {file.docPaths[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Preview Panel */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 h-[calc(100vh-200px)]">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipartUploadAndView;
