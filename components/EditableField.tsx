
import React, { useRef, useEffect } from 'react';

interface EditableFieldProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  ariaLabel: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export const EditableField: React.FC<EditableFieldProps> = ({
  initialValue,
  onSave,
  ariaLabel,
  className = '',
  as = 'p',
}) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elementRef.current && initialValue !== elementRef.current.innerText) {
      elementRef.current.innerText = initialValue;
    }
  }, [initialValue]);

  const handleBlur = () => {
    if (elementRef.current) {
      const newValue = elementRef.current.innerText;
      if (newValue.trim() !== initialValue.trim()) {
        onSave(newValue);
      }
    }
  };

  const commonProps = {
    ref: elementRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    'aria-label': ariaLabel,
    className: `outline-none focus:bg-yellow-100/70 focus:ring-1 focus:ring-yellow-500 rounded-sm px-1 py-0.5 -mx-1 transition-all duration-150 cursor-text ${className}`,
    dangerouslySetInnerHTML: { __html: initialValue }
  };
  
  return React.createElement(as, commonProps);
};
