const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'style.css');
if (fs.existsSync(cssPath)) {
    const lines = fs.readFileSync(cssPath, 'utf8').split('\n');
    lines.forEach((line, index) => {
        if (line.includes('-section') && (line.includes('[class') || line.includes('{') || line.includes(','))) {
            // Only print if it's not a class name direct match that we already saw
            if (!line.includes('.services-section') && !line.includes('.benefits-section') && !line.includes('.gallery-section') && !line.includes('.testimonials-section') && !line.includes('.contact-section') && !line.includes('.services-detail-section') && !line.includes('.services-massage-section') && !line.includes('.services-packages-section')) {
                console.log(`Line ${index + 1}: ${line.trim()}`);
                for (let i = Math.max(0, index - 2); i <= Math.min(lines.length - 1, index + 4); i++) {
                    console.log(`  [Line ${i+1}] ${lines[i].trim()}`);
                }
                console.log('---');
            }
        }
    });
}
