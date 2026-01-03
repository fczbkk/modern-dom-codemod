const { RuleTester } = require('eslint');
const plugin = require('../eslint');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('remove-child', plugin.rules['remove-child'], {
  valid: [
    'parent.removeChild(child, other);',
    'parent.removeChild(...args);',
    'parent.remove(child);',
  ],
  invalid: [
    {
      code: 'parent.removeChild(child);',
      output: 'child.remove();',
      errors: [{ messageId: 'preferRemove' }],
    },
    {
      code: 'node.removeChild(condition ? a : b);',
      output: '(condition ? a : b).remove();',
      errors: [{ messageId: 'preferRemove' }],
    },
  ],
});

ruleTester.run('replace-child', plugin.rules['replace-child'], {
  valid: [
    'parent.replaceChild(newNode, oldNode);',
    'oldNode.parentNode.replaceChild(newNode, otherOldNode);',
    'oldNode.parentNode.replaceChild(...args);',
  ],
  invalid: [
    {
      code: 'oldNode.parentNode.replaceChild(newNode, oldNode);',
      output: 'oldNode.replaceWith(newNode);',
      errors: [{ messageId: 'preferReplaceWith' }],
    },
    {
      code: 'list[index].parentNode.replaceChild(createNode(), list[index]);',
      output: 'list[index].replaceWith(createNode());',
      errors: [{ messageId: 'preferReplaceWith' }],
    },
  ],
});

ruleTester.run('insert-before', plugin.rules['insert-before'], {
  valid: [
    'parent.insertBefore(newNode);',
    'parent.insertBefore(...args);',
  ],
  invalid: [
    {
      code: 'parent.insertBefore(newNode, referenceNode);',
      output: 'referenceNode.before(newNode);',
      errors: [{ messageId: 'preferBefore' }],
    },
    {
      code: 'root.insertBefore(node, condition ? a : b);',
      output: '(condition ? a : b).before(node);',
      errors: [{ messageId: 'preferBefore' }],
    },
  ],
});
