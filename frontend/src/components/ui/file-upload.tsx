import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, Video, FileImage, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
// import React = require("react");

interface FileItem {
  id: string;
  file: File;
  url?: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  progress?: number;
  error?: string;
}

interface FileUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
  folder?: string;
}

export default function FileUpload({ 
  value = [], 
  onChange, 
  maxFiles = 10,
  acceptedTypes = ['image/*', 'video/*'],
  className,
  folder = 'general'
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with existing URLs from parent
    const initialFiles = value.map(url => ({
      id: url,
      file: new File([], url.split('/').pop() || 'file'),
      url,
      status: 'uploaded' as const
    }));
    setFiles(initialFiles);
  }, [value]);

  const uploadToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    const fileItem: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0
    };

    setFiles(prev => {
      const updated = [...prev, fileItem];
      updateParent(updated);
      return updated;
    });

    try {
      const res = await axios.post(`http://localhost:3001/api/upload-media?folder=${encodeURIComponent(folder)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setFiles(prev =>
            prev.map(f => 
              f.id === fileItem.id ? { ...f, progress } : f
            )
          );
        }
      });

      const url = res.data.uploaded[0];
      setFiles(prev =>
        prev.map(f => 
          f.id === fileItem.id ? { ...f, url, status: 'uploaded' } : f
        )
      );
      updateParent([...files, { ...fileItem, url, status: 'uploaded' }]);
      return url;
    } catch (error) {
      setFiles(prev =>
        prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error', error: 'Upload failed' } : f
        )
      );
      throw error;
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);
    
    for (const file of newFiles) {
      await uploadToS3(file);
    }
  };

  const updateParent = (currentFiles: FileItem[]) => {
    const urls = currentFiles
      .filter(f => f.status === 'uploaded')
      .map(f => f.url)
      .filter((url): url is string => !!url);
      
    onChange?.(urls);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      updateParent(updated);
      return updated;
    });
  };

  // Keep existing drag-and-drop and UI code, but update the rendering part:
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };


  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area - Keep existing structure */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={files.length < maxFiles ? openFileDialog : undefined}
      >
        <CardContent className="p-8 text-center">
          <Upload className="h-10 w-10 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Upload Images & Videos
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
            <Badge variant="outline">Max {maxFiles} files</Badge>
            <Badge variant="outline">Images & Videos</Badge>
            <Badge variant="outline">Max 50MB each</Badge>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Updated File Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((fileItem) => (
            <Card key={fileItem.id} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                  {fileItem.status === 'uploading' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                      <span className="text-xs">{fileItem.progress}%</span>
                    </div>
                  ) : fileItem.url ? (
                    <>
                      {fileItem.file.type.startsWith('image/') ? (
                        <img
                          src={fileItem.url}
                          alt={fileItem.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-red-500">
                      Upload Failed
                    </div>
                  )}

                  {/* Remove button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileItem.id);
                    }}
                    disabled={fileItem.status === 'uploading'}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* Status indicator */}
                  <Badge
                    variant="secondary"
                    className="absolute bottom-1 left-1 text-xs"
                  >
                    {fileItem.status === 'uploading' && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    {fileItem.status === 'uploaded' && (
                      fileItem.file.type.startsWith('image/') ? (
                        <Image className="h-3 w-3 mr-1" />
                      ) : (
                        <Video className="h-3 w-3 mr-1" />
                      )
                    )}
                    {fileItem.status === 'error' && 'Error'}
                  </Badge>
                </div>
                
                <div className="mt-2">
                  <p className="text-xs font-medium text-slate-900 truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {fileItem.status === 'uploaded' ? 
                      'Uploaded' : 
                      fileItem.error || 'Uploading...'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}