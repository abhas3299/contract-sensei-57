import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, TrendingUp, Eye } from 'lucide-react';
import { mockContracts, MockContract } from '@/data/mockContracts';

interface ContractLibraryProps {
  onSelectContract: (contract: MockContract) => void;
  onNewUpload: () => void;
}

export const ContractLibrary = ({ onSelectContract, onNewUpload }: ContractLibraryProps) => {
  const getRiskBadgeVariant = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'secondary';
    return 'outline';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contract Library</h2>
          <p className="text-muted-foreground">
            Previously analyzed contracts with AI risk assessment
          </p>
        </div>
        <Button variant="hero" onClick={onNewUpload}>
          <FileText className="w-4 h-4 mr-2" />
          Upload New Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockContracts.map((contract) => (
          <Card 
            key={contract.id} 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-l-primary"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base line-clamp-2">
                    {contract.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    {contract.type}
                  </div>
                </div>
                <Badge variant={getRiskBadgeVariant(contract.riskScore)}>
                  {getRiskLevel(contract.riskScore)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Risk Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        contract.riskScore >= 70 ? 'bg-risk-high' :
                        contract.riskScore >= 40 ? 'bg-risk-medium' : 'bg-risk-low'
                      }`}
                      style={{ width: `${contract.riskScore}%` }}
                    />
                  </div>
                  <span className="font-semibold">{contract.riskScore}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(contract.uploadDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {contract.clauses.length} clauses
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onSelectContract(contract)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Analysis
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};