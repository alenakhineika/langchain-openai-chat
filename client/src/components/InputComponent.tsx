import React, { useState } from 'react';

interface InputComponentProps {
  onChat: (userInput: string) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({ onChat }) => {
  const [text, setText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    onChat(text);
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleInputChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default InputComponent;
