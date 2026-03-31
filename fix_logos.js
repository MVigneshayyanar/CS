const fs = require('fs');

const THEME_IMPORTS = `
import { useTheme } from "next-themes";
import iconJpeg from "../assets/icon.jpeg";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logow.png";
`;

const THEME_IMPORTS_DEEP = `
import { useTheme } from "next-themes";
import iconJpeg from "../../assets/icon.jpeg";
import logoLight from "../../assets/logo.png";
import logoDark from "../../assets/logow.png";
`;

function processSidebar(file, isDeep, collapsedVarName) {
  if (!fs.existsSync(file)) return;
  console.log('Processing:', file);
  let content = fs.readFileSync(file, 'utf8');

  // Avoid running twice
  if (content.includes('iconJpeg')) return;

  // Add imports right after 'react' or 'react-router-dom' imports
  content = content.replace(/(import.*react.*;\r?\n|import.*react-router-dom.*;\r?\n)/, `$1${isDeep ? THEME_IMPORTS_DEEP : THEME_IMPORTS}`);
  
  // Inject useTheme inside component
  const hookRegex = new RegExp(`const\\s+\\{\\s*${collapsedVarName}.*useSidebar\\(\\)`);
  content = content.replace(hookRegex, (match) => `const { resolvedTheme } = useTheme();\n  ${match}`);

  // Replace Header Block 
  // We need to find the <div ... style={{ background: 'var(--gradient-logo)' }}> ... </span>
  const headerStart = content.indexOf(`style={{ background: 'var(--gradient-logo)' }}`);
  if (headerStart === -1) return;

  // Find the exact `<div className="rounded-full...` before it
  const roundedFullStart = content.lastIndexOf('<div', headerStart);
  
  // Find where the `</span>` or `)}` for the text label ends.
  // Actually, look for `</span>\n            )}` or `</span>\n          )}`
  let spanEnd = content.indexOf(`</span>`, roundedFullStart);
  let closeBraceEnd = content.indexOf(`)}`, spanEnd); 
  if (closeBraceEnd === -1) closeBraceEnd = spanEnd + 7; // fallback

  const originalBlock = content.substring(roundedFullStart, closeBraceEnd + 2);
  
  const newBlock = `
            {${collapsedVarName} ? (
              <div 
                className={\`rounded-full flex items-center justify-center p-0.5 transform transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12\`}
                style={{ background: 'var(--gradient-logo)' }}
              >
                <div 
                  className="h-full w-full rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: 'var(--sidebar-logo-bg)' }}
                >
                  <img src={iconJpeg} alt="Logo Icon" className="h-full w-full object-cover" />
                </div>
              </div>
            ) : (
              <img 
                src={resolvedTheme === 'light' ? logoLight : logoDark} 
                alt="CodeSphere" 
                className="h-9 w-auto object-contain animate-in fade-in slide-in-from-left-2 duration-500" 
              />
            )}
  `.trim();

  content = content.replace(originalBlock, newBlock);

  // Remove `import brandLogo`
  content = content.replace(/import brandLogo from ".*logo\.svg";\r?\n?/, '');

  fs.writeFileSync(file, content);
}

// 1. Sidebar
processSidebar('c:/CS/client/src/components/Sidebar.jsx', false, 'collapsed');

// 2. Faculty
processSidebar('c:/CS/client/src/components/Faculty/FacultySidebar.jsx', true, 'collapsed');

// 3. Admin
processSidebar('c:/CS/client/src/components/Admin/AdminSidebar.jsx', true, 'isCollapsed');

// 4. God
processSidebar('c:/CS/client/src/components/God/GodSidebar.jsx', true, 'collapsed');

// 5. Super Admin
processSidebar('c:/CS/client/src/components/God/SuperAdminSidebar.jsx', true, 'collapsed');

console.log('Done Sidebars.');

// 6. LoginCard
const loginCardPath = 'c:/CS/client/src/components/Auth/LoginCard.jsx';
if (fs.existsSync(loginCardPath)) {
  let loginContent = fs.readFileSync(loginCardPath, 'utf8');
  if (!loginContent.includes('logoLight')) {
    loginContent = loginContent.replace('import logo from "@/assets/logo.svg";', THEME_IMPORTS_DEEP.replace('../../', '@/'));
    
    // Inject useTheme inside component
    loginContent = loginContent.replace('const LoginCard = () => {', 'const LoginCard = () => {\n  const { resolvedTheme } = useTheme();');
    
    // Replace <img src={logo}
    loginContent = loginContent.replace(
      '<img src={logo} alt="Lab Management Logo" className="h-12 w-auto" />',
      '<img src={resolvedTheme === \'light\' ? logoLight : logoDark} alt="Lab Management Logo" className="h-12 w-auto" />'
    );
    fs.writeFileSync(loginCardPath, loginContent);
    console.log('Fixed LoginCard.');
  }
}
