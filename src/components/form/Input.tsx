import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  placeholder?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, placeholder, ...props }, ref) => {
  return (
    <div className="">
      {label && (
        <label htmlFor={props.name} className="block text-sm mb-2 font-normal text-deepStateBlue">
          {label}
        </label>
      )}
      <input
        ref={ref} // Forward ref to the input element
        id={props.name}
        className={`w-full py-2 px-3 text-sm border rounded-[4px] font-[400] h-9 text-[#495160] ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        {...props} // Spread other props such as 'name', 'value', etc.
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

export default Input;
