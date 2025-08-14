import { useMemo } from 'react';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0-100
  className?: string;
}

export const RiskGauge = ({ score, className }: RiskGaugeProps) => {
  const { level, color, icon: Icon, description } = useMemo(() => {
    if (score >= 70) {
      return {
        level: 'High Risk',
        color: 'risk-high',
        icon: AlertTriangle,
        description: 'This contract contains several high-risk clauses that require attention.'
      };
    } else if (score >= 40) {
      return {
        level: 'Medium Risk',
        color: 'risk-medium',
        icon: Shield,
        description: 'This contract has moderate risk factors that should be reviewed.'
      };
    } else {
      return {
        level: 'Low Risk',
        color: 'risk-low',
        icon: CheckCircle,
        description: 'This contract appears to have minimal risk factors.'
      };
    }
  }, [score]);

  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="hsl(var(--border))"
            strokeWidth="12"
            fill="none"
            className="opacity-20"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={`hsl(var(--${color}))`}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px hsl(var(--' + color + ') / 0.3))'
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={`w-8 h-8 text-${color} mb-2`} />
          <div className="text-4xl font-bold text-foreground">{score}</div>
          <div className="text-sm text-muted-foreground">Risk Score</div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <div className={`text-xl font-semibold text-${color}`}>
          {level}
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          {description}
        </p>
      </div>
    </div>
  );
};