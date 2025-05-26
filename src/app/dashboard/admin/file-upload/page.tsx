'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast"; // Correct import path for your hook
import type { TrainingMaterial } from "@/types";
import { CheckCircle, FileText, Trash2, UploadCloud, XCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import uploadFileToSupabase from '@/lib/uploadToSupabase';

interface FileWithProgress extends File {
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  id: string;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'media'>('documents');
  const [uploadedMaterials, setUploadedMaterials] = useState<TrainingMaterial[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFilesWithProgress = acceptedFiles.map(file => Object.assign(file, {
      progress: 0,
      status: 'uploading' as const,
      id: Math.random().toString(36).substring(7)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFilesWithProgress]);

    newFilesWithProgress.forEach(async (file) => { // Added async here
      const fileId = file.id; // Store the file ID

      try {
        // Determine file type (you might need a more robust check)
        const fileType = file.type.startsWith('video/') ? 'media' : 'document';

        // Call the actual Supabase upload function
        const result = await uploadFileToSupabase(file, fileType);

        // Update file status to completed
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f));

        // Add to uploaded materials list
        setUploadedMaterials(prev => [...prev, {
          id: fileId, // Use the same ID
          name: result.name,
          type: result.type,
          uploadedAt: new Date(),
          status: 'processed' // Assuming 'processed' is the status after successful upload
        }]);

        toast({ title: "Upload Successful", description: `File "${file.name}" uploaded successfully.` });

      } catch (error: any) {
        console.error('Upload failed:', error);
        // Update file status to failed
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 0, status: 'failed' } : f)); // Set progress to 0 for failed

        toast({
          title: "Upload Failed",
          description: `Failed to upload file "${file.name}". ${error.message}`,
          variant: "destructive",
        });
      }
      // You might want to update progress here if your uploadFileToSupabase function supports it
      // (e.g., by emitting progress events or returning a promise that resolves with progress updates)
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      // Removed .docx as per original blueprint supported formats
      // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'documents' | 'media')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">Upload Documents</TabsTrigger>
              <TabsTrigger value="media">Upload Media</TabsTrigger>
            </TabsList>
            <TabsContent value="documents">
              <div
                {...getRootProps()}
                className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors mt-4
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                  <UploadCloud className={`h-12 w-12 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {isDragActive ? (
                    <p className="text-lg font-semibold text-primary">Drop the document files here ...</p>
                  ) : (
                    <p className="text-lg text-muted-foreground">Drag 'n' drop document files here, or click to select files</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">Supported formats: PDF, TXT. Max file size: 50MB</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="media">
              <div
                 {...getRootProps()}
                 className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors mt-4
                 ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}`}
              >
                <input {...getInputProps()} />
                 <div className="flex flex-col items-center justify-center text-center">
                   <UploadCloud className={`h-12 w-12 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                   {isDragActive ? (
                     <p className="text-lg font-semibold text-primary">Drop the media files here ...</p>
                   ) : (
                     <p className="text-lg text-muted-foreground">Drag 'n' drop media files here, or click to select files</p>
                   )}
                   <p className="text-sm text-muted-foreground mt-1">Supported formats: MP4. Max file size: 50MB</p>
                 </div>
               </div>
            </TabsContent>
          </Tabs>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Upload Queue</h3>
              <ScrollArea className="h-[200px] pr-3">
                {files.map((file) => (
                  <div key={file.id} className="p-3 mb-2 border rounded-md bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-6 w-6 text-primary flex-shrink-0" /> {/* Consider dynamic icon based on file type */}
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="w-1/3 min-w-[150px] flex items-center gap-2 ml-4">
                      {/* Progress bar is still relevant for visual feedback during real upload */}
                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="h-2 flex-grow" />
                      )}
                      {file.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === 'failed' && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      {/* Remove file from queue if not uploading */}
                      {file.status !== 'uploading' && (
                        <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="h-7 w-7">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
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
