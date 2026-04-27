// Legal Document Parser - Core Analysis Engine

class LegalParser {
    constructor() {
        this.clausePatterns = {
            confidentiality: {
                keywords: ['confidential', 'proprietary', 'non-disclosure', 'nda', 'secret', 'privileged'],
                risk: 'medium'
            },
            liability: {
                keywords: ['liable', 'liability', 'indemnify', 'indemnification', 'hold harmless', 'damages'],
                risk: 'high'
            },
            termination: {
                keywords: ['terminate', 'termination', 'cancel', 'cancellation', 'expire'],
                risk: 'medium'
            },
            payment: {
                keywords: ['payment', 'fee', 'compensation', 'remuneration', 'invoice', 'price'],
                risk: 'low'
            },
            warranty: {
                keywords: ['warrant', 'warranty', 'guarantee', 'representation'],
                risk: 'medium'
            },
            nonCompete: {
                keywords: ['non-compete', 'noncompete', 'compete', 'competitive'],
                risk: 'high'
            },
            governingLaw: {
                keywords: ['governing law', 'jurisdiction', 'venue', 'arbitration'],
                risk: 'low'
            },
            intellectual: {
                keywords: ['intellectual property', 'copyright', 'patent', 'trademark', 'ip'],
                risk: 'high'
            }
        };

        this.entityPatterns = {
            party: /\b(party|parties|company|corporation|individual|entity)\b/gi,
            date: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
            amount: /\$[\d,]+(?:\.\d{2})?|\b\d+\s*(?:dollars?|USD)\b/gi,
            duration: /\b\d+\s*(?:days?|weeks?|months?|years?)\b/gi
        };
    }

    analyze(text) {
        const sentences = this.tokenizeSentences(text);
        const clauses = this.extractClauses(sentences);
        const entities = this.extractEntities(text);
        const risks = this.assessRisks(clauses);
        const metadata = this.extractMetadata(text, clauses, entities);

        return {
            metadata,
            clauses,
            entities,
            risks,
            summary: this.generateSummary(clauses, risks),
            rawText: text
        };
    }

    tokenizeSentences(text) {
        // Split on period, exclamation, question mark followed by space or newline
        return text
            .split(/[.!?]+\s+/)
            .map(s => s.trim())
            .filter(s => s.length > 20); // Filter out very short fragments
    }

    extractClauses(sentences) {
        const clauses = [];
        
        sentences.forEach((sentence, index) => {
            const lowerSentence = sentence.toLowerCase();
            
            for (const [type, pattern] of Object.entries(this.clausePatterns)) {
                const matches = pattern.keywords.some(keyword => 
                    lowerSentence.includes(keyword.toLowerCase())
                );
                
                if (matches) {
                    clauses.push({
                        id: `clause_${index}`,
                        type: this.formatClauseType(type),
                        text: sentence,
                        risk: pattern.risk,
                        position: index,
                        matched_keywords: pattern.keywords.filter(k => 
                            lowerSentence.includes(k.toLowerCase())
                        )
                    });
                }
            }
        });

        // If no clauses found, create general clauses
        if (clauses.length === 0 && sentences.length > 0) {
            sentences.slice(0, 5).forEach((sentence, index) => {
                clauses.push({
                    id: `clause_${index}`,
                    type: 'General Provision',
                    text: sentence,
                    risk: 'low',
                    position: index,
                    matched_keywords: []
                });
            });
        }

        return clauses;
    }

    extractEntities(text) {
        const entities = {
            parties: [],
            dates: [],
            amounts: [],
            durations: []
        };

        // Extract parties (capitalized names/companies)
        const partyMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|LLC|Corp|Ltd|Co)\.?)?/g);
        if (partyMatches) {
            entities.parties = [...new Set(partyMatches)]
                .filter(p => p.length > 2)
                .slice(0, 10);
        }

        // Extract dates
        const dateMatches = text.match(this.entityPatterns.date);
        if (dateMatches) {
            entities.dates = [...new Set(dateMatches)].slice(0, 10);
        }

        // Extract amounts
        const amountMatches = text.match(this.entityPatterns.amount);
        if (amountMatches) {
            entities.amounts = [...new Set(amountMatches)].slice(0, 10);
        }

        // Extract durations
        const durationMatches = text.match(this.entityPatterns.duration);
        if (durationMatches) {
            entities.durations = [...new Set(durationMatches)].slice(0, 10);
        }

        return entities;
    }

    assessRisks(clauses) {
        const riskLevels = { high: 0, medium: 0, low: 0 };
        const highRiskClauses = [];
        
        clauses.forEach(clause => {
            riskLevels[clause.risk]++;
            if (clause.risk === 'high') {
                highRiskClauses.push(clause);
            }
        });

        return {
            distribution: riskLevels,
            highRiskClauses,
            overallRisk: this.calculateOverallRisk(riskLevels),
            recommendations: this.generateRecommendations(highRiskClauses)
        };
    }

    calculateOverallRisk(riskLevels) {
        const score = (riskLevels.high * 3) + (riskLevels.medium * 2) + (riskLevels.low * 1);
        const total = riskLevels.high + riskLevels.medium + riskLevels.low;
        const average = total > 0 ? score / total : 0;

        if (average >= 2.5) return 'high';
        if (average >= 1.5) return 'medium';
        return 'low';
    }

    generateRecommendations(highRiskClauses) {
        const recommendations = [];
        
        highRiskClauses.forEach(clause => {
            if (clause.type.toLowerCase().includes('liability')) {
                recommendations.push({
                    clause: clause.id,
                    recommendation: 'Review liability caps and ensure adequate insurance coverage',
                    priority: 'high'
                });
            }
            if (clause.type.toLowerCase().includes('compete')) {
                recommendations.push({
                    clause: clause.id,
                    recommendation: 'Verify non-compete scope, duration, and geographic limitations are reasonable',
                    priority: 'high'
                });
            }
            if (clause.type.toLowerCase().includes('intellectual')) {
                recommendations.push({
                    clause: clause.id,
                    recommendation: 'Clarify IP ownership and licensing rights',
                    priority: 'high'
                });
            }
        });

        if (recommendations.length === 0) {
            recommendations.push({
                clause: 'general',
                recommendation: 'Standard review recommended before signing',
                priority: 'low'
            });
        }

        return recommendations;
    }

    extractMetadata(text, clauses, entities) {
        return {
            documentLength: text.length,
            wordCount: text.split(/\s+/).length,
            clauseCount: clauses.length,
            uniqueClauseTypes: [...new Set(clauses.map(c => c.type))].length,
            entityCount: Object.values(entities).reduce((sum, arr) => sum + arr.length, 0),
            analyzedAt: new Date().toISOString(),
            complexity: this.assessComplexity(text, clauses)
        };
    }

    assessComplexity(text, clauses) {
        const avgSentenceLength = text.split(/[.!?]+/).reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / text.split(/[.!?]+/).length;
        const uniqueTerms = [...new Set(text.toLowerCase().match(/\b\w+\b/g))].length;
        
        if (avgSentenceLength > 25 && uniqueTerms > 300) return 'high';
        if (avgSentenceLength > 18 || uniqueTerms > 200) return 'medium';
        return 'low';
    }

    generateSummary(clauses, risks) {
        const clauseTypes = {};
        clauses.forEach(c => {
            clauseTypes[c.type] = (clauseTypes[c.type] || 0) + 1;
        });

        return {
            totalClauses: clauses.length,
            clauseBreakdown: clauseTypes,
            riskAssessment: risks.overallRisk,
            keyFindings: this.generateKeyFindings(clauses, risks)
        };
    }

    generateKeyFindings(clauses, risks) {
        const findings = [];
        
        if (risks.distribution.high > 0) {
            findings.push(`⚠️ ${risks.distribution.high} high-risk clause(s) detected`);
        }
        
        const typeCount = [...new Set(clauses.map(c => c.type))].length;
        findings.push(`📋 ${typeCount} different clause types identified`);
        
        if (risks.recommendations.length > 0) {
            findings.push(`💡 ${risks.recommendations.length} recommendation(s) generated`);
        }

        return findings;
    }

    formatClauseType(type) {
        return type
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    highlightText(text, clauses, entities) {
        let highlighted = text;
        
        // Sort clauses by position to avoid overlapping highlights
        const sortedClauses = [...clauses].sort((a, b) => a.position - b.position);
        
        // Highlight clause types
        sortedClauses.forEach(clause => {
            const escapedText = clause.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedText, 'g');
            const className = this.getHighlightClass(clause.type);
            highlighted = highlighted.replace(regex, 
                `<span class="highlight ${className}" title="${clause.type} - ${clause.risk} risk">${clause.text}</span>`
            );
        });

        return highlighted;
    }

    getHighlightClass(type) {
        const typeMap = {
            'Confidentiality': 'highlight-confidentiality',
            'Liability': 'highlight-liability',
            'Termination': 'highlight-termination',
            'Payment': 'highlight-payment',
            'Warranty': 'highlight-warranty',
            'Governing Law': 'highlight-governing-law'
        };
        return typeMap[type] || 'highlight';
    }
}

// Export for use in app.js
const legalParser = new LegalParser();
