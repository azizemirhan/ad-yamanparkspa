const fs = require('fs');
const path = require('path');

const files = ['index.html', 'hizmetler.html'];
files.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
        console.log(`--- IDs in ${filename} ---`);
        const content = fs.readFileSync(filePath, 'utf8');
        const regex = /id=["']([^"']*)["']/gi;
        let match;
        while ((match = regex.exec(content)) !== null) {
            console.log(match[1]);
        }
    }
});
