# @calm/eslint-plugin-react-intl

This is a plugin to ensure that Intl translations are being made correctly with [react-intl](https://www.npmjs.com/package/react-intl).
Since they should be stored in an object for translation, this disables plain
text between html tags.

The plugin is actively supported by the Calm engineering team, and contributions/concerns are welcome at https://github.com/calm/eslint-plugin-react-intl.

There are three options to enable, and we recommend enabling all of them to ensure
proper translations in all languages.

The { noTrailingWhitespace: true } option is set by default and is not necessary to declare in the rules section.
This is recommended as some languages don't have spaces between words.
Additionally, the option `ignoreLinks` is set to true by default. Depending on your
use case, you may want to disable this.

## Use Cases

#### Formatted Message validation
* Checks to make sure plain text doesn't exist within html tags (should be translated)
* `<a>` tags by default are not checked (this can be disabled)
* Numbers are ignored (they're the same in every language)
* Trailing whitespace is not allowed (this can be disabled)
* Non-alphanumeric values are ignored (such as `-`)
* Can enable enforcing label, aria-label attributes being translated (`<track label="subtitles" />`)
* Can enable enforcing alt attributes being translated (`<img alt="description" />`)
* Can enable enforcing inputProps being translated (`<Checkbox value="checkedA" inputProps={{ 'aria-label': 'Checkbox A' }} />`)
  * This is specific to some React libraries, such as MaterialUI
  * Example can be seen here: https://material-ui.com/components/checkboxes/#accessibility

#### Missing Values validation
* In defaultMessage attributes within <FormattedMessage/> components, `{variable}` declarations must be declared in the `values` attribute
* It will look over anything before a comma, allowing for FormatJS plurals
  * Ex. defaultMessage="{number} {number, plural, one {Day} other {Days}}" will resolve 1 variable as `number`

#### Missing Attribute validation
* <FormattedMessage/> components must have both `defaultMessage` and `id` attributes set
  * Calm chooses to always require these, but you can optionally disable defaultMessage with option `requireDefaultMessage : false`
* `defaultMessage` and `id` attributes cannot be empty
* Spread operator by default is not allowed
  * Spread operator can't be evaluated by eslint's AST, so translations can't be guaranteed
* `requireDescription` can optionally be set to require that all translations contain the description attribute
* Use the `formatDefineMessages: true` option in order to also check the defineMessages declaration from react-intl
  * *BE CAREFUL* - This assumes that defineMessages will always mean the react-intl method, so do not declare other defineMessages functions unless they maintain the same formatting as react-intl
* Optional `requireIdAsString: false` will allow for variables in the id field
  * *BE CAREFUL* - variables in id fields can result in duplicate strings being translated, as well as the possibility of a changed variable leading to an id without a translation associated with it

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@calm/eslint-plugin-react-intl`:

```
$ npm install @calm/eslint-plugin-react-intl --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `@calm/eslint-plugin-react-intl` globally.

## Usage

Add `@calm/react-intl` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@calm/react-intl"
    ]
}
```


Then configure the rules you want to use under the rules section.
It's recommended that you explicitly set each option.
<br />
The rules (with their default settings) are listed below.

```json
{
    "rules": {
        "@calm/react-intl/missing-formatted-message": [2,
          {
            "noTrailingWhitespace": true,
            "ignoreLinks": true,
            "enforceLabels": false,
            "enforceImageAlts": false,
            "enforceInputProps": false
          }
        ],
        "@calm/react-intl/missing-attribute": [2,
            {
                "noTrailingWhitespace": true,
                "noSpreadOperator": true,
                "requireDescription": false,
                "formatDefineMessages": false,
                "requireIdAsString": true,
                "requireDefaultMessage": true,
            }
        ],
        "@calm/react-intl/missing-values": 2
    }
}
```

## Supported Rules

* missing-formatted-message
* missing-attribute
* missing-values
