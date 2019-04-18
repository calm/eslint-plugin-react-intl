/**
 * @fileoverview FormattedMessage must have defaultMessage and id attributes
 * @author Blaine Muri
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var hasLogged = false;

module.exports = {
    meta: {
        docs: {
            description: "FormattedMessage must have defaultMessage and id attributes",
            category: "Intl",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
          {
              "type": "object",
              "properties": {
                  "noTrailingWhitespace": {
                    "type": "boolean"
                  },
                  "noSpreadOperator": {
                    "type": "boolean"
                  },
                  "requireDescription": {
                    "type": "boolean"
                  }
              },
              "additionalProperties": false
          }
        ]
    },

    create: function(context) {
      const noWhitespace = context.options[0] ? context.options[0].noTrailingWhitespace : true;
      const noSpreadOperator = context.options[0] ? context.options[0].noSpreadOperator : true;
      const requireDescription = context.options[0] ? context.options[0].requireDescription : false; 

      const getAttributes = (node) => {
        if (node.type === 'JSXSpreadAttribute') {
          return null;
        } else {
          return node.name.name;
        }
      }

      const usesSpreadOperator = (node) => {
        let hasSpread = false;
        if (node.attributes && node.attributes.length > 0) {
          node.attributes.forEach(attribute => {
            if (attribute.type === 'JSXSpreadAttribute') {
              hasSpread = true;
            }
          })
        }
        return hasSpread;
      }

      return {
        JSXOpeningElement: function(node) {
          if (node.name.name === 'FormattedMessage') {
            if (usesSpreadOperator(node)) {
              if (noSpreadOperator) {
                // report error, no spread operator allowed (can't lint the value with the AST)
                context.report({
                  node: node,
                  message: "don't use spread operator",
                });
                return;
              } else {
                return;
              }
            }

            const attributeNames = node.attributes.map(getAttributes);
            // Check that it has the required attributes
            if (!attributeNames.includes('id')) {
              context.report({
                node: node,
                message: 'missing attribute: id',
              })
            }
            if (!attributeNames.includes('defaultMessage')) {
              context.report({
                node: node,
                message: 'missing attribute: defaultMessage',
              })
            }

            if (requireDescription && !attributeNames.includes('description')) {
              context.report({
                node: node,
                message: 'missing attribute: description',
              })
            }

            // Check to see that the attributes aren't empty
            if (node.attributes && node.attributes.length > 0) {
              node.attributes.forEach(attribute => {
                const type = attribute.name.name;
                if (type === 'id' || type === 'defaultMessage') {
                  if (!attribute.value.value) {
                    context.report({
                      node: node,
                      message: `empty attribute: ${type}`,
                    })
                  }
                  if (noWhitespace) {
                    if (attribute.value.value.startsWith(' ') || attribute.value.value.endsWith(' ')) {
                      context.report({
                        node: attribute.value,
                        message: 'no trailing whitespace',
                      })
                    }
                  }
                }
              })
            }
          }
        },
      };
    }
};
