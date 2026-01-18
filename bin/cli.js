#!/usr/bin/env node

// Using jscodeshift's internal Runner is the standard way to programmatically
// run transforms, as documented in jscodeshift's own examples
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('path');
const glob = require('glob');

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

const options = {
  parser: 'tsx',
  extensions: 'ts,tsx,js,jsx',
  verbose: 2,
  ignorePattern: '**/node_modules/**',
};

// Run all transforms sequentially
async function runTransforms() {
  for (const transformPath of transformPaths) {
    const result = await jscodeshift(transformPath, paths, options);
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
