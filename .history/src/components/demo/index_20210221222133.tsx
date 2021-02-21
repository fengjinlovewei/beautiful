import React, { useRef, useEffect, useState } from 'react';

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
  console.log(ref);
  return ref.current;
};

const Demo: React.FC<DemoProps> = (props) => {
  const { text } = props;
  const [now, setNow] = useState(0);
  const last = usePrevious(now);
  const add = () => {
    setNow(now + 1);
  };
  const lock = () => {
    console.log(now);
  };
  return (
    <div>
      <p>{text}</p>
      <button onClick={add}>添加值</button>
      <button onClick={lock}>打印值</button>
      <p>
        上一个值：{last}，现在的值{now}
      </p>
    </div>
  );
};

export default Demo;
