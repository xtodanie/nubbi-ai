"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockDocuments = [
  { id: 'doc1', name: 'Employee Handbook 2024.pdf', type: 'pdf', size: '2.5MB', date: '2024-07-01' },
  { id: 'doc2', name: 'IT Security Policy.docx', type: 'docx', size: '512KB', date: '2024-06-15' },
  { id: 'doc3', name: 'Benefits Overview.pdf', type: 'pdf', size: '1.2MB', date: '2024-05-20' },
  { id: 'doc4', name: 'Onboarding Checklist.txt', type: 'txt', size: '10KB', date: '2024-07-10' },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-7 w-7 text-primary" /> My Documents
          </CardTitle>
          <CardDescription>
            Access important company documents, handbooks, and policies relevant to your role and onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-2">
            <Input placeholder="Search documents..." className="flex-1 h-10"/>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Search className="h-5 w-5"/>
            </Button>
          </div>
          {mockDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDocuments.map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="h-10 w-10 text-primary flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold truncate text-sm" title={doc.name}>{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size} - {doc.type.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">Uploaded: {doc.date}</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
               <Image 
                src="https://placehold.co/400x300.png" 
                alt="No Documents" 
                width={300} 
                height={225} 
                className="mx-auto rounded-lg shadow-sm mb-4"
                data-ai-hint="empty folder"
              />
              <p className="text-lg text-muted-foreground">No documents available at the moment.</p>
              <p className="text-sm text-muted-foreground">Please check back later or contact your HR representative.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
