import React, { useRef, useEffect } from 'react';

interface DemoProps {
  text?: string;
}

const data = { value: 0 };
const Demo: React.FC<DemoProps> = (props) => {
  const { text } = props;
  const add = () => {
    data.value++;
  };
  const lock = () => {
    console.log(data);
  };
  return (
    <div>
      <p>{text}</p>
      <button onClick={add}>添加值</button>
      <button onClick={lock}>打印值</button>
    </div>
  );
};

export default Demo;
