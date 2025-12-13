import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. SETUP
const rootDir = process.cwd();
const ignoreDirs = ['node_modules', '.git', 'dist', '.cursor', 'attached_assets'];
const fileTypes = ['.ts', '.tsx', '.js', '.jsx'];

// Known Node.js built-ins to ignore
const builtIns = ['fs', 'path', 'http', 'https', 'url', 'os', 'util', 'crypto', 'events', 'child_process', 'net', 'tls', 'zlib', 'stream', 'buffer', 'querystring'];

console.log("=== 🕵️ CRYSTAL DEPENDENCY HUNTER ===");

// 2. FIND ALL SOURCE FILES
function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (ignoreDirs.includes(file)) return;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath));
        } else {
            if (fileTypes.includes(path.extname(file))) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

// 3. SCAN FILES FOR IMPORTS
const allImports = new Set();
const files = getFiles(rootDir);
console.log(`Scanning ${files.length} source files...`);

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    // Regex matches: from "x", from 'x', import "x", require("x")
    const regex = /(?:from|import|require)\s*(?:\(\s*)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let pkg = match[1];
        
        // Ignore relative paths (./, ../, /)
        if (pkg.startsWith('.') || pkg.startsWith('/')) continue;
        // Ignore aliases (@/server, @shared) defined in tsconfig
        if (pkg.startsWith('@/') || pkg.startsWith('@shared') || pkg.startsWith('@server')) continue;
        // Ignore node built-ins
        if (builtIns.includes(pkg) || pkg.startsWith('node:')) continue;
        
        // Handle scoped packages (@radix-ui/react-dialog -> @radix-ui/react-dialog)
        // Handle deep imports (drizzle-orm/pg-core -> drizzle-orm)
        if (pkg.startsWith('@')) {
            const parts = pkg.split('/');
            if (parts.length >= 2) pkg = `${parts[0]}/${parts[1]}`;
        } else {
            pkg = pkg.split('/')[0];
        }
        
        allImports.add(pkg);
    }
});

// 4. CHECK PACKAGE.JSON
const pkgPath = path.join(rootDir, 'package.json');
const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const installed = new Set([
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {})
]);

// 5. CALCULATE MISSING
const missing = [...allImports].filter(i => !installed.has(i));

console.log("\n--- REPORT ---");
console.log(`Found ${allImports.size} unique imports in code.`);
console.log(`Found ${installed.size} installed packages.`);

if (missing.length > 0) {
    console.log(`\n❌ MISSING ${missing.length} PACKAGES:`);
    missing.forEach(p => console.log(` - ${p}`));
    console.log("\n👇 COPY AND RUN THIS COMMAND TO FIX ALL OF THEM 👇");
    console.log(`\nnpm install ${missing.join(' ')} --legacy-peer-deps\n`);
} else {
    console.log("\n✅ ALL DEPENDENCIES FOUND. No missing packages!");
}