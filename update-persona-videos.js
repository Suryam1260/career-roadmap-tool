const fs = require('fs');
const path = require('path');

// Video mapping for all 30 personas
const videoMapping = {
  'entry_tech_backend.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['sg5pwazWomM', 'IkYjxLHyw98', '_dl8KiU1HYY', '1bvdwgDiX1Q']
  },
  'entry_tech_frontend.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['sg5pwazWomM', 'IkYjxLHyw98', '_dl8KiU1HYY', '1bvdwgDiX1Q']
  },
  'entry_tech_fullstack.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['sg5pwazWomM', 'IkYjxLHyw98', '_dl8KiU1HYY', '1bvdwgDiX1Q']
  },
  'entry_tech_devops.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['sg5pwazWomM', 'IkYjxLHyw98', '_dl8KiU1HYY', '1bvdwgDiX1Q']
  },
  'entry_tech_data.json': {
    hero: 'EGihqTaWgJ0',
    phases: ['EGihqTaWgJ0', 'MSRSZTP0Fl8', 'IkYjxLHyw98', '1bvdwgDiX1Q']
  },
  'entry_nontech_backend.json': {
    hero: 'o5f766FvnoI',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'sg5pwazWomM', '1bvdwgDiX1Q']
  },
  'entry_nontech_frontend.json': {
    hero: 'o5f766FvnoI',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'sg5pwazWomM', '1bvdwgDiX1Q']
  },
  'entry_nontech_fullstack.json': {
    hero: 'o5f766FvnoI',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'sg5pwazWomM', '1bvdwgDiX1Q']
  },
  'entry_nontech_devops.json': {
    hero: 'o5f766FvnoI',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'sg5pwazWomM', '1bvdwgDiX1Q']
  },
  'entry_nontech_data.json': {
    hero: 'VOPEEQeph48',
    phases: ['VOPEEQeph48', 'CZyIuVQnLPQ', 'D3C9-R2cY6M', '1bvdwgDiX1Q']
  },
  'mid_tech_backend.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['_dl8KiU1HYY', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'mid_tech_frontend.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['_dl8KiU1HYY', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'mid_tech_fullstack.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['_dl8KiU1HYY', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'mid_tech_devops.json': {
    hero: 'kOHPCvM4dgI',
    phases: ['_dl8KiU1HYY', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'mid_tech_data.json': {
    hero: 'EGihqTaWgJ0',
    phases: ['EGihqTaWgJ0', 'MSRSZTP0Fl8', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'mid_nontech_backend.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'IkYjxLHyw98', '9d4zRIHbPYI']
  },
  'mid_nontech_frontend.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'IkYjxLHyw98', '9d4zRIHbPYI']
  },
  'mid_nontech_fullstack.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'IkYjxLHyw98', '9d4zRIHbPYI']
  },
  'mid_nontech_devops.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'IkYjxLHyw98', '9d4zRIHbPYI']
  },
  'mid_nontech_data.json': {
    hero: 'CZyIuVQnLPQ',
    phases: ['VOPEEQeph48', 'CZyIuVQnLPQ', 'D3C9-R2cY6M', '9d4zRIHbPYI']
  },
  'senior_tech_backend.json': {
    hero: 'ou3hyeLF4dI',
    phases: ['WTSMgkoxQyI', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_tech_frontend.json': {
    hero: 'ou3hyeLF4dI',
    phases: ['WTSMgkoxQyI', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_tech_fullstack.json': {
    hero: 'ou3hyeLF4dI',
    phases: ['WTSMgkoxQyI', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_tech_devops.json': {
    hero: 'ou3hyeLF4dI',
    phases: ['WTSMgkoxQyI', 'DXWAqGiVgkU', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_tech_data.json': {
    hero: 'EGihqTaWgJ0',
    phases: ['EGihqTaWgJ0', 'MSRSZTP0Fl8', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_nontech_backend.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_nontech_frontend.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_nontech_fullstack.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_nontech_devops.json': {
    hero: 'z9gDWPam3-o',
    phases: ['o5f766FvnoI', 'D3C9-R2cY6M', 'o39hGS4ef6E', '9d4zRIHbPYI']
  },
  'senior_nontech_data.json': {
    hero: 'CZyIuVQnLPQ',
    phases: ['VOPEEQeph48', 'MSRSZTP0Fl8', 'D3C9-R2cY6M', '9d4zRIHbPYI']
  }
};

const personasDir = path.join(__dirname, 'frontend', 'public', 'personas', 'complete');

// Convert YouTube video ID to embed URL
function toEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

// Update a single persona file
function updatePersonaFile(filename) {
  const filePath = path.join(personasDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return false;
  }

  // Read the persona file
  const personaData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Get video mapping for this persona
  const mapping = videoMapping[filename];
  if (!mapping) {
    console.log(`⚠️  No mapping found for: ${filename}`);
    return false;
  }

  // Update hero video
  if (personaData.hero) {
    personaData.hero.videoUrl = toEmbedUrl(mapping.hero);
  }

  // Update learning path phase videos
  if (personaData.learningPath && personaData.learningPath.phases) {
    personaData.learningPath.phases.forEach((phase, index) => {
      if (mapping.phases[index]) {
        phase.videoUrl = toEmbedUrl(mapping.phases[index]);
      }
    });
  }

  // Write updated data back to file
  fs.writeFileSync(filePath, JSON.stringify(personaData, null, 2), 'utf8');
  console.log(`✅ Updated: ${filename}`);
  return true;
}

// Main execution
console.log('🚀 Starting persona video update...\n');

let successCount = 0;
let failCount = 0;

Object.keys(videoMapping).forEach(filename => {
  if (updatePersonaFile(filename)) {
    successCount++;
  } else {
    failCount++;
  }
});

console.log('\n📊 Update Summary:');
console.log(`   ✅ Successfully updated: ${successCount} personas`);
console.log(`   ❌ Failed: ${failCount} personas`);
console.log(`   📹 Total videos updated: ${successCount * 5} video URLs`);
console.log('\n✨ Video mapping complete!');
