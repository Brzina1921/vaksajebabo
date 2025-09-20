import React, { useCallback, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface InputProps {
  id: string;
  onChange: any;
  value: any;
  label: string;
  type?: string;
  className?: any;
  required?: any;
  onBlur?: any;
}

const Input: React.FC<InputProps> = ({
  id,
  onChange,
  value,
  label,
  type,
  className,
  required,
  onBlur,
}) => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordType, setPasswordType] = useState('password');

  const handleShowPassword = useCallback(() => {
    setPasswordShow(!passwordShow);
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  }, [passwordShow, passwordType]);

  return (
    <div className="relative">
      <input
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        type={
          id === 'password' || id === 'confirmPassword' ? passwordType : type
        }
        value={value}
        id={id}
        className="
                    block
                    rounded-md
                    px-6
                    pt-6
                    pb-1
                    w-full
                    text-md
                    text-black
                    bg-neutral-100
                    appearance-none
                    focus:outline-blue-500
                    focus:ring-0
                    peer
            "
        placeholder=" "
      />
      <label
        className="
                absolute
                text-md
                text-zinc-400
                duration-150
                transform
                -translate-y-3
                scale-75
                top-4
                origin-[0]
                left-6
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                peer-focus:-translate-y-3
                peer-focus:text-blue-500
            "
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {id === 'password' && (
        <button
          className="absolute top-1/2 transform -translate-y-1/2 right-3"
          onClick={handleShowPassword}
        >
          {passwordShow ? (
            <AiFillEyeInvisible size={20} className="text-blue-500" />
          ) : (
            <AiFillEye size={20} className="text-blue-500" />
          )}
        </button>
      )}
      {id === 'confirmPassword' && (
        <button
          className="absolute top-1/2 transform -translate-y-1/2 right-3"
          onClick={handleShowPassword}
        >
          {passwordShow ? (
            <AiFillEyeInvisible size={20} className="text-blue-500" />
          ) : (
            <AiFillEye size={20} className="text-blue-500" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
