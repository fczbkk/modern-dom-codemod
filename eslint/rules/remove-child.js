const { getWrappedText } = require('../utils');

function isRemoveChildCall(node) {
  return (
    node.callee &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'removeChild' &&
    !node.callee.computed &&
    !node.callee.optional
  );
}

function isSupportedArgument(arg) {
  return arg && arg.type !== 'SpreadElement';
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer child.remove() over parent.removeChild(child)',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferRemove: 'Use child.remove() instead of parent.removeChild(child).',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      CallExpression(node) {
        if (!isRemoveChildCall(node) || node.arguments.length !== 1) {
          return;
        }

        const child = node.arguments[0];
        if (!isSupportedArgument(child)) {
          return;
        }

        context.report({
          node,
          messageId: 'preferRemove',
          fix(fixer) {
            return fixer.replaceText(node, `${getWrappedText(child, sourceCode)}.remove()`);
          },
        });
      },
    };
  },
};
