import React, { useEffect, useRef } from 'react';
import Style from './index.module.scss';
import LuckyWheelController from './MethodBase';

/**
 *
 */
interface LuckyWheelProps {}

const LuckyWheel: React.FC<LuckyWheelProps> = (props) => {
  const content = useRef(null);
  const wheel = useRef<LuckyWheelController | null>(null);
  const state = useRef<boolean>(true);
  useEffect(() => {
    wheel.current = new LuckyWheelController(content.current, 20);
  }, []);
  const begin = () => {
    if (state.current) {
      wheel.current?.start();
      state.current = false;
    } else {
      wheel.current?.stop(60).then((res) => {
        alert(res);
        state.current = true;
      });
    }
  };
  return (
    <div className={Style['luck-wheel-box']}>
      <div className={Style['luck-wheel-big']} ref={content}></div>
      <div className={Style['luck-wheel-small']}></div>
      <button className={Style['luck-wheel-btn']} onClick={begin}></button>
    </div>
  );
};

export default LuckyWheel;
