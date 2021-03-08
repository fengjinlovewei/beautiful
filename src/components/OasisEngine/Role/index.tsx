import React, { useRef, useEffect } from 'react';
import MethodBase from './MethodBase';
import Style from './index.module.scss';

interface SnowProps {
  callback(obj: any): void;
}

const Snow: React.FC<SnowProps> = (props) => {
  const { callback } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    MethodBase(canvas).then((res) => {
      console.log(res);
      callback(res);
    });
  }, []);
  return <canvas className={Style['canvas']} ref={canvasRef}></canvas>;
};

export default Snow;
