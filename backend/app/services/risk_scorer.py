from typing import List, Dict, Any

class RiskScorer:
    def __init__(self):
        # Risk weights for different categories
        self.category_weights = {
            'termination': 0.2,
            'liability': 0.25,
            'payment': 0.15,
            'confidentiality': 0.1,
            'jurisdiction': 0.1,
            'indemnification': 0.15,
            'general': 0.05
        }
        
        # Risk level scores
        self.risk_scores = {
            'low': 10,
            'medium': 50,
            'high': 90
        }
    
    def calculate_risk_score(self, clauses: List[Dict[str, Any]], risky_clauses: List[Dict[str, Any]]) -> float:
        """Calculate overall contract risk score (0-100)"""
        if not clauses:
            return 0.0
        
        total_weighted_score = 0.0
        total_weight = 0.0
        
        # Calculate weighted score from classified clauses
        for clause in clauses:
            category = clause.get('category', 'general')
            risk_level = clause.get('risk_level', 'low')
            
            weight = self.category_weights.get(category, 0.05)
            score = self.risk_scores.get(risk_level, 10)
            
            total_weighted_score += weight * score
            total_weight += weight
        
        # Add penalty for detected risky patterns
        risky_penalty = len(risky_clauses) * 5  # 5 points per risky pattern
        
        # Calculate base score
        if total_weight > 0:
            base_score = total_weighted_score / total_weight
        else:
            base_score = 10
        
        # Apply risky pattern penalty
        final_score = min(100, base_score + risky_penalty)
        
        return round(final_score, 1)
    
    def get_risk_level_from_score(self, score: float) -> str:
        """Convert numeric score to risk level"""
        if score >= 70:
            return 'high'
        elif score >= 40:
            return 'medium'
        else:
            return 'low'
    
    def get_risk_breakdown(self, clauses: List[Dict[str, Any]]) -> Dict[str, Dict[str, int]]:
        """Get breakdown of risk levels by category"""
        breakdown = {}
        
        for clause in clauses:
            category = clause.get('category', 'general')
            risk_level = clause.get('risk_level', 'low')
            
            if category not in breakdown:
                breakdown[category] = {'low': 0, 'medium': 0, 'high': 0}
            
            breakdown[category][risk_level] += 1
        
        return breakdown