import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    if (validFile) {
      onFileSelect(validFile);
      toast({
        title: "File uploaded successfully",
        description: `${validFile.name} is ready for analysis.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis.`,
      });
    }
  }, [onFileSelect]);

  return (
    <Card className="p-12 border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/50 transition-all duration-300">
      <div
        className={`text-center space-y-6 transition-all duration-300 ${
          isDragOver ? 'scale-105 opacity-80' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center shadow-lg">
          <Upload className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">
            Upload Contract Document
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Drag and drop your PDF or DOCX contract here, or click to browse files.
            Our AI will analyze it for risks and provide summaries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <label htmlFor="file-upload">
            <Button variant="hero" size="lg" className="cursor-pointer">
              <FileText className="w-5 h-5" />
              Choose File
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Supports PDF and DOCX files up to 10MB</span>
        </div>
      </div>
    </Card>
  );
};