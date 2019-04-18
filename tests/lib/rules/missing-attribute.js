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
      }
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
          message: 'missing attribute: description'
        }]
      }
    ]
});
