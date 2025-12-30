#!/usr/bin/env node

// Using jscodeshift's internal Runner is the standard way to programmatically
// run transforms, as documented in jscodeshift's own examples
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('path');
const glob = require('glob');

const transformPath = path.join(__dirname, '../transforms/remove-child.js');
const patterns = process.argv.slice(2);

if (patterns.length === 0) {
  console.error('Usage: modern-dom <file-pattern>');
  console.error('Example: modern-dom ./src/**/*.ts');
  process.exit(1);
}

// Expand glob patterns
const paths = [];
patterns.forEach(pattern => {
  const matches = glob.sync(pattern, { nodir: true });
  if (matches.length > 0) {
    paths.push(...matches);
  } else {
    // If no matches found, pass the pattern as-is (it might be a direct file path)
    paths.push(pattern);
  }
});

if (paths.length === 0) {
  console.error('No files found matching the provided patterns');
  process.exit(1);
}

const options = {
  parser: 'tsx',
  extensions: 'ts,tsx,js,jsx',
  verbose: 2,
};

jscodeshift(transformPath, paths, options)
  .then(result => {
    if (result.error) {
      console.error('Transform failed:', result.error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error running transform:', err);
    process.exit(1);
  });
