"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { TrainingMaterial } from "@/types";
import { CheckCircle, FileText, Trash2, UploadCloud, XCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';

interface FileWithProgress extends File {
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  id: string;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploadedMaterials, setUploadedMaterials] = useState<TrainingMaterial[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFilesWithProgress = acceptedFiles.map(file => Object.assign(file, {
      progress: 0,
      status: 'uploading' as const,
      id: Math.random().toString(36).substring(7)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFilesWithProgress]);

    newFilesWithProgress.forEach(file => {
      // Simulate upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress } : f));
        } else {
          clearInterval(interval);
          const isSuccess = Math.random() > 0.2; // 80% success rate
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: isSuccess ? 'completed' : 'failed' } : f));
          if (isSuccess) {
            setUploadedMaterials(prev => [...prev, {
              id: file.id,
              name: file.name,
              type: file.type,
              uploadedAt: new Date(),
              status: 'processed'
            }]);
            toast({ title: "Upload Successful", description: `${file.name} uploaded.` });
          } else {
            toast({ title: "Upload Failed", description: `${file.name} could not be uploaded.`, variant: "destructive" });
          }
        }
      }, 200);
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'video/mp4': ['.mp4'],
    }
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const removeUploadedMaterial = (materialId: string) => {
    setUploadedMaterials(prev => prev.filter(m => m.id !== materialId));
    toast({ title: "Material Removed", description: `Material has been removed.` });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <UploadCloud className="h-7 w-7 text-primary" /> Upload Training Materials
          </CardTitle>
          <CardDescription>
            Drag and drop files here or click to select files. Supported formats: PDF, DOCX, TXT, MP4.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              <UploadCloud className={`h-12 w-12 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              {isDragActive ? (
                <p className="text-lg font-semibold text-primary">Drop the files here ...</p>
              ) : (
                <p className="text-lg text-muted-foreground">Drag 'n' drop some files here, or click to select files</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">Max file size: 50MB</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Upload Queue</h3>
              <ScrollArea className="h-[200px] pr-3">
                {files.map((fileWrapper) => (
                  <div key={fileWrapper.id} className="p-3 mb-2 border rounded-md bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium truncate" title={fileWrapper.name}>{fileWrapper.name}</p>
                        <p className="text-xs text-muted-foreground">{(fileWrapper.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="w-1/3 min-w-[150px] flex items-center gap-2 ml-4">
                      {fileWrapper.status === 'uploading' && (
                        <Progress value={fileWrapper.progress} className="h-2 flex-grow" />
                      )}
                      {fileWrapper.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {fileWrapper.status === 'failed' && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                       <Button variant="ghost" size="icon" onClick={() => removeFile(fileWrapper.id)} className="h-7 w-7">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Uploaded Materials</CardTitle>
          <CardDescription>Manage previously uploaded training documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedMaterials.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No materials uploaded yet.</p>
          ) : (
          <ScrollArea className="max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" /> {material.name}
                    </TableCell>
                    <TableCell>{material.type}</TableCell>
                    <TableCell>{material.uploadedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                       <span className={`px-2 py-1 text-xs rounded-full ${
                        material.status === 'processed' ? 'bg-green-100 text-green-700' : 
                        material.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                       }`}>
                         {material.status}
                       </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeUploadedMaterial(material.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
