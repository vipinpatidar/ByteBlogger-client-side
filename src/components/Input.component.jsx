import React, { useState } from "react";

const InputBox = ({
  name,
  type,
  id,
  value,
  placeholder,
  iconName,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-[100%] mb-4">
      <input
        id={id}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        name={name}
        defaultValue={value}
        className="input-box"
        disabled={disabled}
        required
      />
      <i className={`fi ${iconName} input-icon`}></i>

      {type === "password" ? (
        <i
          className={`fi ${
            showPassword ? "fi-rr-eye" : "fi-rr-eye-crossed"
          } input-icon left-auto right-4 cursor-pointer`}
          onClick={() => setShowPassword((currState) => !currState)}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputBox;
