import { useFormButton } from '@formspree/react';

const FormButton = () => {
  useFormButton(process.env.REACT_APP_FORM_BUTTON_ENDPOINT as string);

  return (
    <div>
      <h1>Form Button</h1>
    </div>
  );
};

export default FormButton;
