"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShieldCheck className="h-7 w-7 text-primary" /> GDPR & Data Compliance
          </CardTitle>
          <CardDescription>
            Information regarding our commitment to data privacy and compliance with GDPR regulations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-sm dark:prose-invert max-w-none">
          <p>
            At NubbiAI, we are committed to protecting your personal data and respecting your privacy. 
            This page provides an overview of how we comply with the General Data Protection Regulation (GDPR) 
            and other relevant data protection laws.
          </p>

          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mt-0">
              <FileText className="h-5 w-5 text-primary" /> Key Principles
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Lawfulness, Fairness, and Transparency:</strong> We process personal data lawfully, fairly, and in a transparent manner.</li>
              <li><strong>Purpose Limitation:</strong> Data is collected for specified, explicit, and legitimate purposes.</li>
              <li><strong>Data Minimization:</strong> We only collect and process data that is adequate, relevant, and limited to what is necessary.</li>
              <li><strong>Accuracy:</strong> We take reasonable steps to ensure personal data is accurate and kept up to date.</li>
              <li><strong>Storage Limitation:</strong> Data is kept in a form which permits identification of data subjects for no longer than is necessary.</li>
              <li><strong>Integrity and Confidentiality:</strong> We ensure appropriate security of personal data, including protection against unauthorized or unlawful processing and against accidental loss, destruction, or damage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Your Rights
            </h2>
            <p>
              Under GDPR, you have several rights regarding your personal data, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The right to access your personal data.</li>
              <li>The right to rectification of inaccurate data.</li>
              <li>The right to erasure (right to be forgotten).</li>
              <li>The right to restrict processing.</li>
              <li>The right to data portability.</li>
              <li>The right to object to processing.</li>
              <li>Rights in relation to automated decision making and profiling.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact our Data Protection Officer at <a href="mailto:dpo@nubbiai.example.com" className="text-accent hover:underline">dpo@nubbiai.example.com</a>.
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground">
              For more detailed information, please review our full <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> and <Link href="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link>.
            </p>
             <Button variant="outline">Download Data Protection Summary</Button>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
