import { useEffect } from 'react';
import type { FormButtonConfig } from './types';

/**
 * useFormButton hook
 * @param formActionEndpoint - The endpoint to send the form data to (e.g. https://formspree.io/f/xyz)
 * @param config - Allows to override the default configuration for the form button
 * @returns A function to destroy the form button when component unmounts
 */
export function useFormButton(
  formActionEndpoint: string,
  config: Partial<FormButtonConfig> = {}
) {
  if (typeof formbutton !== 'function') {
    throw new Error(
      'formbutton is not defined. Please make sure to load the formbutton script at the end of the <body>...</body> section of your index.html file. See https://formspree.io/formbutton for more information.'
    );
  }

  if (!formActionEndpoint) {
    throw new Error(
      'formActionEndpoint is required. Please provide the endpoint to send the form data to (e.g. https://formspree.io/f/xyz)'
    );
  }

  useEffect(() => {
    formbutton('create', {
      action: formActionEndpoint,
      title: 'How can I help?',
      fields: [
        {
          type: 'email',
          label: 'Email:',
          name: 'email',
          required: true,
          placeholder: 'yourbestemail@email.com',
        },
        {
          type: 'textarea',
          label: 'Message:',
          name: 'message',
          placeholder: "What's on your mind?",
        },
        { type: 'submit' },
      ],
      styles: {
        title: {
          backgroundColor: 'gray',
        },
        button: {
          backgroundColor: 'gray',
        },
      },
      initiallyVisible: false,
      ...config,
    });
  }, [formActionEndpoint, config]);
}
