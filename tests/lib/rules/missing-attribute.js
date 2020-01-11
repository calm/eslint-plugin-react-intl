/**
 * @fileoverview Plain text between html tags requires FormattedMessage component
 * @author Blaine Muri
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/missing-attribute"),

    RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  }
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("missing-attribute", rule, {

    valid: [
      {
        code: '<FormattedMessage id="blah" defaultMessage="blah" />',
      },
      {
        code: '<a>blarg</a>',
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="has whitespace " />',
        options: [{ noTrailingWhitespace: false }]
      },
      {
        code: `
          const message = { id: 'user.name', defaultMessage: 'Username'};
          <FormattedMessage { ...message } />
        `,
        options: [{ noSpreadOperator: false }]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="has description enforced" description="description" />',
        options: [{ requireDescription: true }]
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';
          import x from 'y';

          const messages = defineMessages({
            someId: {
              id: 'hello',
              defaultMessage: 'world',
            }
          });
        `,
        options: [{ formatDefineMessages: true }]
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';
          import x from 'y';

          const messages = defineMessages({
            someId: (
              <FormattedMessage id="hello" defaultMessage="world" />
            )
          });
        `
      },
      {
        code: '<FormattedMessage id={`${someVar} : button`} defaultMessage="hello world" />',
        options: [{ requireIdAsString: false }],
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';

          const messages = defineMessages({
            someId: {
              id: \`\${someVar} : button\`,
              defaultMessage: 'world',
            }
          });
        `,
        options: [{ requireIdAsString: false, formatDefineMessages: true }],
      },
      {
        code: `<FormattedMessage id={someVar} />`,
        options: [{ requireDefaultMessage: false, requireIdAsString: false }],
      },
      {
        code: `<FormattedMessage id="blah" />`,
        options: [{ requireDefaultMessage: false }],
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';

          const messages = defineMessages({
            someId: {
              id: 'hello',
            }
          });
        `,
        options: [{ requireDefaultMessage: false, formatDefineMessages: true }],
      },
    ],

    invalid: [
      {
        code: '<FormattedMessage id="blah" defautlMessage="blah" />',
        errors: [{
          message: 'missing attribute: defaultMessage',
          type: 'JSXOpeningElement',
        }]
      },
      {
        code: '<FormattedMessage />',
        errors: [
          {
            message: 'missing attribute: id',
            type: 'JSXOpeningElement'
          },
          {
            message: 'missing attribute: defaultMessage',
            type: 'JSXOpeningElement',
          },
        ]
      },
      {
        code: '<FormattedMessage ib="blah" defaultMessage="hello" />',
        errors: [{
          message: 'missing attribute: id',
          type: 'JSXOpeningElement',
        }]
      },
      {
        code: '<FormattedMessage id="" defaultMessage="hello" />',
        errors: [{
          message: 'empty attribute: id',
          type: 'JSXOpeningElement',
        }]
      },
      {
        code: '<FormattedMessage defaultMessage="" />',
        errors: [
          {
            message: 'missing attribute: id',
            type: 'JSXOpeningElement',
          },
          {
            message: 'empty attribute: defaultMessage',
            type: 'JSXOpeningElement',
          }
        ]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="trailing whitespace " />',
        errors: [{
          message: 'no trailing whitespace',
          type: 'Literal',
        }]
      },
      {
        code: `
          const message = { id: 'user.name', defaultMessage: 'Username'};
          <FormattedMessage { ...message } />
        `,
        errors: [{
          message: "don't use spread operator",
          type: 'JSXOpeningElement',
        }]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="blah" />',
        options: [{ requireDescription: true }],
        errors: [{
          message: 'missing attribute: description',
          type: 'JSXOpeningElement'
        }]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage={{ a: "hello" }} />',
        errors: [{
          message: 'intl attributes must be strings',
          type: 'JSXExpressionContainer'
        }]
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';
          import x from 'y';

          const messages = defineMessages({
            someId: {
              id: 'hello',
              defaultMessage: 'world',
            }
          });
        `,
        options: [{ formatDefineMessages: true, requireDescription: true }],
        errors: [{
          message: 'missing attribute: description',
          type: 'Property'
        }]
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';
          import x from 'y';

          const messages = defineMessages({
            someId: {
              id: 'hello',
            },
            someOtherId: {
              defaultMessage: 'fooBar',
            },
          });
        `,
        options: [{ formatDefineMessages: true }],
        errors: [
          {
            message: 'missing attribute: defaultMessage',
            type: 'Property'
          },
          {
            message: 'missing attribute: id',
            type: 'Property'
          }
        ]
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';

          const messages = defineMessages({
            someId: {
              id: \`\${someVar} : button\`,
              defaultMessage: 'world',
            }
          });
        `,
        options: [{ formatDefineMessages: true }],
        errors: [
          {
            message: 'intl attributes must be strings',
            type: 'Property',
          }
        ]
      },
      {
        code: `<FormattedMessage id={someVar} />`,
        options: [{ requireDefaultMessage: false }],
        errors: [
          {
            message: 'intl attributes must be strings',
            type: 'JSXExpressionContainer',
          }
        ]
      },
      {
        code: `<FormattedMessage id="blah" />`,
        errors: [
          {
            message: 'missing attribute: defaultMessage',
            type: 'JSXOpeningElement',
          }
        ]
      },
      {
        code: `
          import { defineMessages, FormattedMessage } from 'react-intl';

          const messages = defineMessages({
            someId: {
              id: 'hello',
            }
          });
        `,
        options: [{ formatDefineMessages: true }],
        errors: [
          {
            message: 'missing attribute: defaultMessage',
            type: 'Property',
          }
        ]
      }
    ]
});
