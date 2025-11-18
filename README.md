# JQuery Validation remote element patch

A quick and dirty patch for enabling elements that are outside `<form>` elements, but linked via the `form` HTML attribute, to still trigger JQuery Validation.

This is a known issue and there is a PR aimed at fixing this in the works:
https://github.com/jquery-validation/jquery-validation/pull/2521

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```shell
npm i jquery-validation-remote-element-patch
```

## Usage

Import using CommonJS or ESM:

```ts
// ESM
import { patch } from 'jquery-validation-remote-element-patch';

// CommonJS
const { patch } = require('jquery-validation-remote-element-patch');
```

Apply the patch:

```ts
const element = document.querySelector('.remote');

patch(element);
```

Apply the patch with optional arguments:

```ts
const element = document.querySelector('.remote');
const controller = new AbortController();

patch(element, {
    onInvalid: (event, form, $validator) => {
        // Called after the form fails validation.

        // event - The event object related to the remote element.
        // form - The form that failed validation.
        // $validator - The JQuery Validator instance for the form.
    },
    signal: controller.signal, // An `AbortSignal` that can be used to undo the patch.
});

// Undo later
controller.abort();
```

## License

Published under the [MIT License](./LICENCE).