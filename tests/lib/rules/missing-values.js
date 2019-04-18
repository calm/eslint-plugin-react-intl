/**
 * @fileoverview Plain text between html tags requires FormattedMessage component
 * @author Blaine Muri
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/missing-values"),

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
        code: '<FormattedMessage id="blah" defaultMessage="hello, {name}" values={{ name: "John" }} />',
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="{number} {number, plural, one {Day} other {Days}}" values={{ number: 5 }}/>'
      },
      {
        code: `
          const message = { id: 'test', defaultMessage: 'test' };
          <FormattedMessage { ...message } />
        `
      }
    ],

    invalid: [
      {
        code: '<FormattedMessage id="blah" defaultMessage="hello, {name}, {name2}" />',
        errors: [{
          message: 'missing values attribute',
          type: 'JSXOpeningElement',
        }]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="hello, {name}, {name2}" values={{ name: "John" }} />',
        errors: [{
          message: 'missing variable: "name2"',
          type: 'JSXOpeningElement',
        }]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="hello, {world}" values="world" />',
        errors: [{
          message: 'values attribute must be type object',
          type: 'JSXOpeningElement'
        }]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="hello, {name}, {name2}" values={{}} />',
        errors: [
          {
            message: 'missing variable: "name"',
            type: 'JSXOpeningElement',
          },
          {
            message: 'missing variable: "name2"',
            type: 'JSXOpeningElement',
          }
        ]
      },
      {
        code: '<FormattedMessage id="blah" defaultMessage="hello, {{name}" values={{ name: "John" }} />',
        errors: [{
          message: 'mismatched curly braces',
          type: 'JSXOpeningElement',
        }]
      }
    ]
});
