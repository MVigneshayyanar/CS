const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.git')) walk(dirPath, callback);
    } else if (dirPath.endsWith('.jsx') || dirPath.endsWith('.js')) {
      callback(dirPath);
    }
  });
}

let updated = 0;
walk('c:/CS/client/src', (file) => {
  let original = fs.readFileSync(file, 'utf8');
  let content = original
    // background colors
    .replace(/\bbg-teal-700\b/g, 'bg-[#134d42]')
    .replace(/\bbg-teal-600\b/g, 'bg-[#1a6b5c]')
    .replace(/\bbg-teal-500\b/g, 'bg-[#2a8c78]')
    .replace(/\bbg-teal-400\b/g, 'bg-[#3aa892]')
    .replace(/\bbg-teal-300\b/g, 'bg-[#5c9088]')
    .replace(/\bbg-teal-100\b/g, 'bg-[#dff2ed]')
    .replace(/\bbg-teal-50\b/g, 'bg-[#f0f7f5]')
    
    // text colors
    .replace(/\btext-teal-700\b/g, 'text-[#134d42]')
    .replace(/\btext-teal-600\b/g, 'text-[#1a6b5c]')
    .replace(/\btext-teal-500\b/g, 'text-[#2a8c78]')
    .replace(/\btext-teal-400\b/g, 'text-[#3aa892]')
    .replace(/\btext-teal-300\b/g, 'text-[#5c9088]')
    
    // border colors
    .replace(/\bborder-teal-700\b/g, 'border-[#134d42]')
    .replace(/\bborder-teal-600\b/g, 'border-[#1a6b5c]')
    .replace(/\bborder-teal-500\b/g, 'border-[#2a8c78]')
    .replace(/\bborder-teal-400\b/g, 'border-[#3aa892]')
    .replace(/\bborder-teal-200\b/g, 'border-[#c2e6de]')
    .replace(/\bborder-teal-100\b/g, 'border-[#dff2ed]')
    
    // gradients
    .replace(/\bfrom-teal-700\b/g, 'from-[#134d42]')
    .replace(/\bfrom-teal-600\b/g, 'from-[#1a6b5c]')
    .replace(/\bfrom-teal-500\b/g, 'from-[#2a8c78]')
    .replace(/\bfrom-teal-400\b/g, 'from-[#3aa892]')
    .replace(/\bfrom-teal-50\b/g, 'from-[#f0f7f5]')
    .replace(/\bto-teal-700\b/g, 'to-[#134d42]')
    .replace(/\bto-teal-600\b/g, 'to-[#1a6b5c]')
    .replace(/\bto-teal-500\b/g, 'to-[#2a8c78]')
    .replace(/\bto-teal-400\b/g, 'to-[#3aa892]')
    .replace(/\bto-teal-50\b/g, 'to-[#f0f7f5]')
    
    // hover states
    .replace(/\bhover:bg-teal-700\b/g, 'hover:bg-[#134d42]')
    .replace(/\bhover:bg-teal-600\b/g, 'hover:bg-[#1a6b5c]')
    .replace(/\bhover:bg-teal-500\b/g, 'hover:bg-[#2a8c78]')
    .replace(/\bhover:text-teal-600\b/g, 'hover:text-[#1a6b5c]')
    .replace(/\bhover:text-teal-500\b/g, 'hover:text-[#2a8c78]')
    .replace(/\bhover:border-teal-300\b/g, 'hover:border-[#5c9088]')
    .replace(/\bhover:border-teal-200\b/g, 'hover:border-[#c2e6de]')
    .replace(/\bhover:from-teal-700\b/g, 'hover:from-[#134d42]')
    .replace(/\bhover:to-teal-800\b/g, 'hover:to-[#0f3f36]')
    
    // ring and shadows
    .replace(/\bfocus:ring-teal-500\b/g, 'focus:ring-[#2a8c78]')
    .replace(/\bfocus:ring-teal-400\b/g, 'focus:ring-[#3aa892]')
    .replace(/\bshadow-teal-500\/20\b/g, 'shadow-[#2a8c78]/20')
    .replace(/\bshadow-teal-900\/30\b/g, 'shadow-[#0a2621]/30');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updated++;
  }
});
console.log('Updated ' + updated + ' files with exact arbitrary hex blocks.');
