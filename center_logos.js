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

  // Change Header justification to center for both states
  // Before: ... ${collapsed ? 'justify-center' : 'justify-between px-6'}
  // Before: ... ${isCollapsed ? 'justify-center mx-auto' : 'justify-between px-6'}
  
  content = content.replace(/'justify-between\s+px-6'/g, "'justify-center w-full'");
  
  // Also handle some slight variations or static classes if any
  content = content.replace(/justify-between\s+px-6/g, "justify-center w-full");

  fs.writeFileSync(file, content);
  console.log('Centered logo in', file);
});
