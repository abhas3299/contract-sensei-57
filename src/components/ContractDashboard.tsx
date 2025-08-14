import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskGauge } from '@/components/RiskGauge';
import { ClauseAnalysis } from '@/components/ClauseAnalysis';
import { Download, FileText, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { MockContract } from '@/data/mockContracts';
import { toast } from '@/hooks/use-toast';

interface ContractDashboardProps {
  contract: MockContract;
  onBack: () => void;
}

export const ContractDashboard = ({ contract, onBack }: ContractDashboardProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    toast({
      title: "Export completed",
      description: "Contract analysis report has been downloaded.",
    });
  };

  const highRiskClauses = contract.clauses.filter(c => c.riskLevel === 'high').length;
  const mediumRiskClauses = contract.clauses.filter(c => c.riskLevel === 'medium').length;
  const lowRiskClauses = contract.clauses.filter(c => c.riskLevel === 'low').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button variant="ghost" onClick={onBack} className="mb-2">
              ← Back to Upload
            </Button>
            <h1 className="text-3xl font-bold text-foreground">{contract.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {contract.type}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Uploaded {new Date(contract.uploadDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="w-5 h-5" />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-risk-high/10 to-risk-high/20 border-risk-high/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-risk-high flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-risk-high">{highRiskClauses}</div>
              <p className="text-xs text-muted-foreground">Critical issues found</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-risk-medium/10 to-risk-medium/20 border-risk-medium/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-risk-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Medium Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-risk-medium">{mediumRiskClauses}</div>
              <p className="text-xs text-muted-foreground">Items to review</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-risk-low/10 to-risk-low/20 border-risk-low/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-risk-low flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Low Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-risk-low">{lowRiskClauses}</div>
              <p className="text-xs text-muted-foreground">Standard clauses</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Clauses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{contract.clauses.length}</div>
              <p className="text-xs text-muted-foreground">Analyzed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Score */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Overall Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <RiskGauge score={contract.riskScore} />
            </CardContent>
          </Card>

          {/* Contract Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {contract.summary}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">AI Analyzed</Badge>
                  <Badge variant="outline">Plain Language</Badge>
                  <Badge variant="outline">Risk Highlighted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clause Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Detailed Clause Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClauseAnalysis clauses={contract.clauses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};