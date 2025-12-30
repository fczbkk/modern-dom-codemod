const transform = require('../transforms/replace-child');
const { defineInlineTest } = require('jscodeshift/dist/testUtils');

describe('replace-child transform', () => {
  defineInlineTest(
    transform,
    {},
    'oldElement.parentNode.replaceChild(newElement, oldElement);',
    'oldElement.replaceWith(newElement);',
    'transforms replaceChild to replaceWith()'
  );

  defineInlineTest(
    transform,
    {},
    'const oldEl = document.getElementById("old");\nconst newEl = document.createElement("div");\noldEl.parentNode.replaceChild(newEl, oldEl);',
    'const oldEl = document.getElementById("old");\nconst newEl = document.createElement("div");\noldEl.replaceWith(newEl);',
    'transforms replaceChild with variables'
  );

  defineInlineTest(
    transform,
    {},
    'element.parentNode.replaceChild(document.createElement("span"), element);',
    'element.replaceWith(document.createElement("span"));',
    'transforms replaceChild with inline createElement'
  );

  defineInlineTest(
    transform,
    {},
    'node.firstChild.parentNode.replaceChild(newNode, node.firstChild);',
    'node.firstChild.replaceWith(newNode);',
    'transforms replaceChild with nested property access'
  );

  defineInlineTest(
    transform,
    {},
    'const x = 5;\nconst y = 10;',
    'const x = 5;\nconst y = 10;',
    'does not modify code without replaceChild'
  );

  defineInlineTest(
    transform,
    {},
    'parent.replaceChild(newElement, oldElement);',
    'parent.replaceChild(newElement, oldElement);',
    'does not transform replaceChild when parent is not oldElement.parentNode'
  );

  defineInlineTest(
    transform,
    {},
    'differentElement.parentNode.replaceChild(newElement, oldElement);',
    'differentElement.parentNode.replaceChild(newElement, oldElement);',
    'does not transform when parentNode is accessed on different element'
  );
});
