import React, { useEffect, useRef } from 'react';
import Style from './index.module.scss';

import { Fireworks as FireworksClass } from './js/index.js';
/**
 * 注意：本组件依赖于包裹此组件的元素，也就是父元素，对于父元素有以下要求：
 * 1. 父元素必须要有定位
 * 2. 父元素的高度必须为宽度的一半，因为canvas的css样式高度为父元素的100%，宽度canvas会自动处理
 * 这个宽高是影响布局的宽高
 *
 * 对于 width 和 height 参数，这两个参数的单位为px，不需要设置，
 * 同样 height 参数的值也要为 width参数的值 的一半，具体写多少按照你的需求来定，
 * width 和 height 的值越大，烟花越小越清晰
 * 反之， 值越小，烟花越大越模糊
 * 这两个值不影响布局，但是影响具体视觉效果
 *
 */

interface FireworksProps {
  width?: number; //canvas 画布的宽度
  height?: number; // canvas 画布的高度
  color?: null | string; //颜色值
  count?: number; //每个烟花的粒子数量
  interval?: number;
  length?: number[];
}

const Fireworks: React.FC<FireworksProps> = (props) => {
  const content = useRef(null);
  const { width = 1920, height = 1080, ...other } = props;
  useEffect(() => {
    let flower: any = null;
    if (content.current) {
      flower = new FireworksClass(content.current, { ...other });
    }
    return () => {
      try {
        flower.clear();
        flower = null;
      } catch (e) {
        console.log(e);
      }
    };
  }, []);
  return (
    <canvas
      ref={content}
      className={Style[`canvas-fireworks`]}
      width={width}
      height={height}
    ></canvas>
  );
};

export default Fireworks;
