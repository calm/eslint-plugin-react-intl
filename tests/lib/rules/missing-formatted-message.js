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
      },
      {
        code: '<div>-<FormattedMessage id="blah" defaultMessage="hello"/></div>'
      },
      {
        code: '<track src="subtitles_en.vtt" label={formatMessage(messages.hello)} kind="subtitles" srclang="en" />',
        options: [{ enforceLabels: true }],
      },
      {
        code: '<track src="subtitles_en.vtt" kind="subtitles" srclang="en" label={someVar} />',
        options: [{ enforceLabels: true }],
      },
      {
        code: '<track src="subtitles_en.vtt" label="hello world" kind="subtitles" srclang="en" />',
      },
      {
        code: '<img alt="hello world" />',
      },
      {
        code: '<img src="someSource" alt={formatMessage(messages.helloWorld)} />',
        options: [{ enforceImageAlts: true }],
      },
      {
        code: '<img src="someSource" alt="" />',
        options: [{ enforceImageAlts: true }],
      },
      {
        code: `<Checkbox value="checkedA" inputProps={{ 'aria-label': 'Checkbox A' }} />`,
      },
      {
        code: `<Checkbox value="checkedA" inputProps={{ 'aria-label': formatMessage(messages.checkboxLabel) }} />`,
        options: [{ enforceInputProps: true, enforceImageAlts: true,  }],
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
        },
        {
          code: `
            <div>
              <span><FormattedMessage id="test" defaultMessage="hello" /></span>
              Extra Text
            </div>
          `,
          errors: [
            {
              message: 'text may need translation: "\n              Extra Text\n            "',
              type: 'Literal',
            }
          ]
        },
        {
          code: `
          <div>
            hello
            <br />
            <FormattedMessage
              id="subscribe.loadingText.calmIsLoading"
              defaultMessage="Calm is loading."
            />
          </div>
          `,
          errors: [
            {
              message: 'text may need translation: "\n            hello\n            "',
              type: 'Literal',
            }
          ]
        },
        {
          code: '<track src="subtitles_en.vtt" label="hello world" kind="subtitles" srclang="en" />',
          options: [{ enforceLabels: true }],
          errors: [
            {
              message: 'attribute may need translation: "hello world"',
              type: 'JSXAttribute',
            }
          ]
        },
        {
          code: '<img src="someSource" alt="take a deep breath" />',
          options: [{ enforceImageAlts: true }],
          errors: [
            {
              message: 'attribute may need translation: "take a deep breath"',
              type: 'JSXAttribute',
            }
          ]
        },
        {
          code: `<Checkbox value="checkedA" inputProps={{ 'aria-label': 'Checkbox A' }} />`,
          options: [{ enforceInputProps: true, enforceImageAlts: true,  }],
          errors: [
            {
              message: 'attribute may need translation: "Checkbox A"',
              type: 'Property',
            }
          ]
        }
    ]
});
