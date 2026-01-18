#!/usr/bin/env node

// Using jscodeshift's internal Runner is the standard way to programmatically
// run transforms, as documented in jscodeshift's own examples
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');
const fs = require('fs');

const transformPaths = [
  path.join(__dirname, '../transforms/remove-child.js'),
  path.join(__dirname, '../transforms/replace-child.js'),
  path.join(__dirname, '../transforms/insert-before.js')
];
const patterns = process.argv.slice(2);

if (patterns.length === 0) {
  console.error('Usage: modern-dom <file-pattern>');
  console.error('Example: modern-dom ./src/**/*.ts');
  process.exit(1);
}

// Expand glob patterns
const paths = [];
patterns.forEach(pattern => {
  const matches = glob.sync(pattern, {
    nodir: true,
    ignore: '**/node_modules/**'
  });
  paths.push(...matches);
});

if (paths.length === 0) {
  console.error('No files found matching the provided patterns');
  process.exit(1);
}

// Filter files to only include those containing the target DOM methods
// This optimization avoids parsing files that don't need transformation
function filterRelevantFiles(filePaths) {
  if (filePaths.length === 0) return [];

  try {
    // Create a regex pattern that matches any of the DOM methods we transform
    const pattern = '\\.(insertBefore|removeChild|replaceChild)\\(';

    // Use grep to quickly filter files containing the target patterns
    // -l: print only filenames, -E: extended regex, --null: null-separated output
    const grepCommand = `grep -lE '${pattern}' ${filePaths.map(f => `'${f}'`).join(' ')} 2>/dev/null || true`;
    const result = execSync(grepCommand, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

    const relevantFiles = result.trim().split('\n').filter(f => f.length > 0);

    const skipped = filePaths.length - relevantFiles.length;
    if (skipped > 0) {
      console.log(`Skipped ${skipped} file(s) without relevant DOM method calls`);
    }

    return relevantFiles;
  } catch (error) {
    // If grep fails or is not available, fall back to processing all files
    console.warn('Warning: Could not pre-filter files with grep, processing all files');
    return filePaths;
  }
}

// Apply pre-filtering optimization
const filteredPaths = filterRelevantFiles(paths);

if (filteredPaths.length === 0) {
  console.log('No files found with insertBefore, removeChild, or replaceChild calls');
  process.exit(0);
}

const options = {
  parser: 'tsx',
  extensions: 'ts,tsx,js,jsx',
  verbose: 2,
  ignorePattern: '**/node_modules/**',
};

// Run all transforms sequentially
async function runTransforms() {
  for (const transformPath of transformPaths) {
    const result = await jscodeshift(transformPath, filteredPaths, options);
    if (result.error) {
      console.error('Transform failed:', result.error);
      process.exit(1);
    }
  }
}

runTransforms()
  .catch(err => {
    console.error('Error running transform:', err);
    process.exit(1);
  });
