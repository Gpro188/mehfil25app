import React, { useState, useEffect } from 'react';

const TestComponent = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('TestComponent mounted');
  }, []);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Component</h1>
      <p>If you can see this, React is working correctly.</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default TestComponent;