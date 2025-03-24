import { useState } from 'react';

type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
};

type ValidationErrors = {
  [key: string]: string;
};

export const useFormValidation = (initialState: any) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validate = (name: string, value: string, rules: ValidationRules) => {
    if (rules.required && !value) {
      return '此字段不能为空';
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `最少需要 ${rules.minLength} 个字符`;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      return `不能超过 ${rules.maxLength} 个字符`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return '格式不正确';
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const handleBlur = (name: string, rules: ValidationRules) => {
    const error = validate(name, values[name], rules);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const validateForm = (validationRules: {[key: string]: ValidationRules}) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(name => {
      const error = validate(name, values[name], validationRules[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setValues
  };
};