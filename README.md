# eslint-plugin-react-intl-format

This is a plugin to ensure that Intl translations are being made correctly with [react-intl](https://www.npmjs.com/package/react-intl).
Since they should be stored in an object for translation, this disables plain
text between html tags.

There are three options to enable, and we recommend enabling all of them to ensure
proper translations in all languages.

The { noTrailingWhitespace: true } option is set by default and is not necessary to declare in the rules section.
This is recommended as some languages don't have spaces between words.
Additionally, the option `ignoreLinks` is set to true by default. Depending on your
use case, you may want to disable this.

## Use Cases

#### FormattedMessage validation
* Checks to make sure plain text doesn't exist within html tags (should be translated)
* `<a>` tags by default are not checked (this can be disabled)
* Numbers are ignored (they're the same in every language)
* Trailing whitespace is not allowed (this can be disabled)

#### Missing Values validation
* In defaultMessage attributes within <FormattedMessage/> components, `{variable}` declarations must be declared in the `values` attribute
* It will look over anything before a comma, allowing for FormatJS plurals
  * Ex. defaultMessage="{number} {number, plural, one {Day} other {Days}}" will resolve 1 variable as `number`

#### Missing Attribute validation
* <FormattedMessage/> components must have both `defaultMessage` and `id` attributes set
* `defaultMessage` and `id` attributes cannot be empty
* Spread operator by default is not allowed
  * Spread operator can't be evaluated by eslint's AST, so translations can't be guaranteed

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-react-intl-format`:

```
$ npm install eslint-plugin-react-intl-format --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-react-intl-format` globally.

## Usage

Add `react-intl-format` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "react-intl-format"
    ]
}
```


Then configure the rules you want to use under the rules section.
Currently there's just one rule: 'missing-formatted-message'.

```json
{
    "rules": {
        "react-intl-format/missing-formatted-message": [2, { "noTrailingWhitespace": true, "ignoreLinks": true }],
        "react-intl-format/missing-attribute": [2, { "noTrailingWhitespace": true, "noSpreadOperator": true }],
        "react-intl-format/missing-values": 2
    }
}
```

## Supported Rules

* missing-formatted-message
* missing-attribute
* missing-values
