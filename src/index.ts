/// <reference types="jquery" />
/// <reference types="jquery.validation" />

/**
 * A quick and dirty patch for enabling elements that are outside `<form>` elements,
 * but linked via the `form` HTML attribute, to still trigger JQuery Validation.
 *
 * @remarks
 * This is a known issue and there is a PR aimed at fixing this in the works:
 * {@link https://github.com/jquery-validation/jquery-validation/pull/2521}
 *
 * @packageDocumentation
 */

/**
 * An optional configuration object for `patch`.
 *
 * @public
 */
interface PatchOptions {
    /**
     * Function to call if a form fails validation.
     *
     * @param event - The event object related to the remote element.
     * @param form - The form that failed validation.
     * @param $validator - The JQuery Validator instance for the form.
     */
    onInvalid?: (
        event: Event,
        form: HTMLFormElement,
        $validator: JQueryValidation.Validator,
    ) => void;
    /**
     * An `AbortSignal` that can be used to undo the patch.
     */
    signal?: AbortSignal;
}

/**
 * Patch JQuery Validation for a remote element linked via the `form` attribute.
 *
 * @param options - An optional configuration object.
 *
 * @public
 */
function patch(
    element: HTMLButtonElement | HTMLInputElement | HTMLFieldSetElement,
    options?: PatchOptions,
): void {
    const { onInvalid, signal } = { ...options };
    const form = element.form;

    // Bail out if we need to.
    if (signal?.aborted || !form) return;

    if (element instanceof HTMLFieldSetElement) {
        // Element is a field set, so call this function recursively for each nested
        // input or button element that would trigger a form submit event.

        for (const child of element.querySelectorAll<HTMLButtonElement | HTMLInputElement>(
            'input[type="submit"], button:not([type="button"])',
        )) {
            patch(child, options);
        }
    } else {
        // Element is a button or input, so grab the validator instance, and set up
        // an event listener so we can programmatically trigger validation.

        const $validator = $(form).data('validator') as JQueryValidation.Validator;

        element.addEventListener(
            'click',
            (event) => {
                event.preventDefault();

                if ($validator.form()) {
                    form.submit();
                } else {
                    $validator.focusInvalid();
                    onInvalid?.(event, form, $validator);
                }
            },
            { ...(signal ? { signal } : {}) },
        );
    }
}

export { patch, type PatchOptions };
