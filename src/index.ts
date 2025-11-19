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
 * An object containing information that is included in the `onInvalid` callback.
 *
 * @public
 */
interface PatchOnInvalidInfo<T extends Element> {
    /**
     * The element that triggered validation.
     */
    element: T;
    /**
     * The form that failed validation.
     */
    form: HTMLFormElement;
    /**
     * The JQuery Validation instance for the form.
     */
    $validator: JQueryValidation.Validator;
}

/**
 * An optional configuration object for `patch`.
 *
 * @public
 */
interface PatchOptions<T extends Element> {
    /**
     * Function to call if a form fails validation.
     */
    onInvalid?: (info: PatchOnInvalidInfo<T>) => void;
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
function patch<T extends HTMLButtonElement | HTMLInputElement>(
    element: T,
    options?: PatchOptions<T>,
): void {
    const { onInvalid, signal } = { ...options };

    // Wrap in a JQuery ready function to avoid race conditions.
    $(() => {
        // If the element itself doesn't have a `form` attribute, see if it has
        // an ancestor `<fieldset>` element that does, and use that instead.
        const form = element.form ?? element.closest('fieldset')?.form;

        // If there's no form, or a provided signal is aborted, bail out.
        if (signal?.aborted || !form) return;

        // Grab the validator instance for the form.
        const $validator = $(form).data('validator');

        // No validator attached, so bail out.
        if (!$validator) return;

        element.addEventListener(
            'click',
            (event) => {
                event.preventDefault();

                if ($validator.form()) {
                    form.submit();
                } else {
                    // Mimic the default behaviour of JQuery Validation.
                    $validator.focusInvalid();
                    onInvalid?.({ element, form, $validator });
                }
            },
            { ...(signal ? { signal } : {}) },
        );
    });
}

export { patch, type PatchOnInvalidInfo, type PatchOptions };
