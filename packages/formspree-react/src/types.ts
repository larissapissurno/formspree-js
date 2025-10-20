import type { FieldValues, SubmissionData } from '@formspree/core';
import type { FormEvent as ReactFormEvent } from 'react';

/**
 * ExtraData values can be strings or functions that return a string, or a
 * promise that resolves to a string. Errors should be handled internally.
 * Functions can return undefined to skip this ExtraData value.
 */
export type ExtraDataValue =
  | undefined
  | string
  | (() => string)
  | (() => Promise<string>)
  | (() => undefined)
  | (() => Promise<undefined>);

export type ExtraData = {
  [key: string]: ExtraDataValue;
};

export type FormEvent = ReactFormEvent<HTMLFormElement>;

export type SubmitHandler<T extends FieldValues, R> = (
  submission: FormEvent | SubmissionData<T>
) => Promise<R>;

/**
 * FormButton types
 */
export type FormButtonField = {
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'reset'
    | 'submit'
    | 'hidden';
  label?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  value?: string;
  style?: FormFieldStyle;
  className?: string;
};

export type FormButtonStyle = {
  [key: string]: string | undefined;
};

export type FormFieldStyle = {
  label?: FormButtonStyle;
  input?: FormButtonStyle;
  [key: string]: FormButtonStyle | undefined;
};

export type FormButtonStyles = {
  /**
   * The style to apply to the button.
   * @example { backgroundColor: "gray" }
   */
  button?: FormButtonStyle;
  /**
   * The style to apply to the toplevel full screen iframe.
   */
  iframe?: FormButtonStyle;
  /**
   * The style to apply to the full screen background.
   */
  shim?: FormButtonStyle;
  /**
   * The style to apply to the container for modal, sets padding.
   */
  modalContainer?: FormButtonStyle;
  /**
   * The style to apply to the popup modal, sets shadow, border.
   */
  modal?: FormButtonStyle;
  /**
   * The style to apply to the "Contact Us" title with background.
   */
  title?: FormButtonStyle;
  /**
   * The style to apply to the description below the title.
   */
  description?: FormButtonStyle;
  /**
   * The style to apply to the modal content.
   */
  body?: FormButtonStyle;
  /**
   * The style to apply to the form container.
   */
  formContainer?: FormButtonStyle;
  /**
   * The style to apply to the form status that fills the form container with status message.
   */
  formStatus?: FormButtonStyle;
  /**
   * The style to apply to the form.
   */
  form?: FormButtonStyle;
  /**
   * The style to apply to the labels that wrap each form field.
   */
  label?: FormButtonStyle;
  /**
   * The style to apply to all form inputs.
   */
  input?: FormButtonStyle;
  /**
   * The default font family to use for all form fields.
   */
  fontFamily?: string;
};

export type FormButtonConfig = {
  /**
   * The action to send the form data to.
   * @example "https://formspree.io/f/xyz"
   */
  action: string;
  /**
   * The title of the form button.
   * @default "How can I help?"
   */
  title?: string;
  /**
   * The description of the form button that appears below the title.
   * @default "Submit your message to get help from our team."
   */
  description?: string;
  /**
   * The theme of the form button.
   * @default "minimal"
   */
  theme?: 'classic' | 'minimal';
  /**
   * The image to display on the form button. This image will be displayed instead of the default image.
   * @example "<i class='fas fa-comment' style='font-size:24px'/>"
   */
  buttonImg?: string;
  /**
   * The fields to display in the form button.
   * @example [{ type: "email", label: "Email:", name: "email", required: true, placeholder: "yourbestemail@email.com" }]
   */
  fields?: FormButtonField[];
  /**
   * The styles to apply to the form button.
   * @example { title: { backgroundColor: "gray" }, button: { backgroundColor: "gray" } }
   */
  styles?: FormButtonStyles;
  /**
   * Whether the form button should be initially visible.
   * @default false
   */
  initiallyVisible?: boolean;
  /**
   * Whether to load Google Fonts.
   * @default false
   */
  loadGoogleFonts?: boolean;
  /**
   * Path to a custom CSS file to load.
   * @example "mystyles.css"
   * @note You can copy and modify the default stylesheet by using this gist as a starting point: https://gist.github.com/colevscode/682b1f44af9fdeac9fc1ed3af77f65e2
   */
  stylesheet?: string;
  /**
   * Allows to override the default behavior when the form is submitted.
   * @param data - The form data. You can access/modify the form data using the `data` parameter.
   * @param setStatus - A function to set the status. Can accept an HTMLElement, plain text, or html text. e.g: `setStatus("<img src='static/img/myLoadingSpinner.gif'>");`
   * @param spinner - The spinner to display while the form is submitting.
   * @default
   * ```javascript
   * function onSubmit(data, setStatus, spinner) {
   *   setStatus(spinner);
   *   return data;
   * }
   * ```
   * @returns The form data to send to the server.
   */
  onSubmit?: (
    data: object,
    setStatus: (status: string) => void,
    spinner: string
  ) => object;
  /**
   * Allows to override the default behavior when the form response is received.
   * @param ok - Whether the form response was successful.
   * @param setStatus - A function to set the status. Can accept an HTMLElement, plain text, or html text. e.g: `setStatus("<div id='formspree-status'>Form submitted successfully!</div>");`
   * @param response - The response from the server.
   */
  onResponse?: (
    ok: boolean,
    setStatus: (status: string) => void,
    response: object
  ) => void;
  /**
   * The function to call when an error occurs.
   * @param error - The error that occurred.
   */
  onError?: (error: unknown) => void;
};
