/**
 * @fileoverview FormattedMessage must have values set for formatted strings
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
            description: "FormattedMessage must have values for set for formatted strings",
            category: "Intl",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
    },

    create: function(context) {
      const variableRegex = /\{([^}]+)\}/g;

      const getMatches = (message, node) => {
        if (!message) return matches;

        const matches = [];
        let isVariable = false;
        let numBrackets = 0;
        let startIndex;

        for (var i = 0; i < message.length; i++) {
          if (message.charAt(i) === '{') {
            if (numBrackets === 0) {
              startIndex = i;
            }
            numBrackets = numBrackets + 1;
            if (!isVariable) {
              isVariable = true;
            }
          } else if (message.charAt(i) === '}') {
            numBrackets = numBrackets - 1;
            if (numBrackets === 0 && isVariable) {
              isVariable = false;
              matches.push(message.slice(startIndex + 1, i));
            }
          }
        }

        if (numBrackets !== 0) {
          context.report({
            node: node,
            message: 'mismatched curly braces',
          })
        }

        return matches;
      }

      return {
        JSXOpeningElement: function(node) {
          if (node.name.name === 'FormattedMessage') {

            // Check to see that the attributes aren't empty
            if (node.attributes && node.attributes.length > 0) {
              node.attributes.forEach(attribute => {
                if (attribute.type !== 'JSXAttribute') {
                  return;
                }
                const type = attribute.name.name;
                if (type === 'defaultMessage') {
                  if (attribute.value.value) {
                    const matches = getMatches(attribute.value.value, node)
                    if (matches.length > 0) {
                      const valuesAttribute = node.attributes.find(attribute => {
                        return attribute.name.name === 'values';
                      })
                      if (!valuesAttribute) {
                        context.report({
                          node: node,
                          message: 'missing values attribute'
                        })
                      } else {
                        if (valuesAttribute.value.type !== 'JSXExpressionContainer') {
                          // TODO: Write a test for this case
                          context.report({
                            node: node,
                            message: 'values attribute must be type object',
                          })
                        } else {
                          const { properties } = valuesAttribute.value.expression;
                          const formattedProperties = properties.map(property => property.key.name);
                          matches.map(match => {
                            const formattedMatch = match.split(',')[0];
                            if (!formattedProperties.includes(formattedMatch)) {
                              context.report({
                                node: node,
                                message: `missing variable: "${formattedMatch}"`,
                              })
                            }
                          })
                        }
                      }
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
