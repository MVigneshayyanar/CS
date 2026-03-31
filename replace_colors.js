const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.git')) {
        walk(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.jsx') || dirPath.endsWith('.js') || dirPath.endsWith('.css')) {
        callback(dirPath);
      }
    }
  });
}

let updatedFiles = 0;

walk('c:/CS/client/src', function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/\bgreen-(\d+)/g, 'teal-$1')
    .replace(/\bemerald-(\d+)/g, 'teal-$1')
    .replace(/\bcyan-(\d+)/g, 'teal-$1')
    .replace(/\bindigo-(\d+)/g, 'teal-$1')
    .replace(/#10b981/ig, '#1a6b5c') // emerald-500 to teal
    .replace(/#34d399/ig, '#2a8c78') // emerald-400 to teal-light
    .replace(/#059669/ig, '#134d42') // emerald-600 to teal-dark
    .replace(/#22c55e/ig, '#1a6b5c') // green-500 to teal
    .replace(/#16a34a/ig, '#134d42'); // green-600 to teal-dark

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    updatedFiles++;
    console.log('Updated:', filePath);
  }
});

console.log('Total files updated:', updatedFiles);
