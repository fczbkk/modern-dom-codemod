const COMPLEX_TYPES = new Set([
  'AssignmentExpression',
  'AwaitExpression',
  'BinaryExpression',
  'ConditionalExpression',
  'LogicalExpression',
  'SequenceExpression',
  'UnaryExpression',
]);

function needsParens(node) {
  if (!node) {
    return false;
  }

  return COMPLEX_TYPES.has(node.type);
}

function getWrappedText(node, sourceCode) {
  const text = sourceCode.getText(node);
  return needsParens(node) ? `(${text})` : text;
}

function nodesAreEquivalent(a, b, sourceCode) {
  if (!a || !b) {
    return false;
  }

  return sourceCode.getText(a) === sourceCode.getText(b);
}

module.exports = {
  getWrappedText,
  nodesAreEquivalent,
};
