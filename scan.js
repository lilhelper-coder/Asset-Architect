import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const ignoreDirs = ['node_modules', '.git', 'dist', '.cursor', '.local', 'attached_assets'];

console.log("=== 🔍 CRYSTAL DEEP SYSTEM SCAN ===");
console.log(`📍 Root: ${rootDir}`);

// 1. MAP FILE STRUCTURE
function scanDir(dir, depth = 0) {
    if (depth > 4) return;
    let files = [];
    try {
        files = fs.readdirSync(dir);
    } catch (e) { return; }

    for (const file of files) {
        if (ignoreDirs.includes(file)) continue;
        const fullPath = path.join(dir, file);
        let stat;
        try { stat = fs.statSync(fullPath); } catch (e) { continue; }
        
        if (stat.isDirectory()) {
            console.log(`📁 DIR:  ${path.relative(rootDir, fullPath)}`);
            scanDir(fullPath, depth + 1);
        } else {
            // Only show relevant config/source files
            if (file.match(/\.(ts|js|json|env|tsx)$/)) {
                console.log(`📄 FILE: ${path.relative(rootDir, fullPath)}`);
            }
        }
    }
}

try {
    console.log("\n--- 🗺️ FILE MAP ---");
    scanDir(rootDir);
} catch (e) {
    console.error("Scan failed:", e.message);
}

// 2. READ ENTRY POINTS
console.log("\n--- ⚙️ CONFIG CHECK ---");
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    console.log("📦 package.json scripts:", JSON.stringify(pkg.scripts, null, 2));
    console.log("📦 package.json type:", pkg.type);
} catch (e) { console.log("❌ No package.json found"); }

try {
    const tsconfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'tsconfig.json'), 'utf8'));
    console.log("VX tsconfig paths:", JSON.stringify(tsconfig.compilerOptions?.paths || {}, null, 2));
} catch (e) { console.log("❌ No tsconfig.json found"); }

console.log("\n=== ✅ SCAN COMPLETE ===");