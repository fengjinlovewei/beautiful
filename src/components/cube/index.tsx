import React, { useState } from 'react';
import Style from './index.module.scss';
/**
 * 假设这个立方体在你的正前方，它一共有6个面
 * 正面的平面（对着你的面）的 index 为 0，
 * 右侧面的平面 index 为 1，
 * 后面的平面（也即是和正面平面相对的那个面） index 为 2
 * 左侧面的平面（也即是和右侧面相对的那个面） index 为 3
 * 上面的平面 index 为 4
 * 下面的平面（也就是上面相对的那个面） index 为 5
 */

/**
 * 根据立方体的特性可得
 * 0（前面）和 2（后面） 的宽高必须一致
 * 1（右面）和 3（左面） 的宽高必须一致
 * 4（下面）和 5（上面） 的宽高必须一致
 * 实际上，只要确定了正面（后者后面） 和 右侧（或者左侧）的宽高，就能确定整个立方体的尺寸
 * 所以 planeSize 的参数，只需要传入2个宽高数组即可
 */
interface CubeProps {
  planeSize: [[number, number], [number, number]];
  planeNode: React.ReactElement[];
  index: number;
  speed?: number;
  unit?: 'px' | 'vw' | 'rem' | 'em' | 'vh';
}

const Cube: React.FC<CubeProps> = (props) => {
  const { speed = 1, index = 0, planeNode, planeSize, unit = 'px' } = props;
  const [size02, size13] = planeSize;
  // 系数
  const coefficient = 0.902;
  // 距离
  const getDistance = (n: number) => n * coefficient + unit;
  const List = [
    {
      style: {
        width: size02[0] + unit,
        height: size02[1] + unit,
        transform: `translateZ(${getDistance(size13[0] / 2)}) rotateX(0deg) scale(${coefficient})`,
      },
    },
    {
      style: {
        width: size13[0] + unit,
        height: size13[1] + unit,
        transform: `translate3d(${getDistance(
          size02[0] - size13[0] / 2,
        )}, 0, 0) rotateY(90deg) scale(${coefficient})`,
      },
    },
    {
      style: {
        width: size02[0] + unit,
        height: size02[1] + unit,
        transform: `translateZ(-${getDistance(
          size13[0] / 2,
        )}) rotateX(180deg) scale(${coefficient})`,
      },
    },
    {
      style: {
        width: size13[0] + unit,
        height: size13[1] + unit,
        transform: `translate3d(${getDistance(
          size02[0] - size13[0] / 2,
        )}, 0, 0) rotateY(-90deg) scale(${coefficient})`,
      },
    },
    {
      style: {
        width: size02[0] + unit,
        height: size13[0] + unit,
        transform: `translate3d(0, ${getDistance(
          size13[0] / 2,
        )}, 0) rotateX(-90deg) scale(${coefficient})`,
      },
    },
    {
      style: {
        width: size02[0] + unit,
        height: size13[0] + unit,
        transform: `translate3d(0, -${getDistance(
          size13[0] / 2,
        )}, 0) rotateX(90deg) scale(${coefficient})`,
      },
    },
  ];
  console.log(List);
  const degMaps: number[] = [
    [0, 0],
    [0, -90],
    [180, 0],
    [0, 90],
    [90, 0],
    [-90, 0],
  ][index % 6];
  return (
    <div className={`${Style['cube-container']}`}>
      <div
        className={`${Style['cube-info']}`}
        style={{
          transform: `rotateX(${degMaps[0]}deg) rotateY(${degMaps[1]}deg) `,
          transitionDuration: speed + 's',
          width: size02[0] + unit,
          height: size02[1] + unit,
        }}
      >
        {List.map((item, i) => {
          return (
            <div
              className={`${Style['cube-item']} ${Style['cube-item-' + i]}`}
              style={item.style}
              key={i}
            >
              <div className={`${Style['item-info']}`}>{planeNode[i] ? planeNode[i] : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cube;
