import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = [
    'input-container',
    error && 'input-error',
    containerClassName
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={inputClasses}
        {...props}
      />

      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;