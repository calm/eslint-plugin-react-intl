/**
 * @fileoverview Plain text between html tags requires FormattedMessage component
 * @author Blaine Muri
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/missing-formatted-message"),

    RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("missing-formatted-message", rule, {

    valid: [
      {
        code: 'var x = <span><FormattedMessage id="blah" defaultMessage="blah" /></span>;',
      },
      {
        code: 'var y = <span>{variable}</span>;',
      },
      {
        code: 'var z = <a href="/subscribe">url.com/subscribe</a>'
      },
      {
        code: `<p>
              <FormattedMessage
                id="profile.manageSubscription.expired.message"
                defaultMessage="You have a free Calm account. You can purchase a Calm Premium subscription to access our full library of content and features."
              />
            </p>`
      },
      {
        code: '<div>1</div>'
      },
      {
        code: '<span>1234</span>'
      }
    ],

    invalid: [
        {
            code: "<span>Some text here</span>",
            errors: [{
                message: 'text may need translation: "Some text here"',
                type: 'Literal',
            }]
        },
        {
          code: "<span> </span>",
          options: [{ noTrailingWhitespace: true }],
          errors: [
            {
              message: 'no trailing whitespace',
              type: 'Literal'
            },
          ]
        },
        {
          code: '<a>hello</a>',
          options: [{ ignoreLinks: false }],
          errors: [
            {
              message: 'text may need translation: "hello"',
              type: 'Literal',
            }
          ]
        }
    ]
});
