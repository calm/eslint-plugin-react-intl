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
          return false;
        }
        if (!node.children) return false;
        if (node.children.length > 1) return false;
        if (node.children[0] && node.children[0].type === 'Literal') {
          if (parseInt(node.children[0].value)) {
            return false;
          }
          return true;
        }
        return false;
      }

      return {
        JSXElement: function(node) {
          if (hasChildText(node)) {
            const childNode = node.children[0];
            // String is not just whitespace
            if (/\S/.test(childNode.value)) {
              context.report({
                node: childNode,
                message: `text may need translation: "${childNode.value}"`,
              })
            }
            if (noWhitespace) {
              if (childNode.value.startsWith(' ') || childNode.value.endsWith(' ')) {
                context.report({
                  node: childNode,
                  message: 'no trailing whitespace',
                })
              }
            }
          }
        },
      };
    }
};
