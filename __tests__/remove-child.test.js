const transform = require('../transforms/remove-child');
const { defineInlineTest } = require('jscodeshift/dist/testUtils');

describe('remove-child transform', () => {
  defineInlineTest(
    transform,
    {},
    'parentElement.removeChild(childElement);',
    'childElement.remove();',
    'transforms removeChild to remove()'
  );

  defineInlineTest(
    transform,
    {},
    'const parent = document.getElementById("parent");\nconst child = document.getElementById("child");\nparent.removeChild(child);',
    'const parent = document.getElementById("parent");\nconst child = document.getElementById("child");\nchild.remove();',
    'transforms removeChild with variables'
  );

  defineInlineTest(
    transform,
    {},
    'document.body.removeChild(element);',
    'element.remove();',
    'transforms removeChild on document.body'
  );

  defineInlineTest(
    transform,
    {},
    'parent.removeChild(node.firstChild);',
    'node.firstChild.remove();',
    'transforms removeChild with nested property access'
  );

  defineInlineTest(
    transform,
    {},
    'const x = 5;\nconst y = 10;',
    'const x = 5;\nconst y = 10;',
    'does not modify code without removeChild'
  );
});
