const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'style.css');
if (fs.existsSync(cssPath)) {
    const content = fs.readFileSync(cssPath, 'utf8');
    const sections = [
        '\\.services-section\\b',
        '\\.therapy-section\\b',
        '\\.benefits-section\\b',
        '\\.gallery-section\\b',
        '\\.testimonials-section\\b',
        '\\.contact-section\\b',
        '\\.services-detail-section\\b',
        '\\.services-massage-section\\b',
        '\\.services-packages-section\\b'
    ];
    
    sections.forEach(patternStr => {
        const regex = new RegExp(`(${patternStr}[\\s\\S]*?\\{([\\s\\S]*?)\\})`, 'g');
        let match;
        console.log(`=== Matches for ${patternStr} ===`);
        while ((match = regex.exec(content)) !== null) {
            // Find line number of the match
            const offset = match.index;
            const lineNum = content.substring(0, offset).split('\n').length;
            console.log(`Line ${lineNum}: ${match[0].split('\n')[0]}`);
            const block = match[2];
            const paddingMatch = block.match(/padding\s*:\s*([^;]+)/i);
            if (paddingMatch) {
                console.log(`  Padding: ${paddingMatch[1].trim()}`);
            } else {
                console.log(`  (No padding direct declaration)`);
            }
        }
    });
}
