/**
 * Transforms parentElement.insertBefore(newElement, refElement) to refElement.before(newElement)
 */
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;

  // Find all CallExpressions where the callee is a MemberExpression
  // with property name 'insertBefore'
  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: {
          type: 'Identifier',
          name: 'insertBefore'
        }
      }
    })
    .forEach(path => {
      const callExpression = path.node;

      // insertBefore takes two arguments: insertBefore(newElement, refElement)
      if (callExpression.arguments.length === 2) {
        const newElement = callExpression.arguments[0];
        const refElement = callExpression.arguments[1];

        // Create new expression: refElement.before(newElement)
        const newExpression = j.callExpression(
          j.memberExpression(
            refElement,
            j.identifier('before')
          ),
          [newElement]
        );

        // Replace the old expression with the new one
        j(path).replaceWith(newExpression);
        hasModifications = true;
      }
    });

  return hasModifications ? root.toSource() : file.source;
};
