import React, { useRef, useImperativeHandle } from 'react';
import * as Config from './config';
export * from './config';
type MoveType =
  | 'BasicCannon'
  | 'RandomDirection'
  | 'RealisticLook'
  | 'RandomFireworks'
  | 'Snow'
  | 'SchoolPride';
type Fn = () => any;
const currying = function (fn: Fn, ...arr: any) {
  let len = fn.length;
  return function (this: any, ...arg: any) {
    arr = [...arr, ...arg];
    if (arr.length < len) {
      return currying(fn, ...arr);
    }
    return fn.call<any, any, any>(this, ...arr);
  };
};

interface ConfettiProps {
  width: number; //控制箭头方向
  height: number; //控制两条线的夹角
}

interface HandleProps {
  move(): void; //控制箭头方向
}

const Confetti = React.forwardRef<HandleProps, ConfettiProps>((props, ref: any) => {
  const { width, height } = props;
  const canvasRef = useRef(null);
  useImperativeHandle(ref, () => ({
    move: (type: MoveType) => {
      const canvas = canvasRef.current;
      if (Object.prototype.toString.call(canvas) === '[object HTMLCanvasElement]') {
        Config[type]();
      }
    },
  }));
  return <canvas ref={canvasRef} width={width} height={height} />;
});
export default Confetti;
