import React from 'react';
import InputComponent from './InputComponent';

const App: React.FC = () => {
  const handleSubmit = (userInput: string) => {
    fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>My Fullstack App</h1>
      <InputComponent onChat={handleSubmit} />
    </div>
  );
};

export default App;
