import React from 'react';
import Style from './index.module.scss';
/**
 * 建议正背面的元素宽高一致，如果不一致，将左右剧中，上下居下。
 */
interface ReverseProps {
  front: React.ReactElement;
  back: React.ReactElement;
  move: boolean;
  speed?: number;
}

const Reverse: React.FC<ReverseProps> = (props) => {
  const { front, back, move = false, speed = 1 } = props;
  return (
    <div className={`${Style['reverse-container']}`}>
      <div className={`${Style['reverse-container-info']} ${move ? Style['move'] : ''}`}>
        <div
          className={`${Style['reverse-item']} ${Style['front']}`}
          style={{ transitionDuration: speed + 's' }}
        >
          {front}
        </div>
        <div
          className={`${Style['reverse-item']} ${Style['back']}`}
          style={{ transitionDuration: speed + 's' }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

export default Reverse;
