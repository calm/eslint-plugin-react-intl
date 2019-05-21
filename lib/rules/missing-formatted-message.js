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
        node.children.forEach((child) => {
          if (child.type === 'Literal') {
            if (parseInt(child.value)) {
              childNode = null;
            } else {
              childNode = child;
            }
          }
        });
        return childNode;
      }

      return {
        JSXElement: function(node) {
          const errorNode = hasChildText(node);
          if (errorNode) {
            // String is not just whitespace
            if (/\S/.test(errorNode.value)) {
              context.report({
                node: errorNode,
                message: `text may need translation: "${errorNode.value}"`,
              })
            }
            if (noWhitespace) {
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
