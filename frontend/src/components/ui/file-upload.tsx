import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, Video, FileImage, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Initialize with existing URLs from parent
  useEffect(() => {
    if (value && value.length > 0) {
      const initialFiles = value.map((url, index) => ({
        id: `existing-${index}`,
        file: new File([], url.split('/').pop() || 'file'),
        url,
        status: 'uploaded' as const
      }));
      setFiles(initialFiles);
    }
  }, [value]);

  const updateParent = (currentFiles: FileItem[]) => {
    const urls = currentFiles
      .filter(f => f.status === 'uploaded')
      .map(f => f.url)
      .filter((url): url is string => !!url);
    
    onChange?.(urls);
  };

  // Updated function to handle multiple files upload
  const uploadMultipleFiles = async (fileList: File[]) => {
    const formData = new FormData();
    
    // Append all files to the same FormData
    fileList.forEach(file => {
      formData.append("files", file);
    });

    // Create file items for tracking
    const newFileItems: FileItem[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0
    }));

    // Add all new files to state immediately
    setFiles(prev => [...prev, ...newFileItems]);

    try {
      const response = await axios.post(
        `http://localhost:3001/api/upload-media?folder=${encodeURIComponent(folder)}`, 
        formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            
            // Update progress for all uploading files
            setFiles(prev =>
              prev.map(f => 
                newFileItems.some(newItem => newItem.id === f.id) && f.status === 'uploading'
                  ? { ...f, progress }
                  : f
              )
            );
          }
        }
      );

      // Get all uploaded URLs from response
      const uploadedUrls = response.data.uploaded || [];
      
      if (uploadedUrls.length !== newFileItems.length) {
        console.warn(`Expected ${newFileItems.length} URLs, got ${uploadedUrls.length}`);
      }

      // Update file items with their respective URLs
      setFiles(prev => {
        const updatedFiles = prev.map(f => {
          const itemIndex = newFileItems.findIndex(newItem => newItem.id === f.id);
          if (itemIndex !== -1 && uploadedUrls[itemIndex]) {
            return {
              ...f,
              url: uploadedUrls[itemIndex],
              status: 'uploaded' as const,
              progress: 100
            };
          }
          return f;
        });
        
        // Update parent with all uploaded files
        updateParent(updatedFiles);
        return updatedFiles;
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      // Mark all files as error
      setFiles(prev => {
        const updatedFiles = prev.map(f => 
          newFileItems.some(newItem => newItem.id === f.id)
            ? { 
                ...f, 
                status: 'error' as const, 
                error: 'Upload failed',
                progress: 0
              }
            : f
        );
        updateParent(updatedFiles);
        return updatedFiles;
      });
      
      throw error;
    }
  };

  const handleFiles = async (fileList: FileList) => {
    if (files.length >= maxFiles) {
      console.warn(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);
    
    if (newFiles.length === 0) return;

    // Validate file types
    const invalidFiles = newFiles.filter(file => 
      !acceptedTypes.some(type => 
        type === '*/*' || 
        file.type.match(type.replace('*', '.*'))
      )
    );

    if (invalidFiles.length > 0) {
      console.warn('Some files have invalid types:', invalidFiles.map(f => f.name));
      return;
    }

    try {
      await uploadMultipleFiles(newFiles);
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== id);
      updateParent(updatedFiles);
      return updatedFiles;
    });
  };

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

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-3 w-3 mr-1" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-3 w-3 mr-1" />;
    }
    return <FileImage className="h-3 w-3 mr-1" />;
  };

  const renderPreview = (fileItem: FileItem) => {
    if (fileItem.status === 'uploading') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <span className="text-xs">{fileItem.progress || 0}%</span>
        </div>
      );
    }

    if (fileItem.status === 'error') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
          <X className="h-8 w-8 mb-1" />
          <span className="text-xs">Failed</span>
        </div>
      );
    }

    if (fileItem.url) {
      if (fileItem.file.type.startsWith('image/')) {
        return (
          <img
            src={fileItem.url}
            alt={fileItem.file.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23ccc"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10">Image</text></svg>';
            }}
          />
        );
      } else if (fileItem.file.type.startsWith('video/')) {
        return (
          <video
            src={fileItem.url}
            className="w-full h-full object-cover"
            controls={false}
            muted
            onLoadedData={(e) => {
              // Create a thumbnail by drawing first frame to canvas
              const video = e.target as HTMLVideoElement;
              video.currentTime = 1;
            }}
          />
        );
      }
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <FileImage className="h-8 w-8 text-slate-400" />
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
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

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((fileItem) => (
            <Card key={fileItem.id} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                  {renderPreview(fileItem)}

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

                  <Badge
                    variant={fileItem.status === 'error' ? 'destructive' : 'secondary'}
                    className="absolute bottom-1 left-1 text-xs"
                  >
                    {fileItem.status === 'uploading' && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    {fileItem.status === 'uploaded' && getFileTypeIcon(fileItem.file)}
                    {fileItem.status === 'error' && <X className="h-3 w-3 mr-1" />}
                    {fileItem.status === 'error' ? 'Error' : 
                     fileItem.status === 'uploading' ? 'Uploading' : 'Uploaded'}
                  </Badge>
                </div>
                
                <div className="mt-2">
                  <p className="text-xs font-medium text-slate-900 truncate" title={fileItem.file.name}>
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {fileItem.status === 'uploaded' ? 'Ready' : 
                     fileItem.status === 'uploading' ? `${fileItem.progress || 0}%` :
                     fileItem.error || 'Processing...'}
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