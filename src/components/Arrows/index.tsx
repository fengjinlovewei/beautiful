import React, { useMemo } from 'react';
import Style from './index.module.scss';

/**
 *
 */
interface FireworksProps {
  state: boolean; //控制箭头方向
  deg?: number; //控制两条线的夹角
  speed?: number; // 运动速度
  color?: string; // 箭头颜色
  unit?: string; //长度单位
  width?: number; // 箭头单边的长度
  height?: number; // 箭头的粗度
  className?: string;
  direction?: 'row' | 'column'; // 控制主轴方向
}

const Fireworks: React.FC<FireworksProps> = (props) => {
  const {
    state,
    speed = 0.25,
    color = '#b05d20',
    unit = 'px',
    width = 7,
    height = 1,
    className = '',
    direction = 'column',
  } = props;
  let { deg = 100 } = props;
  deg = 90 - deg / 2;
  const boxStyle = useMemo(() => {
    // 根据主轴控制旋转
    const rotate = { row: 90, column: 0 }[direction];
    // 弧度
    const radian = Math.PI / 180;
    // 粗度冗余站位
    const small = (height / 2) * Math.cos((90 - deg) * radian);
    // 长度冗余站位
    const big = width / 2 - (width / 2) * Math.cos(deg * radian);
    // 计算容器系数
    const size = width - big - small;
    return {
      width: size * 2 + unit,
      height: size * 2 + unit,
      transform: `rotate(${rotate}deg) `,
    };
  }, [width, unit, direction]);
  const commonStyle = useMemo(() => {
    return {
      width: width + unit,
      height: height + unit,
      transition: `transform ${speed}s`,
      background: color,
      //borderRadius: height + unit,
    };
  }, [unit, speed, color]);
  const allStyle = useMemo(() => {
    const current = [1, -1];
    return {
      left: {
        ...commonStyle,
        left: 0,
        transform: `translateY(-50%) rotate(${deg * current[+state]}deg) `,
      },
      right: {
        ...commonStyle,
        right: 0,
        transform: `translateY(-50%) rotate(${deg * current[+!state]}deg) `,
      },
    };
  }, [state, commonStyle, deg]);

  return (
    <i className={`${Style[`arrowsIcon-box`]} ${className}`} style={boxStyle}>
      <i style={allStyle.left}></i>
      <i style={allStyle.right}></i>
    </i>
  );
};

export default Fireworks;
