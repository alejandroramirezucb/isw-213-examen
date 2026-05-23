const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const serverDir = path.join(root, 'server');
const clientDir = path.join(root, 'client');
const serverCoverageDir = path.join(serverDir, 'coverage');
const clientCoverageDir = path.join(clientDir, 'coverage');
const combinedDir = path.join(root, 'coverage');
const nycOutput = path.join(combinedDir, '.nyc_output');

const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd });

// Prepare nyc output dir
if (fs.existsSync(nycOutput)) fs.rmSync(nycOutput, { recursive: true });
fs.mkdirSync(nycOutput, { recursive: true });

// 1. Server coverage
console.log('\n=== Coverage servidor ===\n');
run('npx jest --coverage --forceExit', serverDir);

// 2. Client coverage
console.log('\n=== Coverage cliente ===\n');
run('npx jest --coverage --forceExit', clientDir);

// 3. Merge coverage JSON files in Node (avoid nyc merge + Windows path issues)
console.log('\n=== Combinando reportes ===\n');
const sources = [
  path.join(serverCoverageDir, 'coverage-final.json'),
  path.join(clientCoverageDir, 'coverage-final.json'),
];

const merged = {};
let found = 0;
for (const src of sources) {
  if (fs.existsSync(src)) {
    Object.assign(merged, JSON.parse(fs.readFileSync(src, 'utf8')));
    found++;
  } else {
    console.warn(`⚠️  No encontrado: ${src}`);
  }
}

if (found === 0) {
  console.error('Error: no hay archivos de cobertura para combinar');
  process.exit(1);
}

fs.writeFileSync(path.join(nycOutput, 'combined.json'), JSON.stringify(merged));

// 4. Generate combined HTML with nyc report
if (fs.existsSync(combinedDir)) {
  // Only remove files at root level, keep .nyc_output
  fs.readdirSync(combinedDir).forEach(f => {
    const full = path.join(combinedDir, f);
    if (f !== '.nyc_output' && fs.statSync(full).isFile()) fs.unlinkSync(full);
    else if (f !== '.nyc_output' && fs.statSync(full).isDirectory()) fs.rmSync(full, { recursive: true });
  });
}

run(
  `npx nyc report --reporter=html --reporter=text --temp-dir="${nycOutput}" --report-dir="${combinedDir}"`,
  root
);

console.log(`\n✓ Server:  server/coverage/index.html`);
console.log(`✓ Client:  client/coverage/index.html`);
console.log(`✓ Combined: coverage/index.html`);
