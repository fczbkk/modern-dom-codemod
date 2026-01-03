const { getWrappedText, nodesAreEquivalent } = require('../utils');

function isReplaceChildCall(node) {
  return (
    node.callee &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'replaceChild' &&
    !node.callee.computed &&
    !node.callee.optional
  );
}

function getParentNodeObject(node) {
  const parentAccess = node.callee && node.callee.object;
  if (
    parentAccess &&
    parentAccess.type === 'MemberExpression' &&
    parentAccess.property &&
    parentAccess.property.type === 'Identifier' &&
    parentAccess.property.name === 'parentNode' &&
    !parentAccess.computed &&
    !parentAccess.optional
  ) {
    return parentAccess.object;
  }

  return null;
}

function isSupportedArgument(arg) {
  return arg && arg.type !== 'SpreadElement';
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer oldElement.replaceWith(newElement) over oldElement.parentNode.replaceChild(newElement, oldElement)',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferReplaceWith:
        'Use oldElement.replaceWith(newElement) instead of oldElement.parentNode.replaceChild(newElement, oldElement).',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      CallExpression(node) {
        if (!isReplaceChildCall(node) || node.arguments.length !== 2) {
          return;
        }

        const [newElement, oldElement] = node.arguments;
        if (!isSupportedArgument(newElement) || !isSupportedArgument(oldElement)) {
          return;
        }

        const parentNodeObject = getParentNodeObject(node);
        if (!parentNodeObject || !nodesAreEquivalent(parentNodeObject, oldElement, sourceCode)) {
          return;
        }

        context.report({
          node,
          messageId: 'preferReplaceWith',
          fix(fixer) {
            const oldElementText = getWrappedText(oldElement, sourceCode);
            const newElementText = sourceCode.getText(newElement);
            return fixer.replaceText(node, `${oldElementText}.replaceWith(${newElementText})`);
          },
        });
      },
    };
  },
};
