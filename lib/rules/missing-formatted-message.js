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
            recommended: false
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
                  }
              },
              "additionalProperties": false
          }
        ]
    },

    create: function(context) {
      const noWhitespace = context.options[0] ? context.options[0].noTrailingWhitespace : true;
      const ignoreLinks = context.options[0] ? context.options[0].ignoreLinks : true;
      const enforceImageAlts = context.options[0] ? context.options[0].enforceImageAlts : false;
      const enforceLabels = context.options[0] ? context.options[0].enforceLabels : false;

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

      function hasAttributeOfType(node, attrTypes) {
        if (attrTypes.length === 0) return;
        let attrNode;
        if (node && node.openingElement && node.openingElement.attributes) {
          node.openingElement.attributes.forEach((attr) => {
            if (attr.name && attrTypes.includes(attr.name.name)) {
              if (attr.value && (attr.value.type === 'Literal' || attr.value.type === 'JSXText')) {
                attrNode = attr;
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
          if (enforceLabels) {
            attrTypes.push('label');
            attrTypes.push('aria-label');
          }
          if (enforceImageAlts) {
            attrTypes.push('alt');
          }
          const attrNode = hasAttributeOfType(node, attrTypes);
          if (attrNode) {
            const value = attrNode.value && attrNode.value.value;
            context.report({
              node: attrNode,
              message: `attribute may need translation: "${value}"`
            })
          }

        },
      };
    }
};
