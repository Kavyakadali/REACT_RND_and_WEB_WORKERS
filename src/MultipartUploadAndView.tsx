import React, { useState, useRef, useCallback } from "react";
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
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";
import { debounce } from "lodash";

// Enhanced interfaces
interface SelectedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  chunks?: number;
  uploadedChunks?: number;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  downloadUrls: string[];
  docPaths: string[];
  convertedDownloadUrls: string[];
}

interface PreviewFile {
  url: string;
  type: string;
  name: string;
}

interface UploadProgress {
  [key: string]: {
    bytesUploaded: number;
    totalBytes: number;
    percentage: number;
    chunksCompleted: number;
    totalChunks: number;
    speed: number; // bytes per second
    eta: number; // seconds
    status:
      | "idle"
      | "uploading"
      | "paused"
      | "completed"
      | "error"
      | "cancelled";
  };
}

interface ChunkUploadState {
  [fileId: string]: {
    completedChunks: Set<number>;
    startTime: number;
    lastUpdate: number;
    bytesAtLastUpdate: number;
  };
}

const EnhancedMultipartUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [chunkStates, setChunkStates] = useState<ChunkUploadState>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllersRef = useRef<{ [key: string]: AbortController }>({});
  const pausedUploadsRef = useRef<Set<string>>(new Set());

  // API Configuration
  const API_BASE_URL = "https://v2-dev-api.esigns.io/v1.0";
  const API_HEADERS = {
    "Content-Type": "application/json",
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTM1ZmNmYmU5Mzk4YWNiOGVjZDRjMSIsImVtYWlsIjoia2F2eWFrYWRhbGkyMDAzQGdtYWlsLmNvbSIsImlhdCI6MTc1MzY2ODE3NCwiZXhwIjoxNzUzNzU0NTc0fQ.lZS0f4hU4TUzokIZFoG6v_BSMb4LiACjy8lzGBel-hw",
  };

  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

  // Calculate chunk information
  const calculateChunks = (fileSize: number) => {
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
    return { chunkSize: CHUNK_SIZE, totalChunks };
  };

  // Enhanced progress update with speed calculation
  const updateProgressWithSpeed = useCallback(
    (
      fileId: string,
      completedChunks: number,
      totalChunks: number,
      bytesUploaded: number,
      totalBytes: number
    ) => {
      const now = Date.now();

      setChunkStates((prev) => {
        const currentState = prev[fileId];
        if (!currentState) return prev;

        const timeDiff = (now - currentState.lastUpdate) / 1000; // seconds
        const bytesDiff = bytesUploaded - currentState.bytesAtLastUpdate;
        const speed =
          timeDiff > 0.1 ? bytesDiff / timeDiff : currentState.speed || 0;
        const percentage =
          totalBytes > 0
            ? Math.min(100, (bytesUploaded / totalBytes) * 100)
            : 0;
        const remainingBytes = totalBytes - bytesUploaded;
        const eta = speed > 0 ? remainingBytes / speed : 0;

        // Update progress immediately
        setUploadProgress((progressPrev) => ({
          ...progressPrev,
          [fileId]: {
            bytesUploaded,
            totalBytes,
            percentage: Math.round(percentage),
            chunksCompleted: completedChunks,
            totalChunks,
            speed,
            eta,
            status: percentage >= 100 ? "completed" : "uploading",
          },
        }));

        return {
          ...prev,
          [fileId]: {
            ...currentState,
            lastUpdate: now,
            bytesAtLastUpdate: bytesUploaded,
            speed: speed, // Store speed in chunk state
          },
        };
      });
    },
    []
  );

  // Debounced progress update - removed debounce for immediate updates
  const updateProgress = updateProgressWithSpeed;

  // API calls (same as original)
  const startMultipartUpload = async (
    fileName: string,
    fileType: string,
    fileSize: number
  ) => {
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
      return data.data as { upload_id: string; file_key: string };
    } catch (error) {
      console.error("Start multipart upload error:", error);
      throw error;
    }
  };

  const getPresignedUrls = async (
    fileKey: string,
    uploadId: string,
    parts: number
  ) => {
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
      return data.data.upload_urls as string[];
    } catch (error) {
      console.error("Get presigned URLs error:", error);
      throw error;
    }
  };

  const completeMultipartUpload = async (
    fileKey: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[]
  ) => {
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
      return data.data as {
        download_urls: string[];
        doc_paths: string[];
        converted_download_urls: string[];
      };
    } catch (error) {
      console.error("Complete multipart upload error:", error);
      throw error;
    }
  };

  // Enhanced chunk upload with better progress tracking
  const uploadChunk = async (
    presignedUrl: string,
    chunk: Blob,
    partNumber: number,
    fileId: string,
    totalChunks: number,
    totalFileSize: number,
    signal: AbortSignal
  ): Promise<{ etag: string; partNumber: number }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && !pausedUploadsRef.current.has(fileId)) {
          // Calculate bytes uploaded for this specific chunk
          const chunkBytesUploaded = event.loaded;

          // Get current completed chunks to calculate total progress
          const currentState = chunkStates[fileId];
          if (currentState) {
            // Calculate total bytes: (completed chunks * chunk size) + current chunk progress
            const completedChunkBytes =
              currentState.completedChunks.size * CHUNK_SIZE;
            const totalBytesUploaded = completedChunkBytes + chunkBytesUploaded;

            // Don't exceed file size
            const adjustedBytesUploaded = Math.min(
              totalBytesUploaded,
              totalFileSize
            );

            console.log(
              `Progress - File: ${fileId}, Part: ${partNumber}, ChunkProgress: ${chunkBytesUploaded}/${chunk.size}, TotalProgress: ${adjustedBytesUploaded}/${totalFileSize}`
            );

            updateProgress(
              fileId,
              currentState.completedChunks.size,
              totalChunks,
              adjustedBytesUploaded,
              totalFileSize
            );
          }
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const etag = xhr.getResponseHeader("ETag");
          if (etag) {
            console.log(
              `Chunk completed - File: ${fileId}, Part: ${partNumber}`
            );

            // Mark chunk as completed and update progress
            setChunkStates((prev) => {
              const currentState = prev[fileId];
              if (currentState) {
                const newCompletedChunks = new Set(
                  currentState.completedChunks
                );
                newCompletedChunks.add(partNumber);

                // Calculate total bytes with completed chunk
                const totalBytesUploaded = Math.min(
                  newCompletedChunks.size * CHUNK_SIZE,
                  totalFileSize
                );

                // Immediate progress update for completed chunk
                setTimeout(() => {
                  updateProgress(
                    fileId,
                    newCompletedChunks.size,
                    totalChunks,
                    totalBytesUploaded,
                    totalFileSize
                  );
                }, 0);

                return {
                  ...prev,
                  [fileId]: {
                    ...currentState,
                    completedChunks: newCompletedChunks,
                  },
                };
              }
              return prev;
            });

            resolve({ etag: etag.replace(/"/g, ""), partNumber });
          } else {
            reject(new Error("ETag header is missing"));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.addEventListener("abort", () =>
        reject(new Error("Upload cancelled"))
      );

      signal.addEventListener("abort", () => xhr.abort());

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send(chunk);
    });
  };

  // Enhanced upload function with pause/resume capability
  const uploadFile = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    const controller = new AbortController();
    abortControllersRef.current[fileId] = controller;

    try {
      // Initialize progress tracking
      const { totalChunks } = calculateChunks(file.size);
      const now = Date.now();

      setChunkStates((prev) => ({
        ...prev,
        [fileId]: {
          completedChunks: new Set(),
          startTime: now,
          lastUpdate: now,
          bytesAtLastUpdate: 0,
          speed: 0,
        },
      }));

      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: {
          bytesUploaded: 0,
          totalBytes: file.size,
          percentage: 0,
          chunksCompleted: 0,
          totalChunks,
          speed: 0,
          eta: 0,
          status: "uploading",
        },
      }));

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

      const uploadPromises: Promise<{ etag: string; partNumber: number }>[] =
        [];

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const partNumber = i + 1;

        uploadPromises.push(
          uploadChunk(
            presignedUrls[i],
            chunk,
            partNumber,
            fileId,
            totalChunks,
            file.size,
            controller.signal
          )
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

      // Final progress update
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          bytesUploaded: file.size,
          percentage: 100,
          status: "completed",
        },
      }));

      const uploadedFileData: UploadedFile = {
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
    } catch (error: any) {
      const status = error.name === "AbortError" ? "cancelled" : "error";
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          status,
        },
      }));

      if (status === "error") {
        let errorMessage = "Upload failed";
        if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed - Please check your API credentials";
        } else if (error.message.includes("403")) {
          errorMessage = "Access denied - Please check your permissions";
        } else if (error.message.includes("404")) {
          errorMessage = "API endpoint not found";
        }
        console.error(`${errorMessage}: ${error.message}`);
      }
    } finally {
      delete abortControllersRef.current[fileId];
      pausedUploadsRef.current.delete(fileId);
    }
  };

  // Handle file selection with chunk calculation
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const newFiles: SelectedFile[] = files.map((file) => {
      const { totalChunks } = calculateChunks(file.size);
      return {
        id: `${file.name}-${Date.now()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        chunks: totalChunks,
        uploadedChunks: 0,
      };
    });
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  // Pause/Resume functionality
  const pauseUpload = (fileId: string) => {
    pausedUploadsRef.current.add(fileId);
    abortControllersRef.current[fileId]?.abort();
    setUploadProgress((prev) => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        status: "paused",
      },
    }));
  };

  const resumeUpload = (fileId: string) => {
    pausedUploadsRef.current.delete(fileId);
    const fileData = selectedFiles.find((f) => f.id === fileId);
    if (fileData) {
      uploadFile(fileData.file);
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    abortControllersRef.current[fileId]?.abort();
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    setChunkStates((prev) => {
      const newStates = { ...prev };
      delete newStates[fileId];
      return newStates;
    });
    pausedUploadsRef.current.delete(fileId);
  };

  // Upload all files
  const uploadAllFiles = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    try {
      const uploadPromises = selectedFiles
        .filter(
          (fileData) =>
            !uploadProgress[fileData.id] ||
            uploadProgress[fileData.id].status === "idle"
        )
        .map((fileData) => uploadFile(fileData.file));

      await Promise.all(uploadPromises);
    } finally {
      setIsUploading(false);
    }
  };

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    return `${formatFileSize(bytesPerSecond)}/s`;
  };

  const formatTime = (seconds: number): string => {
    if (seconds === Infinity || seconds === 0) return "∞";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600)
      return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.round(seconds / 3600)}h ${Math.round(
      (seconds % 3600) / 60
    )}m`;
  };

  // Enhanced status icon
  const getStatusIcon = (fileId: string) => {
    const progress = uploadProgress[fileId];
    if (!progress) return <File className="w-5 h-5 text-gray-500" />;

    switch (progress.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "uploading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "paused":
        return <Pause className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <X className="w-5 h-5 text-gray-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Handle file download and preview (same as original)
  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (file: UploadedFile) => {
    const url = file.downloadUrls[0] || file.convertedDownloadUrls[0];
    if (!url) return;
    setPreviewFile({ url, type: file.type, name: file.name });
  };

  const isPreviewable = (fileType: string): boolean => {
    return ["application/pdf", "image/jpeg", "image/png", "image/gif"].includes(
      fileType
    );
  };

  const renderPreview = () => {
    if (!previewFile) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <File className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Preview Selected</p>
          <p className="text-sm">Click preview on an uploaded file</p>
        </div>
      );
    }

    if (!isPreviewable(previewFile.type)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <AlertCircle className="w-16 h-16 mb-4 text-orange-400" />
          <p className="text-lg font-medium">Preview Not Available</p>
          <p className="text-sm">This file type cannot be previewed</p>
        </div>
      );
    }

    return previewFile.type === "application/pdf" ? (
      <iframe
        src={previewFile.url}
        className="w-full h-full rounded-lg border-2 border-gray-200"
        title={previewFile.name}
      />
    ) : (
      <img
        src={previewFile.url}
        alt={previewFile.name}
        className="w-full h-auto max-h-full object-contain rounded-lg border-2 border-gray-200"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-xl font-medium text-gray-900 mb-2">
              Enhanced File Upload
            </h1>
            <p className="text-gray-600">
              Upload files with real-time progress tracking and advanced
              controls
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
                <h3 className="text-base font-normal mb-4">Upload Files</h3>
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
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={isUploading}
                >
                  <Upload className="w-5 h-5" />
                  Select Files
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-normal text-gray-900">
                      Selected Files ({selectedFiles.length})
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedFiles.map((fileData) => {
                      const progress = uploadProgress[fileData.id];
                      return (
                        <div
                          key={fileData.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(fileData.id)}
                              <div>
                                <p className="font-medium text-gray-900 truncate max-w-48">
                                  {fileData.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(fileData.size)} •{" "}
                                  {fileData.chunks} chunks
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {progress?.status === "uploading" && (
                                <button
                                  onClick={() => pauseUpload(fileData.id)}
                                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                  title="Pause Upload"
                                >
                                  <Pause className="w-4 h-4" />
                                </button>
                              )}

                              {progress?.status === "paused" && (
                                <button
                                  onClick={() => resumeUpload(fileData.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Resume Upload"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => removeFile(fileData.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                disabled={progress?.status === "uploading"}
                                title="Remove File"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {Object.keys(uploadProgress).length > 0 && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Overall Progress</span>
                                <span>
                                  {Math.round(
                                    Object.values(uploadProgress).reduce(
                                      (acc, p) => acc + p.percentage,
                                      0
                                    ) / Object.keys(uploadProgress).length || 0
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.round(
                                      Object.values(uploadProgress).reduce(
                                        (acc, p) => acc + p.percentage,
                                        0
                                      ) / Object.keys(uploadProgress).length ||
                                        0
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {progress && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {progress.chunksCompleted}/
                                  {progress.totalChunks} chunks
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {progress.percentage}%
                                </span>
                              </div>

                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 rounded-full ${
                                    progress.status === "completed"
                                      ? "bg-green-500"
                                      : progress.status === "error"
                                      ? "bg-red-500"
                                      : progress.status === "paused"
                                      ? "bg-yellow-500"
                                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                                  }`}
                                  style={{ width: `${progress.percentage}%` }}
                                />
                              </div>

                              {progress.status === "uploading" && (
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>
                                    {formatFileSize(progress.bytesUploaded)} /{" "}
                                    {formatFileSize(progress.totalBytes)}
                                  </span>
                                  <span>
                                    {formatSpeed(progress.speed)} • ETA:{" "}
                                    {formatTime(progress.eta)}
                                  </span>
                                </div>
                              )}

                              {progress.status === "completed" && (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                  <CheckCircle className="w-4 h-4" />
                                  Upload Complete
                                </div>
                              )}

                              {progress.status === "error" && (
                                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                  Upload failed - Please try again
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={uploadAllFiles}
                      disabled={isUploading || selectedFiles.length === 0}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-normal text-base"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Upload All
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        Object.keys(abortControllersRef.current).forEach(
                          (fileId) => {
                            abortControllersRef.current[fileId]?.abort();
                          }
                        );
                        setSelectedFiles([]);
                        setUploadProgress({});
                        setChunkStates({});
                        pausedUploadsRef.current.clear();
                      }}
                      disabled={isUploading}
                      className="px-6 py-3 border-2 text-base border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 font-normal"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {selectedFiles.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    No files selected
                  </p>
                  <p className="text-sm text-gray-500">
                    Choose files to start uploading
                  </p>
                </div>
              )}
            </div>

            {/* Middle Column - Uploaded Files */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl text-white">
                <h3 className="text-base font-normal mb-2">Uploaded Files</h3>
                <p className="text-emerald-100">
                  Successfully uploaded: {uploadedFiles.length}
                </p>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    No uploads yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed uploads will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 truncate max-w-48">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatFileSize(file.size)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Uploaded:{" "}
                              {new Date(file.uploadedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {file.downloadUrls.length > 0 && (
                          <button
                            onClick={() =>
                              handleDownload(file.downloadUrls[0], file.name)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}

                        {isPreviewable(file.type) && (
                          <button
                            onClick={() => handlePreview(file)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                        )}

                        {file.convertedDownloadUrls &&
                          file.convertedDownloadUrls.length > 0 && (
                            <button
                              onClick={() =>
                                handlePreview({
                                  ...file,
                                  downloadUrls: file.convertedDownloadUrls,
                                })
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors font-medium"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Converted
                            </button>
                          )}
                      </div>

                      {file.docPaths && file.docPaths.length > 0 && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            File Path:
                          </p>
                          <p className="text-xs text-gray-700 font-mono break-all">
                            {file.docPaths[0]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Preview Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
                <h3 className="text-base font-normal mb-2">File Preview</h3>
                <p className="text-purple-100">Click preview to view files</p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 h-[calc(100vh-300px)] overflow-hidden">
                {renderPreview()}
              </div>

              {previewFile && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 truncate">
                        {previewFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {previewFile.type}
                      </p>
                    </div>
                    <button
                      onClick={() => setPreviewFile(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Global Upload Statistics */}
          {(selectedFiles.length > 0 || uploadedFiles.length > 0) && (
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {selectedFiles.length}
                  </div>
                  <div className="text-sm text-gray-600">Selected Files</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {uploadedFiles.length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">
                    {
                      Object.values(uploadProgress).filter(
                        (p) => p.status === "uploading"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">
                    {
                      Object.values(uploadProgress).filter(
                        (p) => p.status === "error"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMultipartUpload;
