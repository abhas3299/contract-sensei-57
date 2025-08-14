import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ContractDashboard } from '@/components/ContractDashboard';
import { ContractAnalyzer } from '@/components/ContractAnalyzer';
import { ContractLibrary } from '@/components/ContractLibrary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, Shield, Brain, FileSearch, Zap, CheckCircle, FileText } from 'lucide-react';
import { AnalysisResponse, contractAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'home' | 'upload' | 'analyzing' | 'dashboard' | 'library';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResponse | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentContractId, setCurrentContractId] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleUploadComplete = (contractId: string) => {
    setCurrentContractId(contractId);
    setCurrentView('analyzing');
  };

  const handleAnalysisComplete = (analysis: AnalysisResponse) => {
    setSelectedAnalysis(analysis);
    setSelectedFileName(uploadedFile?.name || 'Unknown');
    setCurrentView('dashboard');
  };

  const handleSelectContract = async (contractId: string, fileName: string) => {
    try {
      const analysis = await contractAPI.getAnalysisResult(contractId);
      setSelectedAnalysis(analysis);
      setSelectedFileName(fileName);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error loading analysis:', error);
      toast({
        title: "Error loading analysis",
        description: "There was an error loading the contract analysis.",
        variant: "destructive",
      });
    }
  };

  if (currentView === 'dashboard' && selectedAnalysis) {
    return (
      <ContractDashboard 
        analysis={selectedAnalysis}
        fileName={selectedFileName}
        onBack={() => setCurrentView('home')} 
      />
    );
  }

  if (currentView === 'analyzing') {
    return (
      <ContractAnalyzer
        contractId={currentContractId}
        fileName={uploadedFile?.name || 'Unknown'}
        onComplete={handleAnalysisComplete}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ContractAI</h1>
                <p className="text-xs text-muted-foreground">Legal Contract Analysis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={currentView === 'home' ? 'default' : 'ghost'} 
                onClick={() => setCurrentView('home')}
              >
                Home
              </Button>
              <Button 
                variant={currentView === 'library' ? 'default' : 'ghost'} 
                onClick={() => setCurrentView('library')}
              >
                Library
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'library' ? (
          <ContractLibrary 
            onSelectContract={handleSelectContract}
            onNewUpload={() => setCurrentView('upload')}
          />
        ) : currentView === 'upload' ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Upload Your Contract</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your PDF or DOCX contract and get instant AI-powered risk analysis, 
                clause breakdown, and plain-language summaries.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <FileUpload 
                onFileSelect={handleFileSelect}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="px-4 py-2">
                  AI-Powered Legal Analysis
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
                  Analyze Contracts with
                  <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"> AI</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Upload your legal contracts and get instant risk assessment, clause analysis, 
                  and plain-language explanations powered by advanced AI models.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => setCurrentView('upload')}>
                  <FileSearch className="w-5 h-5" />
                  Analyze Contract
                </Button>
                <Button variant="outline" size="xl" onClick={() => setCurrentView('library')}>
                  <Shield className="w-5 h-5" />
                  View Examples
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-risk-high to-risk-high/80 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-risk-high-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Risk Detection</h3>
                  <p className="text-muted-foreground">
                    Automatically identify high-risk clauses including termination terms, 
                    liability limitations, and unfavorable conditions.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Summaries</h3>
                  <p className="text-muted-foreground">
                    Get plain-language explanations of complex legal terms and 
                    clause-by-clause analysis in easy-to-understand format.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-risk-low to-risk-low/80 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-risk-low-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Instant Analysis</h3>
                  <p className="text-muted-foreground">
                    Upload PDF or DOCX files and receive comprehensive analysis 
                    within seconds, not hours of manual review.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sample Results */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Real AI-Powered Analysis</h2>
                <p className="text-lg text-muted-foreground">
                  Upload your contracts to see how our AI identifies risks and explains clauses using advanced NLP models
                </p>
              </div>
              
              <div className="text-center space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="p-0 text-center">
                      <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold">BERT Classification</h4>
                      <p className="text-sm text-muted-foreground">Legal-BERT model for clause classification</p>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-risk-medium/10 to-risk-medium/5">
                    <CardContent className="p-0 text-center">
                      <Shield className="w-8 h-8 text-risk-medium mx-auto mb-2" />
                      <h4 className="font-semibold">Risk Detection</h4>
                      <p className="text-sm text-muted-foreground">Pattern matching for risky clauses</p>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-risk-low/10 to-risk-low/5">
                    <CardContent className="p-0 text-center">
                      <FileText className="w-8 h-8 text-risk-low mx-auto mb-2" />
                      <h4 className="font-semibold">BART Summarization</h4>
                      <p className="text-sm text-muted-foreground">Abstractive summarization model</p>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-risk-high/10 to-risk-high/5">
                    <CardContent className="p-0 text-center">
                      <Zap className="w-8 h-8 text-risk-high mx-auto mb-2" />
                      <h4 className="font-semibold">Real-time Analysis</h4>
                      <p className="text-sm text-muted-foreground">Fast processing with FastAPI backend</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Button variant="hero" size="xl" onClick={() => setCurrentView('upload')}>
                  <FileSearch className="w-5 h-5" />
                  Try AI Analysis Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
