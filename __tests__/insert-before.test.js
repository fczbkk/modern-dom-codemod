const transform = require('../transforms/insert-before');
const { defineInlineTest } = require('jscodeshift/dist/testUtils');

describe('insert-before transform', () => {
  defineInlineTest(
    transform,
    {},
    'parentElement.insertBefore(newElement, refElement);',
    'refElement.before(newElement);',
    'transforms insertBefore to before()'
  );

  defineInlineTest(
    transform,
    {},
    'const parent = document.getElementById("parent");\nconst newEl = document.createElement("div");\nconst refEl = document.getElementById("ref");\nparent.insertBefore(newEl, refEl);',
    'const parent = document.getElementById("parent");\nconst newEl = document.createElement("div");\nconst refEl = document.getElementById("ref");\nrefEl.before(newEl);',
    'transforms insertBefore with variables'
  );

  defineInlineTest(
    transform,
    {},
    'document.body.insertBefore(element, reference);',
    'reference.before(element);',
    'transforms insertBefore on document.body'
  );

  defineInlineTest(
    transform,
    {},
    'parent.insertBefore(document.createElement("span"), node.firstChild);',
    'node.firstChild.before(document.createElement("span"));',
    'transforms insertBefore with nested property access'
  );

  defineInlineTest(
    transform,
    {},
    'container.insertBefore(newNode, container.firstChild);',
    'container.firstChild.before(newNode);',
    'transforms insertBefore with parent.firstChild as reference'
  );

  defineInlineTest(
    transform,
    {},
    'const x = 5;\nconst y = 10;',
    'const x = 5;\nconst y = 10;',
    'does not modify code without insertBefore'
  );
});
