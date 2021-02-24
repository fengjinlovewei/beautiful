import React, { useRef, useImperativeHandle, useEffect } from 'react';
import confetti from 'canvas-confetti';
import MethodBase from './MethodBase';

const {
  BasicCannon,
  RandomDirection,
  RealisticLook,
  RandomFireworks,
  Snow,
  SchoolPride,
} = MethodBase(confetti);
export { BasicCannon, RandomDirection, RealisticLook, RandomFireworks, Snow, SchoolPride };
interface ConfettiProps {
  width: string; //画布大小
  height: string; //画布大小
}

interface HandleProps {
  move(): void; //暴露给父组件的函数
}

const Confetti = React.forwardRef<HandleProps, ConfettiProps>((props, ref: any) => {
  const { width, height } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const methodBase = useRef<any>();
  useEffect(() => {
    console.log(canvasRef);
    const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasConfetti = confetti.create(canvas, { resize: true });
    methodBase.current = MethodBase(canvasConfetti);
  }, []);
  const curring = (type: string) => {
    return (...args: []) => {
      if (Object.prototype.toString.call(canvasRef.current) === '[object HTMLCanvasElement]') {
        methodBase.current[type](...args);
      }
    };
  };
  useImperativeHandle(ref, () => ({
    BasicCannon: curring('BasicCannon'),
    RandomDirection: curring('RandomDirection'),
    RealisticLook: curring('RealisticLook'),
    RandomFireworks: curring('RandomFireworks'),
    Snow: curring('Snow'),
    SchoolPride: curring('SchoolPride'),
  }));
  return <canvas ref={canvasRef} width={width} height={height} style={{ width, height }} />;
});
export default Confetti;
