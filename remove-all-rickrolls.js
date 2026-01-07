const fs = require('fs');
const path = require('path');

const personasDir = path.join(__dirname, 'frontend', 'public', 'personas');
const RICKROLL_ID = 'dQw4w9WgXcQ';
const REPLACEMENT_ID = 'kOHPCvM4dgI'; // "Level up your career in Dream Companies" - general motivational video

// Recursively find all JSON files
function findAllJsonFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(findAllJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });

  return results;
}

// Replace rickroll in a file
function replaceRickroll(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Replace all occurrences of rickroll video ID
    content = content.replace(new RegExp(RICKROLL_ID, 'g'), REPLACEMENT_ID);

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      const count = (originalContent.match(new RegExp(RICKROLL_ID, 'g')) || []).length;
      console.log(`✅ ${path.relative(personasDir, filePath)} - Replaced ${count} rickroll(s)`);
      return count;
    } else {
      return 0;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Main execution
console.log('🔍 Searching for all rickroll videos...\n');

const allJsonFiles = findAllJsonFiles(personasDir);
let totalFiles = 0;
let totalReplacements = 0;

allJsonFiles.forEach(filePath => {
  const count = replaceRickroll(filePath);
  if (count > 0) {
    totalFiles++;
    totalReplacements += count;
  }
});

console.log('\n📊 Rickroll Removal Summary:');
console.log(`   📁 Files processed: ${allJsonFiles.length}`);
console.log(`   ✅ Files with rickrolls removed: ${totalFiles}`);
console.log(`   🎬 Total rickroll videos replaced: ${totalReplacements}`);
console.log(`   🎯 Replaced with: "Level up your career in Dream Companies"`);
console.log('\n✨ All rickrolls have been eliminated!');
