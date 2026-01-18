# modern-dom-codemod

Codemods that transform old DOM methods into modern ones.

## Installation

You can use this tool via npx without installation:

```bash
npx modern-dom <file-pattern>
```

Or install it globally:

```bash
npm install -g modern-dom-codemod
modern-dom <file-pattern>
```

## Usage

Transform TypeScript and TypeScript React files:

```bash
npx modern-dom ./src/**/*.ts
npx modern-dom ./src/**/*.tsx
npx modern-dom './src/**/*.{ts,tsx}'
```

## Transformations

### removeChild → remove()

Transforms the old `parentElement.removeChild(childElement)` pattern to the modern `childElement.remove()` method.

**Before:**
```javascript
const parent = document.getElementById('parent');
const child = document.getElementById('child');
parent.removeChild(child);
```

**After:**
```javascript
const parent = document.getElementById('parent');
const child = document.getElementById('child');
child.remove();
```

### replaceChild → replaceWith()

Transforms the old `oldElement.parentNode.replaceChild(newElement, oldElement)` pattern to the modern `oldElement.replaceWith(newElement)` method.

**Before:**
```javascript
const oldElement = document.getElementById('old');
const newElement = document.createElement('div');
oldElement.parentNode.replaceChild(newElement, oldElement);
```

**After:**
```javascript
const oldElement = document.getElementById('old');
const newElement = document.createElement('div');
oldElement.replaceWith(newElement);
```

### insertBefore → before()

Transforms the old `parentElement.insertBefore(newElement, refElement)` pattern to the modern `refElement.before(newElement)` method.

**Before:**
```javascript
const parent = document.getElementById('parent');
const newElement = document.createElement('div');
const refElement = document.getElementById('ref');
parent.insertBefore(newElement, refElement);
```

**After:**
```javascript
const parent = document.getElementById('parent');
const newElement = document.createElement('div');
const refElement = document.getElementById('ref');
refElement.before(newElement);
```

## Supported File Types

- `.ts` - TypeScript files
- `.tsx` - TypeScript React files
- `.js` - JavaScript files
- `.jsx` - JavaScript React files

## Development

### Running Tests

```bash
npm test
```

### Running the Transform Locally

```bash
node bin/cli.js <file-pattern>
```

## License

MIT
