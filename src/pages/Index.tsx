import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ContractDashboard } from '@/components/ContractDashboard';
import { ContractLibrary } from '@/components/ContractLibrary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, Shield, Brain, FileSearch, Zap, CheckCircle } from 'lucide-react';
import { mockContracts, MockContract, getContractById } from '@/data/mockContracts';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'home' | 'upload' | 'analyzing' | 'dashboard' | 'library';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedContract, setSelectedContract] = useState<MockContract | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setCurrentView('analyzing');
    
    // Simulate analysis process
    setTimeout(() => {
      // Use first mock contract as result
      setSelectedContract(mockContracts[0]);
      setCurrentView('dashboard');
      toast({
        title: "Analysis Complete",
        description: "Your contract has been analyzed for risks and key clauses.",
      });
    }, 3000);
  };

  const handleSelectContract = (contract: MockContract) => {
    setSelectedContract(contract);
    setCurrentView('dashboard');
  };

  if (currentView === 'dashboard' && selectedContract) {
    return (
      <ContractDashboard 
        contract={selectedContract} 
        onBack={() => setCurrentView('home')} 
      />
    );
  }

  if (currentView === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center animate-spin">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Analyzing Contract</h3>
              <p className="text-muted-foreground">
                Our AI is examining your contract for risks, clauses, and generating summaries...
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-light animate-pulse w-3/4 transition-all duration-1000" />
              </div>
              <p className="text-sm text-muted-foreground">Processing: {uploadedFile?.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>
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
              <FileUpload onFileSelect={handleFileSelect} />
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
                <h2 className="text-3xl font-bold text-foreground">See AI Analysis in Action</h2>
                <p className="text-lg text-muted-foreground">
                  Explore sample contract analyses to see how our AI identifies risks and explains clauses
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {mockContracts.map((contract) => (
                  <Card 
                    key={contract.id} 
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                    onClick={() => handleSelectContract(contract)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-foreground line-clamp-2">
                            {contract.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{contract.type}</p>
                        </div>
                        <Badge variant={contract.riskScore >= 70 ? 'destructive' : contract.riskScore >= 40 ? 'secondary' : 'outline'}>
                          {contract.riskScore >= 70 ? 'HIGH' : contract.riskScore >= 40 ? 'MED' : 'LOW'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Risk Score</span>
                          <span className="font-semibold">{contract.riskScore}/100</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              contract.riskScore >= 70 ? 'bg-risk-high' :
                              contract.riskScore >= 40 ? 'bg-risk-medium' : 'bg-risk-low'
                            }`}
                            style={{ width: `${contract.riskScore}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4" />
                        {contract.clauses.length} clauses analyzed
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
