import React, { useState } from "react";

function InputArea() {
  const [input, setInput] = useState<string>("");
  const onClickHandler = () => {
    if (input.trim() !== "") {
      window.context.openUrl(input);
    }
  };
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  return (
    <div className="my-4 flex justify-center">
      <input
        className="bg-transparent dark:bg-white/5 px-3 py-2"
        type="text"
        value={input}
        placeholder="input url"
        onChange={onChangeHandler}
      />
      <button
        className="mx-4 bg-transparent dark:bg-white/5"
        onClick={onClickHandler}
      >
        Open URL
      </button>
    </div>
  );
}

export default InputArea;
