/**
 * Transforms oldElement.parentNode.replaceChild(newElement, oldElement) to oldElement.replaceWith(newElement)
 */
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;

  // Find all CallExpressions where the callee is a MemberExpression
  // with property name 'replaceChild'
  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: {
          type: 'Identifier',
          name: 'replaceChild'
        }
      }
    })
    .forEach(path => {
      const callExpression = path.node;
      const memberExpression = callExpression.callee;
      
      // replaceChild takes two arguments: replaceChild(newElement, oldElement)
      if (callExpression.arguments.length === 2) {
        const newElement = callExpression.arguments[0];
        const oldElement = callExpression.arguments[1];
        
        // Check if the callee object is oldElement.parentNode
        // memberExpression.object should be a MemberExpression with property 'parentNode'
        // and the object of that should match oldElement
        if (
          memberExpression.object.type === 'MemberExpression' &&
          memberExpression.object.property.type === 'Identifier' &&
          memberExpression.object.property.name === 'parentNode'
        ) {
          const parentNodeObject = memberExpression.object.object;
          
          // Check if parentNodeObject matches oldElement
          // We need to compare AST nodes for equivalence
          if (j(parentNodeObject).toSource() === j(oldElement).toSource()) {
            // Create new expression: oldElement.replaceWith(newElement)
            const newExpression = j.callExpression(
              j.memberExpression(
                oldElement,
                j.identifier('replaceWith')
              ),
              [newElement]
            );
            
            // Replace the old expression with the new one
            j(path).replaceWith(newExpression);
            hasModifications = true;
          }
        }
      }
    });

  return hasModifications ? root.toSource() : file.source;
};
