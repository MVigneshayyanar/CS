const fs = require('fs');

const sidebars = [
  'c:/CS/client/src/components/Sidebar.jsx',
  'c:/CS/client/src/components/God/SuperAdminSidebar.jsx',
  'c:/CS/client/src/components/God/GodSidebar.jsx',
  'c:/CS/client/src/components/Faculty/FacultySidebar.jsx',
  'c:/CS/client/src/components/Admin/AdminSidebar.jsx'
];

sidebars.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Find the iconJpeg circle and make it pop
  // Original: style={{ background: 'var(--sidebar-logo-bg)' }}
  // and className="h-full w-full object-cover"
  
  content = content.replace(/style=\{\{ background: 'var\(--sidebar-logo-bg\)' \}\}/g, "style={{ background: '#ffffff' }}");
  content = content.replace(/className="h-full w-full object-cover"/g, 'className="h-full w-full object-contain p-1"');

  fs.writeFileSync(file, content);
  console.log('Improved logo visibility in', file);
});
