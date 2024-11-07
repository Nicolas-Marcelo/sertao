import React from "react";

function Input({ type, placeholder, value, onChange }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      /> <br />
    </div>
  );
}

export default Input;