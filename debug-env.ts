import fs from 'fs';
import path from 'path';

console.log('=== ENVIRONMENT DEBUG DIAGNOSTIC ===\n');

// 1. Show current working directory
console.log('📍 Current Working Directory:');
console.log(process.cwd());
console.log('');

// 2. List all files in root directory (depth 1)
console.log('📂 Files in Root Directory:');
try {
  const rootFiles = fs.readdirSync(process.cwd());
  rootFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    const stats = fs.statSync(fullPath);
    const type = stats.isDirectory() ? '[DIR]' : '[FILE]';
    console.log(`  ${type} ${file}`);
  });
} catch (error) {
  console.error('❌ Error reading directory:', error);
}
console.log('');

// 3. Check for .env files specifically
console.log('🔍 Environment File Detection:');
const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];

envFiles.forEach(filename => {
  const fullPath = path.join(process.cwd(), filename);
  try {
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${filename} EXISTS`);
      
      // Read and show first 5 characters
      const content = fs.readFileSync(fullPath, 'utf-8');
      const preview = content.substring(0, 5);
      const lineCount = content.split('\n').length;
      const charCount = content.length;
      
      console.log(`   Preview: "${preview}..."`);
      console.log(`   Stats: ${lineCount} lines, ${charCount} characters`);
      console.log(`   Full Path: ${fullPath}`);
    } else {
      console.log(`❌ ${filename} NOT FOUND`);
    }
  } catch (error) {
    console.log(`⚠️  ${filename} - Error reading:`, error);
  }
});
console.log('');

// 4. Test dotenv loading
console.log('🧪 Testing dotenv Loading:');
try {
  const dotenv = await import('dotenv');
  
  // Try loading .env
  const envResult = dotenv.config({ path: '.env' });
  console.log('.env load result:', envResult.error ? `❌ ${envResult.error.message}` : '✅ Success');
  
  // Try loading .env.local
  const envLocalResult = dotenv.config({ path: '.env.local' });
  console.log('.env.local load result:', envLocalResult.error ? `❌ ${envLocalResult.error.message}` : '✅ Success');
  
} catch (error) {
  console.error('❌ dotenv import failed:', error);
}
console.log('');

// 5. Check process.env for expected keys
console.log('🔑 Environment Variables Check:');
const expectedKeys = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'NODE_ENV',
  'PORT'
];

expectedKeys.forEach(key => {
  const exists = !!process.env[key];
  const preview = exists ? `${process.env[key]?.substring(0, 8)}...` : 'undefined';
  console.log(`  ${exists ? '✅' : '❌'} ${key}: ${preview}`);
});

console.log('\n=== DIAGNOSTIC COMPLETE ===');