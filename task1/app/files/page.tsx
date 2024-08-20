"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/Toast";

export default function FilesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

//   const { toast } = useToast();

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setFile(e.target.files[0]);
    setExtractedText('');
  }
};

  const handleExtractText = async () => {
    if (!file) {

        console.error("No File Selected!");
    //   toast({
    //     title: "Error",
    //     description: "Please select a file first.",
    //     variant: "destructive",
    //   });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3002/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});
        console.log("Response: ", response.data);

      setExtractedText(response.data.extractedText); // Set the extracted text
    //   toast({
    //     title: "Success",
    //     description: "Text extracted successfully.",
    //   });
    } catch (error) {
      console.error('Error extracting text:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>File Text Extraction</h1>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        // style={{ display: 'none' }}
      />
      <Button onClick={() => fileInputRef.current?.click()}>
        Select File
      </Button>
      <br />
      <br />
      <br />
      <Button onClick={handleExtractText} disabled={!file || isLoading}>
        {isLoading ? 'Extracting...' : 'Extract Text'}
      </Button>
      {extractedText && (
        <div>
          <h2>Extracted Text:</h2>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
}
