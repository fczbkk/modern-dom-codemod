/**
 * Transforms parentElement.removeChild(childElement) to childElement.remove()
 */
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;

  // Find all CallExpressions where the callee is a MemberExpression
  // with property name 'removeChild'
  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: {
          type: 'Identifier',
          name: 'removeChild'
        }
      }
    })
    .forEach(path => {
      const callExpression = path.node;
      const memberExpression = callExpression.callee;
      
      // Get the child element (first argument to removeChild)
      if (callExpression.arguments.length === 1) {
        const childElement = callExpression.arguments[0];
        
        // Create new expression: childElement.remove()
        const newExpression = j.callExpression(
          j.memberExpression(
            childElement,
            j.identifier('remove')
          ),
          []
        );
        
        // Replace the old expression with the new one
        j(path).replaceWith(newExpression);
        hasModifications = true;
      }
    });

  return hasModifications ? root.toSource() : file.source;
};
