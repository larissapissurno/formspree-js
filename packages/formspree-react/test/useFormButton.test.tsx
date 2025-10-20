import { renderHook } from '@testing-library/react';
import React from 'react';
import { useFormButton } from '../src/useFormButton';

// Mock the global formbutton function
const mockFormbutton = jest.fn();

describe('useFormButton', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockFormbutton.mockReset();
    // Set formbutton as a global function
    (global as any).formbutton = mockFormbutton;
  });

  afterEach(() => {
    // Clean up the global formbutton after each test
    delete (global as any).formbutton;
  });

  describe('when formbutton is not defined', () => {
    it('throws an error', () => {
      // Remove the global formbutton
      delete (global as any).formbutton;

      // avoid thrown error from `renderHook` to be logged to console
      const spiedConsoleError = jest
        .spyOn(console, 'error')
        .mockImplementation();

      expect(() =>
        renderHook(() => useFormButton('https://formspree.io/f/xyz'))
      ).toThrowError(
        'formbutton is not defined. Please make sure to load the formbutton script at the end of the <body>...</body> section of your index.html file. See https://formspree.io/formbutton for more information.'
      );

      spiedConsoleError.mockRestore();
    });
  });

  describe('when formActionEndpoint is not provided', () => {
    it('throws an error', () => {
      // avoid thrown error from `renderHook` to be logged to console
      const spiedConsoleError = jest
        .spyOn(console, 'error')
        .mockImplementation();

      expect(() => renderHook(() => useFormButton(''))).toThrowError(
        'formActionEndpoint is required. Please provide the endpoint to send the form data to (e.g. https://formspree.io/f/xyz)'
      );

      spiedConsoleError.mockRestore();
    });
  });

  describe('when valid parameters are provided', () => {
    it('calls formbutton with default configuration', () => {
      const endpoint = 'https://formspree.io/f/test123';

      renderHook(() => useFormButton(endpoint));

      expect(mockFormbutton).toHaveBeenCalledTimes(1);
      expect(mockFormbutton).toHaveBeenCalledWith('create', {
        action: endpoint,
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
      });
    });

    it('calls formbutton with custom configuration', () => {
      const endpoint = 'https://formspree.io/f/custom456';
      const customConfig = {
        title: 'Contact Us',
        description: 'We would love to hear from you!',
        theme: 'classic' as const,
        initiallyVisible: true,
        styles: {
          title: {
            backgroundColor: 'blue',
          },
          button: {
            backgroundColor: 'red',
          },
        },
        fields: [
          {
            type: 'text' as const,
            label: 'Name:',
            name: 'name',
            required: true,
          },
          { type: 'submit' as const },
        ],
      };

      renderHook(() => useFormButton(endpoint, customConfig));

      expect(mockFormbutton).toHaveBeenCalledTimes(1);
      expect(mockFormbutton).toHaveBeenCalledWith('create', {
        action: endpoint,
        title: 'Contact Us',
        description: 'We would love to hear from you!',
        theme: 'classic',
        fields: [
          {
            type: 'text',
            label: 'Name:',
            name: 'name',
            required: true,
          },
          { type: 'submit' },
        ],
        styles: {
          title: {
            backgroundColor: 'blue',
          },
          button: {
            backgroundColor: 'red',
          },
        },
        initiallyVisible: true,
      });
    });

    it('merges custom config with default config', () => {
      const endpoint = 'https://formspree.io/f/merge789';
      const customConfig = {
        title: 'Custom Title',
        // Only override title, other defaults should remain
      };

      renderHook(() => useFormButton(endpoint, customConfig));

      expect(mockFormbutton).toHaveBeenCalledWith('create', {
        action: endpoint,
        title: 'Custom Title', // custom value
        // default values below
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
      });
    });

    it('re-runs effect when formActionEndpoint changes', () => {
      const endpoint1 = 'https://formspree.io/f/endpoint1';
      const endpoint2 = 'https://formspree.io/f/endpoint2';

      const { rerender } = renderHook(
        ({ endpoint }) => useFormButton(endpoint),
        {
          initialProps: { endpoint: endpoint1 },
        }
      );

      expect(mockFormbutton).toHaveBeenCalledTimes(1);
      expect(mockFormbutton).toHaveBeenLastCalledWith(
        'create',
        expect.objectContaining({ action: endpoint1 })
      );

      // Rerender with a new endpoint
      rerender({ endpoint: endpoint2 });

      expect(mockFormbutton).toHaveBeenCalledTimes(2);
      expect(mockFormbutton).toHaveBeenLastCalledWith(
        'create',
        expect.objectContaining({ action: endpoint2 })
      );
    });

    it('re-runs effect when config changes', () => {
      const endpoint = 'https://formspree.io/f/endpoint';
      const config1 = { title: 'Title 1' };
      const config2 = { title: 'Title 2' };

      const { rerender } = renderHook(
        ({ config }) => useFormButton(endpoint, config),
        {
          initialProps: { config: config1 },
        }
      );

      expect(mockFormbutton).toHaveBeenCalledTimes(1);
      expect(mockFormbutton).toHaveBeenLastCalledWith(
        'create',
        expect.objectContaining({ title: 'Title 1' })
      );

      // Rerender with a new config
      rerender({ config: config2 });

      expect(mockFormbutton).toHaveBeenCalledTimes(2);
      expect(mockFormbutton).toHaveBeenLastCalledWith(
        'create',
        expect.objectContaining({ title: 'Title 2' })
      );
    });

    it('supports custom buttonImg', () => {
      const endpoint = 'https://formspree.io/f/button-img';
      const customConfig = {
        buttonImg: "<i class='fas fa-comment' style='font-size:24px'/>",
      };

      renderHook(() => useFormButton(endpoint, customConfig));

      expect(mockFormbutton).toHaveBeenCalledWith(
        'create',
        expect.objectContaining({
          buttonImg: "<i class='fas fa-comment' style='font-size:24px'/>",
        })
      );
    });

    it('supports custom callbacks', () => {
      const endpoint = 'https://formspree.io/f/callbacks';
      const onSubmit = jest.fn((data) => data);
      const onResponse = jest.fn();
      const onError = jest.fn();

      const customConfig = {
        onSubmit,
        onResponse,
        onError,
      };

      renderHook(() => useFormButton(endpoint, customConfig));

      expect(mockFormbutton).toHaveBeenCalledWith(
        'create',
        expect.objectContaining({
          onSubmit,
          onResponse,
          onError,
        })
      );
    });

    it('supports loadGoogleFonts option', () => {
      const endpoint = 'https://formspree.io/f/google-fonts';
      const customConfig = {
        loadGoogleFonts: true,
      };

      renderHook(() => useFormButton(endpoint, customConfig));

      expect(mockFormbutton).toHaveBeenCalledWith(
        'create',
        expect.objectContaining({
          loadGoogleFonts: true,
        })
      );
    });

    it('supports custom stylesheet', () => {
      const endpoint = 'https://formspree.io/f/stylesheet';
      const customConfig = {
        stylesheet: 'mystyles.css',
      };

      renderHook(() => useFormButton(endpoint, customConfig));

      expect(mockFormbutton).toHaveBeenCalledWith(
        'create',
        expect.objectContaining({
          stylesheet: 'mystyles.css',
        })
      );
    });

    it('supports various field types', () => {
      const endpoint = 'https://formspree.io/f/field-types';
      const customConfig = {
        fields: [
          { type: 'text' as const, name: 'text-field' },
          { type: 'email' as const, name: 'email-field' },
          { type: 'number' as const, name: 'number-field' },
          { type: 'textarea' as const, name: 'textarea-field' },
          { type: 'select' as const, name: 'select-field' },
          { type: 'checkbox' as const, name: 'checkbox-field' },
          { type: 'radio' as const, name: 'radio-field' },
          { type: 'hidden' as const, name: 'hidden-field' },
          { type: 'submit' as const },
          { type: 'reset' as const },
        ],
      };

      renderHook(() => useFormButton(endpoint, customConfig));

      expect(mockFormbutton).toHaveBeenCalledWith(
        'create',
        expect.objectContaining({
          fields: customConfig.fields,
        })
      );
    });
  });
});
