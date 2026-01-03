const { getWrappedText } = require('../utils');

function isInsertBeforeCall(node) {
  return (
    node.callee &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'insertBefore' &&
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
      description: 'Prefer ref.before(newElement) over parent.insertBefore(newElement, ref)',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferBefore: 'Use refElement.before(newElement) instead of parent.insertBefore(newElement, refElement).',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      CallExpression(node) {
        if (!isInsertBeforeCall(node) || node.arguments.length !== 2) {
          return;
        }

        const [newElement, refElement] = node.arguments;
        if (!isSupportedArgument(newElement) || !isSupportedArgument(refElement)) {
          return;
        }

        context.report({
          node,
          messageId: 'preferBefore',
          fix(fixer) {
            const referenceText = getWrappedText(refElement, sourceCode);
            const newElementText = sourceCode.getText(newElement);
            return fixer.replaceText(node, `${referenceText}.before(${newElementText})`);
          },
        });
      },
    };
  },
};
