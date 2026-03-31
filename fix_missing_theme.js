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

  // Skip if already injected correctly
  if (content.includes('const { resolvedTheme } = useTheme();')) return;

  // Find useSidebar(); and append resolvedTheme definition safely
  content = content.replace(/useSidebar\(\);/, 'useSidebar();\n  const { resolvedTheme } = useTheme();');

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
