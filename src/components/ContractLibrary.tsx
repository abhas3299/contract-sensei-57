import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, TrendingUp, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { contractAPI, ContractResponse } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface ContractLibraryProps {
  onSelectContract: (contractId: string, fileName: string) => void;
  onNewUpload: () => void;
}

export const ContractLibrary = ({ onSelectContract, onNewUpload }: ContractLibraryProps) => {
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const contractList = await contractAPI.listContracts();
      setContracts(contractList);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast({
        title: "Error loading contracts",
        description: "There was an error loading your contract library.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-2 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No contracts yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first contract to get started with AI analysis
          </p>
          <Button onClick={onNewUpload}>
            Upload Contract
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contracts.map((contract) => (
          <Card 
            key={contract.id} 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-l-primary"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base line-clamp-2">
                    {contract.filename}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    {contract.status === 'completed' ? 'Analyzed' : 'Processing'}
                  </div>
                </div>
                <Badge variant={getRiskBadgeVariant(contract.risk_score || 0)}>
                  {getRiskLevel(contract.risk_score || 0)}
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
                        (contract.risk_score || 0) >= 70 ? 'bg-risk-high' :
                        (contract.risk_score || 0) >= 40 ? 'bg-risk-medium' : 'bg-risk-low'
                      }`}
                      style={{ width: `${contract.risk_score || 0}%` }}
                    />
                  </div>
                  <span className="font-semibold">{contract.risk_score || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(contract.upload_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {contract.status === 'completed' ? 'Analyzed' : 'Processing'}
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onSelectContract(contract.id, contract.filename)}
                disabled={contract.status !== 'completed'}
              >
                <Eye className="w-4 h-4 mr-2" />
                {contract.status === 'completed' ? 'View Analysis' : 'Processing...'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};