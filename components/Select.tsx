import React, { useEffect, useState } from 'react';

interface SelectProps {
  id: string;
  onChange: any;
  value: any;
  label: string;
  options: string[];
  onFocus: any;
  visible?: boolean;
  innerRef?: any;
}

const Select: React.FC<SelectProps> = ({
  id,
  value,
  label,
  options,
  onChange,
  onFocus,
  visible,
  innerRef,
}) => {
  const [selectValue, setSelectValue] = useState(value);
  useEffect(() => {
    setSelectValue(value);
  }, [value]);
  return (
    <div ref={innerRef} className="relative">
      <input
        onChange={onChange}
        value={selectValue}
        id={id}
        onFocus={onFocus}
        placeholder=" "
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
                    focus:outline-cyan-500
                    focus:ring-0
                    peer
            "
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
                z-10
                origin-[0]
                left-6
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                peer-focus:-translate-y-3
                peer-focus:text-cyan-500
            "
        htmlFor={id}
      >
        {label}
      </label>
      {visible && (
        <div className="bg-white w-60 absolute top-14 right-0 py-5 flex-col border-gray-800 flex">
          <div className="flex flex-col gap-2 items-center justify-center">
            {options.map((element, i) => {
              const myReg = new RegExp(value.toLowerCase() + '.*');
              if (element.toLowerCase().match(myReg)) {
                return (
                  <div
                    tabIndex={0}
                    id="selectElement"
                    key={i}
                    className="text-black"
                  >
                    <p
                      id="selectElement"
                      onClick={(e) =>
                        setSelectValue((e.target as HTMLElement).innerText)
                      }
                      className="text-black hover:text-cyan-500 cursor-pointer"
                    >
                      {element}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
