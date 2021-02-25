import React, { useRef, useEffect } from 'react';
import MethodBase from './MethodBase';
import Style from './index.module.scss';

interface SnowProps {}

const Snow: React.FC<SnowProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    MethodBase(canvas);
  }, []);
  return <canvas className={Style['canvas']} ref={canvasRef}></canvas>;
};

export default Snow;
