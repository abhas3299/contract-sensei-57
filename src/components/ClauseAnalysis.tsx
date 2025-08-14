import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle, Eye } from 'lucide-react';

interface Clause {
  id: string;
  type: string;
  content: string;
  riskLevel: 'high' | 'medium' | 'low';
  explanation: string;
  suggestion?: string;
}

interface ClauseAnalysisProps {
  clauses: Clause[];
  className?: string;
}

export const ClauseAnalysis = ({ clauses, className }: ClauseAnalysisProps) => {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-risk-high" />;
      case 'medium':
        return <Shield className="w-4 h-4 text-risk-medium" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-risk-low" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'border-l-risk-high bg-risk-high/5';
      case 'medium':
        return 'border-l-risk-medium bg-risk-medium/5';
      case 'low':
        return 'border-l-risk-low bg-risk-low/5';
      default:
        return 'border-l-border';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Clause Analysis ({clauses.length} clauses found)
        </h3>
        <div className="flex gap-2">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            {clauses.filter(c => c.riskLevel === 'high').length} High
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Shield className="w-3 h-3" />
            {clauses.filter(c => c.riskLevel === 'medium').length} Medium
          </Badge>
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            {clauses.filter(c => c.riskLevel === 'low').length} Low
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {clauses.map((clause) => (
          <Card key={clause.id} className={`border-l-4 ${getRiskColor(clause.riskLevel)} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {getRiskIcon(clause.riskLevel)}
                  {clause.type}
                </CardTitle>
                <Badge variant={getRiskBadgeVariant(clause.riskLevel)}>
                  {clause.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="p-3 bg-muted/50 rounded-md border-l-2 border-l-primary/30">
                <p className="text-sm text-muted-foreground italic">
                  "{clause.content}"
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Analysis:</span> {clause.explanation}
                </p>
                
                {clause.suggestion && (
                  <p className="text-sm text-primary">
                    <span className="font-medium">Suggestion:</span> {clause.suggestion}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};