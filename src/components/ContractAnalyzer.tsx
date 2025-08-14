import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import { contractAPI, AnalysisResponse } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface ContractAnalyzerProps {
  contractId: string;
  fileName: string;
  onComplete: (analysis: AnalysisResponse) => void;
  onBack: () => void;
}

export const ContractAnalyzer = ({ contractId, fileName, onComplete, onBack }: ContractAnalyzerProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Extracting text...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    'Extracting text from document...',
    'Classifying contract clauses...',
    'Detecting risky patterns...',
    'Generating AI summary...',
    'Calculating risk score...',
    'Finalizing analysis...'
  ];

  useEffect(() => {
    startAnalysis();
  }, [contractId]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate progress updates
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setProgress((i + 1) * (100 / steps.length));
        
        // Add delay to show progress (remove in production for faster analysis)
        if (i < steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Perform actual analysis
      const analysis = await contractAPI.analyzeContract(contractId);
      
      toast({
        title: "Analysis Complete",
        description: "Your contract has been analyzed successfully.",
      });
      
      onComplete(analysis);
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Analyzing Contract</h2>
              <p className="text-muted-foreground">
                Our AI is examining your contract for risks and generating insights
              </p>
            </div>
          </div>

          {/* File Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{fileName}</p>
              <p className="text-sm text-muted-foreground">Contract ID: {contractId}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Analysis Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            
            <Progress value={progress} className="h-3" />
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isAnalyzing ? (
                <Brain className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span>{currentStep}</span>
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Analysis Steps:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: FileText, label: "Text Extraction", desc: "Extract content from PDF/DOCX" },
                { icon: Brain, label: "AI Classification", desc: "Classify clauses using BERT model" },
                { icon: AlertTriangle, label: "Risk Detection", desc: "Identify risky patterns and terms" },
                { icon: CheckCircle, label: "Summary Generation", desc: "Create plain-language summary" }
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <step.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={onBack} disabled={isAnalyzing}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};