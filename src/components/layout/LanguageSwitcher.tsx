"use client";

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // In a real app, this would integrate with an i18n library
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // Logic to change app language
    console.log(`Language changed to: ${lang}`);
  };

  return (
    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto h-10 bg-transparent border-0 shadow-none text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0 gap-1 px-2">
        <Languages className="h-5 w-5" />
        <span className="hidden md:inline"><SelectValue /></span>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        {/* Add more languages as needed */}
      </SelectContent>
    </Select>
  );
}
