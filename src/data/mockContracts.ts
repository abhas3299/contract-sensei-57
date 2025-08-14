export interface MockContract {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  riskScore: number;
  clauses: Array<{
    id: string;
    type: string;
    content: string;
    riskLevel: 'high' | 'medium' | 'low';
    explanation: string;
    suggestion?: string;
  }>;
  summary: string;
}

export const mockContracts: MockContract[] = [
  {
    id: '1',
    name: 'Service Agreement - TechCorp Solutions',
    type: 'Service Agreement',
    uploadDate: '2024-01-15',
    riskScore: 78,
    clauses: [
      {
        id: '1-1',
        type: 'Termination Clause',
        content: 'Either party may terminate this agreement immediately without notice for any reason.',
        riskLevel: 'high',
        explanation: 'This clause allows immediate termination without notice, which provides no protection for either party and can lead to unexpected contract endings.',
        suggestion: 'Consider requiring 30-60 days written notice for termination to allow for proper transition planning.'
      },
      {
        id: '1-2',
        type: 'Liability Limitation',
        content: 'Client agrees that TechCorp shall not be liable for any indirect, special, or consequential damages.',
        riskLevel: 'medium',
        explanation: 'This clause limits liability but only for certain types of damages. Direct damages are still covered.',
        suggestion: 'Ensure the limitation is reasonable and consider adding exceptions for gross negligence or willful misconduct.'
      },
      {
        id: '1-3',
        type: 'Payment Terms',
        content: 'Payment is due within 30 days of invoice date. Late payments incur 1.5% monthly interest.',
        riskLevel: 'low',
        explanation: 'Standard payment terms with reasonable interest rate for late payments.',
      },
      {
        id: '1-4',
        type: 'Intellectual Property',
        content: 'All work product and deliverables created under this agreement shall become the exclusive property of TechCorp.',
        riskLevel: 'high',
        explanation: 'This clause gives all intellectual property rights to TechCorp, which may not be favorable to the client.',
        suggestion: 'Negotiate for shared IP rights or ensure client retains rights to their proprietary information.'
      }
    ],
    summary: 'This service agreement contains several high-risk clauses including immediate termination rights and broad IP assignment to the service provider. The contract heavily favors TechCorp with limited protections for the client. Key concerns include lack of termination notice requirements and comprehensive IP transfer to the vendor.'
  },
  {
    id: '2',
    name: 'Employment Contract - Jane Smith',
    type: 'Employment Contract',
    uploadDate: '2024-01-10',
    riskScore: 42,
    clauses: [
      {
        id: '2-1',
        type: 'Non-Compete Clause',
        content: 'Employee agrees not to work for any competitor within a 50-mile radius for 12 months after termination.',
        riskLevel: 'medium',
        explanation: 'Non-compete clause with reasonable geographic and time limitations, though enforcement varies by jurisdiction.',
        suggestion: 'Verify enforceability under local employment laws and consider reducing scope if possible.'
      },
      {
        id: '2-2',
        type: 'Confidentiality',
        content: 'Employee shall maintain confidentiality of all proprietary information during and after employment.',
        riskLevel: 'low',
        explanation: 'Standard confidentiality clause that protects company information appropriately.',
      },
      {
        id: '2-3',
        type: 'Termination Notice',
        content: 'Either party may terminate employment with 30 days written notice.',
        riskLevel: 'low',
        explanation: 'Provides adequate notice period for both parties to plan for transition.',
      }
    ],
    summary: 'This employment contract has moderate risk levels with a standard non-compete clause being the primary concern. The agreement provides reasonable protections for both employer and employee with appropriate notice periods and confidentiality requirements.'
  },
  {
    id: '3',
    name: 'Non-Disclosure Agreement - ProjectX',
    type: 'NDA',
    uploadDate: '2024-01-08',
    riskScore: 25,
    clauses: [
      {
        id: '3-1',
        type: 'Confidentiality Scope',
        content: 'Confidential Information includes technical data, business plans, and customer information disclosed during the term.',
        riskLevel: 'low',
        explanation: 'Well-defined scope of confidential information that is reasonable and specific.',
      },
      {
        id: '3-2',
        type: 'Term Duration',
        content: 'This agreement shall remain in effect for 3 years from the date of execution.',
        riskLevel: 'low',
        explanation: 'Reasonable time limitation for confidentiality obligations.',
      },
      {
        id: '3-3',
        type: 'Return of Information',
        content: 'Upon termination, each party shall return all confidential information and destroy any copies.',
        riskLevel: 'low',
        explanation: 'Standard return provision that ensures proper handling of confidential materials.',
      }
    ],
    summary: 'This NDA is well-balanced with low risk factors. It contains appropriate confidentiality protections with reasonable scope and duration. The agreement provides adequate safeguards for both parties without overly restrictive terms.'
  }
];

export const getContractById = (id: string): MockContract | undefined => {
  return mockContracts.find(contract => contract.id === id);
};