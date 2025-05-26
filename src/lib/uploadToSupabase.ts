'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useToast } from '@/components/ui/use-toast'; // Assuming you have a toast component
import { uploadFileToSupabase } from '@/lib/uploadToSupabase'; // Import your upload function

// Define a type for files with progress (optional, but good for tracking)
interface FileWithProgress extends File {
  progress?: number; // Add a progress property
}

export default function FileUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Convert FileList to an array and add progress property
      const filesArray: FileWithProgress[] = Array.from(event.target.files).map(file => ({
        ...file,
        progress: 0,
      }));
      setSelectedFiles(filesArray);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select files to upload.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    for (const file of selectedFiles) {
      try {
        // Determine file type (you might need a more robust check)
        const fileType = file.type.startsWith('video/') ? 'video' : 'document';

        // Call the upload function
        const result = await uploadFileToSupabase(file, fileType);

        // Handle successful upload (e.g., show a success message, update a list of uploaded files)
        console.log('Upload successful:', result);
        toast({
          title: 'Upload successful',
          description: `File "${file.name}" uploaded successfully.`,
        });

        // You might want to add the uploaded file to a list of successfully uploaded files
        // setUploadedMaterials(prev => [...prev, { name: result.name, url: result.url, type: result.type }]);

      } catch (error: any) {
        console.error('Upload failed:', error);
        toast({
          title: 'Upload failed',
          description: `Failed to upload file "${file.name}". ${error.message}`,
          variant: 'destructive',
        });
      }
    }

    setUploading(false);
    setSelectedFiles([]); // Clear selected files after upload
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Upload Training Materials</h1>
      <form onSubmit={handleUpload}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="files" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Select files
          </label>
          <input
            id="files"
            type="file"
            multiple // Allow multiple file selection
            onChange={handleFileChange}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-500 file:border-0 file:bg-transparent file:text-gray-900 file:text-sm file:font-medium file:cursor-pointer"
            disabled={uploading}
          />
        </div>
        <div className="mt-4">
          {selectedFiles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
          disabled={uploading || selectedFiles.length === 0}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </form>
      {/* You can add a section here to display previously uploaded files */}
      {/* <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Uploaded Materials</h2>
        // Render your list of uploaded materials here
      </div> */}
    </div>
  );
}
