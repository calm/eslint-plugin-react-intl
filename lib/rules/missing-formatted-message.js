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
                  }
              },
              "additionalProperties": false
          }
        ]
    },

    create: function(context) {
      const noWhitespace = context.options[0] ? context.options[0].noTrailingWhitespace : true;
      const ignoreLinks = context.options[0] ? context.options[0].ignoreLinks : true;

      const hasChildText = (node) => {
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
              console.log(child.value);
              // Child contains any text
              if (child.value && /[a-zA-Z]/.test(child.value)) {
                childNode = child;
              }
              // Child is whitespace only (no newlines)
              // This won't catch everything, but will catch the most common single space spans
              console.log(child);
              if (child.value && child.value.includes(' ') && !child.value.includes('\n')) {
                console.log('here');
                childNode = child;
              }
            }
          }
          if (childNode) break;
        }
        return childNode;
      }

      return {
        JSXElement: function(node) {
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
        },
      };
    }
};
