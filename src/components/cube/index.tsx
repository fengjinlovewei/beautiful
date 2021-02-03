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
 * 再进一步可发现，其实只要确定三条边就能确定一个立方体，那就是 正面的宽(x) 正面的高(y) 右侧面的宽(z)
 * 所以 planeSize 的参数，只需要传入3个值就能确定 [x, y, z]
 */
interface CubeProps {
  planeSize: number[];
  planeNode: React.ReactElement[];
  index: number;
  speed?: number;
  unit?: 'px' | 'vw' | 'rem' | 'em' | 'vh';
}

const Cube: React.FC<CubeProps> = (props) => {
  const { speed = 1, index = 0, planeNode, planeSize, unit = 'px' } = props;
  const [sizeX, sizeY, sizeZ] = planeSize;
  // 系数
  const coefficient = 1200 / (1200 + sizeZ / 2); //0.902;
  // 距离
  const getDistance = (n: number) => n + unit;
  const List = [
    {
      style: {
        width: sizeX + unit,
        height: sizeY + unit,
        transform: `translateZ(${getDistance(sizeZ / 2)}) rotateX(0deg)`,
      },
    },
    {
      style: {
        width: sizeZ + unit,
        height: sizeY + unit,
        transform: `translate3d(${getDistance(sizeX - sizeZ / 2)}, 0, 0) rotateY(90deg) `,
      },
    },
    {
      style: {
        width: sizeX + unit,
        height: sizeY + unit,
        transform: `translateZ(-${getDistance(sizeZ / 2)}) rotateX(180deg)`,
      },
    },
    {
      style: {
        width: sizeZ + unit,
        height: sizeY + unit,
        transform: `translate3d(${getDistance(-(sizeX - sizeZ / 2))}, 0, 0) rotateY(-90deg) `,
      },
    },
    {
      style: {
        width: sizeX + unit,
        height: sizeZ + unit,
        transform: `translate3d(0, ${getDistance(sizeY - sizeZ / 2)}, 0) rotateX(-90deg)`,
      },
    },
    {
      style: {
        width: sizeX + unit,
        height: sizeZ + unit,
        transform: `translate3d(0, ${getDistance(-(sizeY - sizeZ / 2))}, 0) rotateX(90deg)`,
      },
    },
  ];
  const degMaps: number[] = [
    [0, 0],
    [0, -90],
    [180, 0],
    [0, 90],
    [90, 0],
    [-90, 0],
  ][index % 6];
  return (
    <div className={`${Style['cube-container']}`} style={{ transform: `scale(${coefficient})` }}>
      <div
        className={`${Style['cube-info']}`}
        style={{
          transform: `rotateX(${degMaps[0]}deg) rotateY(${degMaps[1]}deg) `,
          transitionDuration: speed + 's',
          width: sizeX + unit,
          height: sizeY + unit,
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
