from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import re
import spacy
from typing import List, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NLPAnalyzer:
    def __init__(self):
        try:
            # Initialize summarization pipeline
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                max_length=150,
                min_length=50,
                do_sample=False
            )
            
            # Initialize classification pipeline for legal text
            self.classifier = pipeline(
                "text-classification",
                model="nlpaueb/legal-bert-base-uncased",
                return_all_scores=True
            )
            
            # Load spaCy model for NER
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except OSError:
                logger.warning("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
                self.nlp = None
                
        except Exception as e:
            logger.error(f"Error initializing NLP models: {e}")
            # Fallback to basic functionality
            self.summarizer = None
            self.classifier = None
            self.nlp = None
    
    def classify_clauses(self, text: str) -> List[Dict[str, Any]]:
        """Classify contract clauses into categories"""
        clauses = self._split_into_clauses(text)
        classified_clauses = []
        
        for clause in clauses:
            category = self._classify_clause_category(clause)
            risk_level = self._assess_clause_risk(clause, category)
            
            classified_clauses.append({
                'text': clause,
                'category': category,
                'risk_level': risk_level,
                'explanation': self._generate_explanation(clause, category, risk_level),
                'suggestion': self._generate_suggestion(clause, category, risk_level) if risk_level in ['medium', 'high'] else None
            })
        
        return classified_clauses
    
    def detect_risky_clauses(self, text: str) -> List[Dict[str, Any]]:
        """Detect risky clauses using rule-based patterns"""
        risky_patterns = {
            'termination_without_notice': [
                r'terminate.*immediately.*without.*notice',
                r'terminate.*at.*any.*time.*without.*cause',
                r'terminate.*without.*prior.*notice'
            ],
            'unlimited_liability': [
                r'unlimited.*liability',
                r'liable.*for.*all.*damages',
                r'no.*limitation.*on.*liability'
            ],
            'broad_indemnification': [
                r'indemnify.*against.*all.*claims',
                r'hold.*harmless.*from.*any.*and.*all',
                r'indemnify.*for.*any.*loss.*or.*damage'
            ],
            'automatic_renewal': [
                r'automatically.*renew',
                r'auto.*renewal',
                r'renew.*automatically'
            ],
            'exclusive_jurisdiction': [
                r'exclusive.*jurisdiction',
                r'courts.*of.*\w+.*shall.*have.*exclusive',
                r'submit.*to.*exclusive.*jurisdiction'
            ]
        }
        
        risky_clauses = []
        text_lower = text.lower()
        
        for risk_type, patterns in risky_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text_lower, re.IGNORECASE)
                for match in matches:
                    # Extract surrounding context
                    start = max(0, match.start() - 100)
                    end = min(len(text), match.end() + 100)
                    context = text[start:end].strip()
                    
                    risky_clauses.append({
                        'type': risk_type,
                        'matched_text': match.group(),
                        'context': context,
                        'risk_level': 'high',
                        'explanation': self._get_risk_explanation(risk_type)
                    })
        
        return risky_clauses
    
    def generate_summary(self, text: str) -> str:
        """Generate abstractive summary of the contract"""
        if not self.summarizer:
            return self._generate_extractive_summary(text)
        
        try:
            # Split text into chunks if too long
            max_chunk_length = 1024
            chunks = [text[i:i+max_chunk_length] for i in range(0, len(text), max_chunk_length)]
            
            summaries = []
            for chunk in chunks[:3]:  # Limit to first 3 chunks to avoid timeout
                if len(chunk.strip()) > 50:  # Only summarize substantial chunks
                    summary = self.summarizer(chunk, max_length=100, min_length=30, do_sample=False)
                    summaries.append(summary[0]['summary_text'])
            
            return ' '.join(summaries)
            
        except Exception as e:
            logger.error(f"Error in summarization: {e}")
            return self._generate_extractive_summary(text)
    
    def _split_into_clauses(self, text: str) -> List[str]:
        """Split contract text into individual clauses"""
        # Simple clause splitting based on common patterns
        clause_patterns = [
            r'\n\d+\.',  # Numbered clauses
            r'\n[A-Z]\.',  # Lettered clauses
            r'\n\([a-z]\)',  # Parenthetical clauses
            r'\n[A-Z][A-Z\s]+:',  # Section headers
        ]
        
        clauses = []
        current_clause = ""
        
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check if this line starts a new clause
            is_new_clause = any(re.match(pattern, '\n' + line) for pattern in clause_patterns)
            
            if is_new_clause and current_clause:
                clauses.append(current_clause.strip())
                current_clause = line
            else:
                current_clause += ' ' + line
        
        if current_clause:
            clauses.append(current_clause.strip())
        
        # Filter out very short clauses
        return [clause for clause in clauses if len(clause) > 50]
    
    def _classify_clause_category(self, clause: str) -> str:
        """Classify a clause into a category"""
        clause_lower = clause.lower()
        
        categories = {
            'termination': ['terminate', 'termination', 'end', 'expire', 'dissolution'],
            'payment': ['payment', 'pay', 'fee', 'cost', 'invoice', 'billing', 'compensation'],
            'liability': ['liable', 'liability', 'responsible', 'damages', 'loss', 'harm'],
            'confidentiality': ['confidential', 'non-disclosure', 'proprietary', 'secret', 'private'],
            'jurisdiction': ['jurisdiction', 'court', 'law', 'govern', 'dispute', 'arbitration'],
            'intellectual_property': ['intellectual property', 'copyright', 'patent', 'trademark', 'ip'],
            'indemnification': ['indemnify', 'indemnification', 'hold harmless', 'defend'],
            'force_majeure': ['force majeure', 'act of god', 'unforeseeable', 'beyond control'],
            'assignment': ['assign', 'assignment', 'transfer', 'delegate'],
            'modification': ['modify', 'amendment', 'change', 'alter', 'update']
        }
        
        for category, keywords in categories.items():
            if any(keyword in clause_lower for keyword in keywords):
                return category
        
        return 'general'
    
    def _assess_clause_risk(self, clause: str, category: str) -> str:
        """Assess the risk level of a clause"""
        clause_lower = clause.lower()
        
        high_risk_indicators = [
            'immediately', 'without notice', 'unlimited', 'all damages',
            'any and all', 'exclusive', 'irrevocable', 'perpetual',
            'automatically renew', 'sole discretion'
        ]
        
        medium_risk_indicators = [
            'reasonable', 'material breach', 'thirty days', '30 days',
            'written notice', 'cure period', 'mutual agreement'
        ]
        
        high_risk_count = sum(1 for indicator in high_risk_indicators if indicator in clause_lower)
        medium_risk_count = sum(1 for indicator in medium_risk_indicators if indicator in clause_lower)
        
        if high_risk_count > 0:
            return 'high'
        elif medium_risk_count > 0:
            return 'medium'
        else:
            return 'low'
    
    def _generate_explanation(self, clause: str, category: str, risk_level: str) -> str:
        """Generate explanation for a clause"""
        explanations = {
            'termination': {
                'high': 'This termination clause allows immediate termination without notice, which provides no protection for either party.',
                'medium': 'This termination clause provides some notice period but may still pose risks.',
                'low': 'This termination clause provides adequate protection with proper notice requirements.'
            },
            'payment': {
                'high': 'This payment clause may impose unreasonable financial obligations or penalties.',
                'medium': 'This payment clause has moderate terms that should be reviewed.',
                'low': 'This payment clause appears to have standard and reasonable terms.'
            },
            'liability': {
                'high': 'This liability clause may expose you to unlimited or excessive liability.',
                'medium': 'This liability clause has some limitations but should be carefully reviewed.',
                'low': 'This liability clause provides reasonable protection and limitations.'
            }
        }
        
        return explanations.get(category, {}).get(risk_level, 
            f'This {category} clause has been assessed as {risk_level} risk and should be reviewed.')
    
    def _generate_suggestion(self, clause: str, category: str, risk_level: str) -> str:
        """Generate suggestions for risky clauses"""
        if risk_level == 'low':
            return None
            
        suggestions = {
            'termination': 'Consider requiring 30-60 days written notice for termination to allow for proper transition planning.',
            'payment': 'Negotiate for more reasonable payment terms and consider adding caps on penalties.',
            'liability': 'Consider adding liability caps and exceptions for gross negligence or willful misconduct.',
            'confidentiality': 'Ensure the confidentiality terms are mutual and have reasonable time limitations.',
            'jurisdiction': 'Consider negotiating for a more convenient jurisdiction or alternative dispute resolution.'
        }
        
        return suggestions.get(category, 'Consider negotiating more favorable terms for this clause.')
    
    def _get_risk_explanation(self, risk_type: str) -> str:
        """Get explanation for detected risky patterns"""
        explanations = {
            'termination_without_notice': 'Allows immediate termination without notice, providing no protection.',
            'unlimited_liability': 'Exposes party to unlimited financial liability for damages.',
            'broad_indemnification': 'Requires indemnification for all claims, which can be very costly.',
            'automatic_renewal': 'Contract renews automatically, potentially trapping parties.',
            'exclusive_jurisdiction': 'Limits legal options by requiring specific court jurisdiction.'
        }
        
        return explanations.get(risk_type, 'This clause pattern has been identified as potentially risky.')
    
    def _generate_extractive_summary(self, text: str) -> str:
        """Generate extractive summary as fallback"""
        sentences = re.split(r'[.!?]+', text)
        # Take first few sentences as a basic summary
        summary_sentences = [s.strip() for s in sentences[:3] if len(s.strip()) > 20]
        return '. '.join(summary_sentences) + '.'