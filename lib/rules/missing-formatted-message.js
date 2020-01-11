/**
 * @fileoverview Plain text between html tags requires FormattedMessage component
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
            description: "Plain text between html tags requires translated intl text",
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
                  "ignoreLinks": {
                    "type": "boolean"
                  },
                  "enforceLabels": {
                    "type": "boolean"
                  },
                  "enforceImageAlts": {
                    "type": "boolean"
                  },
                  "enforceInputProps": {
                    "type": "boolean"
                  }
              },
              "additionalProperties": false
          }
        ]
    },

    create: function(context) {
      function getDefault(option, defaultValue) {
        if (typeof option !== 'undefined') {
          return Boolean(option);
        }
        return defaultValue;
      }

      const options = context.options[0] || {};
      const noWhitespace = getDefault(options.noTrailingWhitespace, true);
      const ignoreLinks = getDefault(options.ignoreLinks, true);
      const enforceImageAlts = getDefault(options.enforceImageAlts, false);
      const enforceLabels = getDefault(options.enforceLabels, false);
      const enforceInputProps = getDefault(options.enforceInputProps, false);

      function hasChildText(node) {
        if (ignoreLinks && node.openingElement.name.name === 'a') {
          // Allow for link tags to have a non-translated url
          return null;
        }
        if (!node.children) return null;
        let childNode = null;
        for (var child of node.children) {
          if (child.type === 'Literal' || child.type === 'JSXText') {
            if (parseInt(child.value)) {
              childNode = null;
            } else {
              // Child contains any text
              if (child.value && /[a-zA-Z]/.test(child.value)) {
                childNode = child;
              }
              // Child is whitespace only (no newlines)
              // This won't catch everything, but will catch the most common single space spans
              if (child.value && child.value.includes(' ') && !child.value.includes('\n')) {
                childNode = child;
              }
            }
          }
          if (childNode) break;
        }
        return childNode;
      }

      function hasLiteralType(attr) {
        return attr.value && (attr.value.type === 'Literal' || attr.value.type === 'JSXText');
      }

      function hasNestedAttributeOfType(node, attrTypes) {
        let attrNode;
        if (node.value && node.value.expression && node.value.expression.properties) {
          node.value.expression.properties.forEach((attr) => {
            if (attr.key && attrTypes.includes(attr.key.value)) {
              if (hasLiteralType(attr)) {
                attrNode = attr;
              }
            }
          });
        }
        return attrNode;
      }

      function hasAttributeOfType(node, attrTypes) {
        if (attrTypes.length === 0) return;
        let attrNode;
        if (node && node.openingElement && node.openingElement.attributes) {
          node.openingElement.attributes.forEach((attr) => {
            if (attr.name && attrTypes.includes(attr.name.name)) {
              if (hasLiteralType(attr)) {
                attrNode = attr;
              } else if (attr.name.name === 'inputProps') {
                const nestedAttr = hasNestedAttributeOfType(attr, attrTypes);
                if (nestedAttr) {
                  attrNode = nestedAttr;
                }
              }
            }
          })
        }
        return attrNode;
      }

      return {
        JSXElement: function(node) {
          // Check for nodes with children
          const errorNode = hasChildText(node);
          if (errorNode) {
            // String is not just whitespace
            if (/[a-zA-Z]/.test(errorNode.value)) {
              context.report({
                node: errorNode,
                message: `text may need translation: "${errorNode.value}"`,
              })
            }
            // Only check for whitespace with single child, otherwise newlines will be flagged
            if (noWhitespace && node.children.length === 1) {
              if (errorNode.value.startsWith(' ') || errorNode.value.endsWith(' ')) {
                context.report({
                  node: errorNode,
                  message: 'no trailing whitespace',
                })
              }
            }
          }

          const attrTypes = [];
          // Check for a non-translated label or aria-label
          if (enforceLabels || enforceInputProps) {
            attrTypes.push('label');
            attrTypes.push('aria-label');
          }
          if (enforceImageAlts) {
            attrTypes.push('alt');
          }
          // For support with Material UI
          // https://material-ui.com/components/checkboxes/#accessibility
          if (enforceInputProps) {
            attrTypes.push('inputProps');
          }
          const attrNode = hasAttributeOfType(node, attrTypes);
          if (attrNode) {
            const value = attrNode.value && attrNode.value.value;
            if (value && value.length > 0) {
              context.report({
                node: attrNode,
                message: `attribute may need translation: "${value}"`
              })
            }
          }
        },
      };
    }
};
