import React, { useRef, useEffect } from 'react';

interface DemoProps {
  text?: string;
}

interface anyProps {
  [x: string]: string | number | number[];
}

const usePrevious = (state: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = state;
  });
  return ref.current;
};
const data = { value: 0 };
const Demo: React.FC<DemoProps> = (props) => {
  const { text } = props;
  const data = usePrevious(0);
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
