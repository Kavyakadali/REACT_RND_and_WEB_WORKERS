import React, { useState, useRef } from "react";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const MultipartUploadAndView = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({}); // 'uploading', 'completed', 'error'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const abortControllersRef = useRef({});

  // API Configuration - Replace with your actual API base URL and headers
  const API_BASE_URL = "https://v2-dev-api.esigns.io/v1.0";
  const API_HEADERS = {
    "Content-Type": "application/json",
    // Add your authentication headers here
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTM1ZmNmYmU5Mzk4YWNiOGVjZDRjMSIsImVtYWlsIjoia2F2eWFrYWRhbGkyMDAzQGdtYWlsLmNvbSIsImlhdCI6MTc1MzUzMTkwNiwiZXhwIjoxNzUzNjE4MzA2fQ.aE6vaNvP7S6HgWMonR95fWSK3YaQ9Cy3BNP6CMyHBZw",
    // 'X-API-Key': 'your-api-key',
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Complete multipart upload error:", error);
      throw error;
    }
  };

  // Upload chunk to S3
  const uploadChunk = async (presignedUrl, chunk, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const etag = xhr.getResponseHeader("ETag");
          resolve({ etag: etag.replace(/"/g, "") });
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

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
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      // Calculate chunks
      const { chunkSize, totalChunks } = calculateChunks(file.size);

      // Start multipart upload
      const { upload_id, file_key } = await startMultipartUpload(
        file.name,
        file.type,
        file.size
      );

      // Get presigned URLs for all parts
      const presignedUrls = await getPresignedUrls(
        file_key,
        upload_id,
        totalChunks
      );

      // Upload chunks
      const parts = [];
      const chunkProgresses = new Array(totalChunks).fill(0);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        const partNumber = i + 1;

        try {
          const { etag } = await uploadChunk(
            presignedUrls[i],
            chunk,
            (progress) => {
              chunkProgresses[i] = progress;
              const overallProgress =
                chunkProgresses.reduce((sum, p) => sum + p, 0) / totalChunks;
              setUploadProgress((prev) => ({
                ...prev,
                [fileId]: Math.round(overallProgress),
              }));
            }
          );

          parts.push({
            ETag: etag,
            PartNumber: partNumber,
          });
        } catch (chunkError) {
          console.error(`Error uploading chunk ${partNumber}:`, chunkError);
          throw chunkError;
        }
      }

      // Complete multipart upload
      const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);
      await completeMultipartUpload(file_key, upload_id, sortedParts);

      setUploadStatus((prev) => ({ ...prev, [fileId]: "completed" }));
      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      setUploadStatus((prev) => ({ ...prev, [fileId]: "error" }));

      // Show more specific error message
      let errorMessage = "Upload failed";
      if (error.message.includes("401")) {
        errorMessage =
          "Authentication failed - Please check your API credentials";
      } else if (error.message.includes("403")) {
        errorMessage = "Access denied - Please check your permissions";
      } else if (error.message.includes("404")) {
        errorMessage = "API endpoint not found";
      }

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
      for (const fileData of selectedFiles) {
        if (uploadStatus[fileData.id] !== "completed") {
          await uploadFile(fileData.file);
        }
      }
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
    const progress = uploadProgress[fileId] || 0;

    if (status === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status === "error") {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    } else if (status === "uploading") {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        S3 Multipart Upload
      </h2>

      {/* API Configuration Notice */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-semibold text-yellow-800 mb-2">
          ⚠️ Configuration Required
        </h3>
        <p className="text-sm text-yellow-700">
          Please update the API_BASE_URL and API_HEADERS in the component code
          with your actual API endpoint and authentication credentials.
        </p>
      </div>

      {/* File Selection */}
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

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedFiles.map((fileData) => {
              const progress = uploadProgress[fileData.id] || 0;
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

                  {/* Progress Bar */}
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

                  {/* Error Message */}
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

      {/* Upload Button */}
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

      {/* Upload Statistics */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">Upload Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Files:</span>
              <span className="ml-2 font-medium">{selectedFiles.length}</span>
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
  );
};

export default MultipartUploadAndView;
