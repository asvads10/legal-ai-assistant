// Main Application Logic

let currentAnalysis = null;

function loadSample(type) {
    const textarea = document.getElementById('documentInput');
    switch(type) {
        case 'nda':
            textarea.value = SAMPLES.nda;
            break;
        case 'service':
            textarea.value = SAMPLES.service;
            break;
        case 'employment':
            textarea.value = SAMPLES.employment;
            break;
    }
    textarea.focus();
}

function clearInput() {
    document.getElementById('documentInput').value = '';
    document.getElementById('visualOutput').innerHTML = `
        <div class="placeholder">
            <div class="placeholder-icon">⚖️</div>
            <p>Analyze a document to see results</p>
        </div>
    `;
    document.getElementById('jsonOutput').textContent = '';
    document.getElementById('highlightedText').innerHTML = '';
    currentAnalysis = null;
}

function analyzeDocument() {
    const text = document.getElementById('documentInput').value.trim();
    
    if (!text) {
        alert('Please enter a legal document to analyze.');
        return;
    }

    // Show loading state
    const visualOutput = document.getElementById('visualOutput');
    visualOutput.innerHTML = '<div class="placeholder"><div class="placeholder-icon">⏳</div><p>Analyzing document...</p></div>';

    // Simulate a brief delay for UX
    setTimeout(() => {
        try {
            // Perform analysis
            currentAnalysis = legalParser.analyze(text);
            
            // Render results
            renderVisualAnalysis(currentAnalysis);
            renderJSONOutput(currentAnalysis);
            renderHighlightedText(currentAnalysis);
            
            // Switch to visual tab
            switchTab('visual');
        } catch (error) {
            visualOutput.innerHTML = `
                <div class="placeholder">
                    <div class="placeholder-icon">❌</div>
                    <p>Error analyzing document: ${error.message}</p>
                </div>
            `;
        }
    }, 500);
}

function renderVisualAnalysis(analysis) {
    const output = document.getElementById('visualOutput');
    
    const html = `
        <div class="summary-cards">
            <div class="stat-card">
                <h3>Total Clauses</h3>
                <div class="value">${analysis.clauses.length}</div>
            </div>
            <div class="stat-card">
                <h3>Risk Level</h3>
                <div class="value">${analysis.risks.overallRisk.toUpperCase()}</div>
            </div>
            <div class="stat-card">
                <h3>Entities Found</h3>
                <div class="value">${analysis.metadata.entityCount}</div>
            </div>
            <div class="stat-card">
                <h3>Complexity</h3>
                <div class="value">${analysis.metadata.complexity.toUpperCase()}</div>
            </div>
        </div>

        <div class="clause-section">
            <h3>📋 Identified Clauses</h3>
            ${analysis.clauses.map(clause => `
                <div class="clause-item ${clause.risk}-risk">
                    <div class="clause-header">
                        <span class="clause-type">${clause.type}</span>
                        <span class="risk-badge risk-${clause.risk}">${clause.risk} risk</span>
                    </div>
                    <div class="clause-text">${clause.text}</div>
                </div>
            `).join('')}
        </div>

        ${analysis.risks.recommendations.length > 0 ? `
            <div class="clause-section">
                <h3>💡 Recommendations</h3>
                ${analysis.risks.recommendations.map(rec => `
                    <div class="clause-item ${rec.priority}-risk">
                        <div class="clause-text"><strong>${rec.priority.toUpperCase()} Priority:</strong> ${rec.recommendation}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${Object.keys(analysis.entities).some(key => analysis.entities[key].length > 0) ? `
            <div class="entities-section">
                <h3>🔍 Extracted Entities</h3>
                <div class="entity-grid">
                    ${analysis.entities.parties.length > 0 ? `
                        <div class="entity-item">
                            <div class="entity-label">Parties</div>
                            <div class="entity-value">${analysis.entities.parties.slice(0, 3).join(', ')}</div>
                        </div>
                    ` : ''}
                    ${analysis.entities.dates.length > 0 ? `
                        <div class="entity-item">
                            <div class="entity-label">Dates</div>
                            <div class="entity-value">${analysis.entities.dates.slice(0, 3).join(', ')}</div>
                        </div>
                    ` : ''}
                    ${analysis.entities.amounts.length > 0 ? `
                        <div class="entity-item">
                            <div class="entity-label">Amounts</div>
                            <div class="entity-value">${analysis.entities.amounts.slice(0, 3).join(', ')}</div>
                        </div>
                    ` : ''}
                    ${analysis.entities.durations.length > 0 ? `
                        <div class="entity-item">
                            <div class="entity-label">Durations</div>
                            <div class="entity-value">${analysis.entities.durations.slice(0, 3).join(', ')}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        ` : ''}
    `;
    
    output.innerHTML = html;
}

function renderJSONOutput(analysis) {
    const output = document.getElementById('jsonOutput');
    
    // Create a clean version for JSON output
    const cleanAnalysis = {
        metadata: analysis.metadata,
        summary: analysis.summary,
        clauses: analysis.clauses.map(c => ({
            id: c.id,
            type: c.type,
            text: c.text,
            risk: c.risk,
            keywords: c.matched_keywords
        })),
        entities: analysis.entities,
        risks: {
            distribution: analysis.risks.distribution,
            overall: analysis.risks.overallRisk,
            recommendations: analysis.risks.recommendations
        }
    };
    
    output.textContent = JSON.stringify(cleanAnalysis, null, 2);
}

function renderHighlightedText(analysis) {
    const output = document.getElementById('highlightedText');
    
    // Create a highlighted version of the text
    let highlighted = analysis.rawText;
    
    // Highlight entities
    if (analysis.entities.parties.length > 0) {
        analysis.entities.parties.forEach(party => {
            const regex = new RegExp(`\\b${party.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="highlight highlight-party">${party}</span>`);
        });
    }
    
    if (analysis.entities.dates.length > 0) {
        analysis.entities.dates.forEach(date => {
            const regex = new RegExp(date.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            highlighted = highlighted.replace(regex, `<span class="highlight highlight-date">${date}</span>`);
        });
    }
    
    if (analysis.entities.amounts.length > 0) {
        analysis.entities.amounts.forEach(amount => {
            const regex = new RegExp(amount.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            highlighted = highlighted.replace(regex, `<span class="highlight highlight-amount">${amount}</span>`);
        });
    }
    
    // Format with line breaks
    highlighted = highlighted.replace(/\n\n/g, '<br><br>');
    
    output.innerHTML = highlighted;
}

function switchTab(tabName, clickedElement) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Add active class to selected tab button if element was clicked
    if (clickedElement) {
        clickedElement.classList.add('active');
    } else {
        // If called programmatically, activate the first matching tab
        const tabButton = Array.from(document.querySelectorAll('.tab')).find(
            tab => tab.textContent.toLowerCase().includes(tabName)
        );
        if (tabButton) tabButton.classList.add('active');
    }
}

function copyJSON(button) {
    const jsonText = document.getElementById('jsonOutput').textContent;
    
    if (!jsonText) {
        alert('No JSON to copy. Please analyze a document first.');
        return;
    }
    
    navigator.clipboard.writeText(jsonText).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

function downloadJSON() {
    const jsonText = document.getElementById('jsonOutput').textContent;
    
    if (!jsonText) {
        alert('No JSON to download. Please analyze a document first.');
        return;
    }
    
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Legal AI Assistant initialized');
});
