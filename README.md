# JQuery Validation remote element patch

A quick and dirty patch for enabling elements that are outside `<form>` elements, but linked via the `form` HTML attribute, to still trigger JQuery Validation.

This is a known issue and there is a PR aimed at fixing this in the works:
https://github.com/jquery-validation/jquery-validation/pull/2521

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
- [Notes](#notes)
- [License](#license)

## Installation

```shell
npm i jquery-validation-remote-element-patch
```

## Usage

Import using CommonJS or ESM:

```js
// ESM
import { patch } from 'jquery-validation-remote-element-patch';

// CommonJS
const { patch } = require('jquery-validation-remote-element-patch');
```

Apply the patch:

```js
const element = document.querySelector('.btn');

patch(element);
```

Apply the patch with optional arguments:

```js
const element = document.querySelector('.btn');
const controller = new AbortController();

patch(element, {
    onInvalid: ({element, form, $validator}) => {
        // Called after the form fails validation.

        // element - The that triggered validation.
        // form - The form that failed validation.
        // $validator - The JQuery Validation instance for the form.
    },
    signal: controller.signal, // An `AbortSignal` that can be used to undo the patch.
});

// Undo later
controller.abort();
```

## Notes

It is also valid to have the remote element inside a `<fieldset>`, which has a `form` attribute rather than the element itself.

```html
<fieldset form="formId">
    <input type="submit" />
</fieldset>
```

## License

Published under the [MIT License](./LICENCE).