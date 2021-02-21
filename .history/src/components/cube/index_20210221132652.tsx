import React, { useRef, useEffect, useMemo } from 'react';
import Style from './index.module.scss';
/**
 * 假设这个立方体在你的正前方，它一共有6个面
 * 正面的平面（对着你的面）的 index 为 0，
 * 右侧面的平面 index 为 1，
 * 后面的平面（也即是和正面平面相对的那个面） index 为 2
 * 左侧面的平面（也即是和右侧面相对的那个面） index 为 3
 * 下面的平面 index 为 4
 * 上面的平面（也就是下面相对的那个面） index 为 5
 */

/**
 * 根据立方体的特性可得
 * 0（前面）和 2（后面） 的宽高必须一致
 * 1（右面）和 3（左面） 的宽高必须一致
 * 4（下面）和 5（上面） 的宽高必须一致
 * 实际上，只要确定了正面（后者后面） 和 右侧（或者左侧）的宽高，就能确定整个立方体的尺寸
 * 再进一步可发现，其实只要确定三条边就能确定一个立方体，那就是 正面的宽(x) 正面的高(y) 右侧面的宽(z)
 * 所以 planeSize 的参数，只需要传入3个值[x, y, z]就能确定
 */
interface CubeProps {
  planeSize: number[];
  planeNode: React.ReactElement[];
  index: number;
  speed?: number;
  unit?: 'px' | 'rem' | 'vw' | 'vh';
}

interface dataStorageProps {
  lastIndex: number | null;
  lastMap: number[] | null;
}

interface logicProps {
  [x: string]: number[];
}

// x 轴 顺时针为正数，逆时针为负数
// y 轴 顺时针为负数，逆时针为正数
const originMaps: number[][] = [
  [0, 0],
  [0, -90],
  [0, -180],
  [0, 90],
  [90, 0],
  [-90, 0],
];
// x 轴 顺时针为正数，逆时针为负数
// y 轴 顺时针为负数，逆时针为正数
const logicMaps: logicProps = {
  '01': [0, -1],
  '02': [0, 2],
  '03': [0, 1],
  '04': [1, 0],
  '05': [-1, 0],

  '10': [0, 1],
  '12': [0, -1],
  '13': [0, 2],
  '14': [1, 0],
  '15': [-1, 0],

  '20': [0, 2],
  '21': [0, -1],
  '23': [0, 1],
  '24': [1, 0],
  '25': [-1, 0],

  '30': [0, -1],
  '31': [0, 2],
  '32': [0, 1],
  '34': [1, 0],
  '35': [-1, 0],

  '40': [0, 1],
  '41': [1, 0],
  '42': [0, -1],
  '43': [-1, 0],
  '45': [2, 0],

  '50': [1, 0],
  '51': [0, -1],
  '52': [-1, 0],
  '53': [0, 1],
  '54': [2, 0],
};
const transformValue = (arr: number[]) => {
  const [x = 0, y = 0] = arr;
  return `rotateX(${x}deg) rotateY(${y}deg)`;
};
const Cube: React.FC<CubeProps> = (props) => {
  const { speed = 1, planeNode, planeSize, unit = 'px' } = props;
  const index = props.index % 6 >> 0;
  const [sizeX, sizeY, sizeZ] = planeSize;
  const dataStorage = useRef<dataStorageProps>({ lastIndex: null, lastMap: null });
  // 缩放系数
  // 由于使用了 perspective ，使得子元素 translateZ 值 将影响此元素的缩放比例
  // 当 translateZ 的值为正值，代表此元素离你更近了，所以就变大了
  // 当 translateZ 的值为负值，代表此元素离你更远了，所以就变小了
  // getCoefficient 的作用就是把缩放的元素，还原至原始大小
  console.log(2222);
  useEffect(() => {}, []);
  const coefficient = useMemo((): number => {
    const size = {
      px() {
        return sizeZ;
      }, //0.902
      rem() {
        const HTML = document.getElementsByTagName('html')[0];
        const fontSize = window.getComputedStyle(HTML, null).getPropertyValue('font-size');
        return parseFloat(fontSize) * sizeZ;
      },
      vw() {
        return (window.innerWidth / 100) * sizeZ;
      },
      vh() {
        return (window.innerHeight / 100) * sizeZ;
      },
    }[unit]();
    return 1200 / (1200 + size / 2);
  }, [sizeZ, unit]);
  const List = [
    {
      style: {
        width: sizeX + unit,
        height: sizeY + unit,
        transform: `translateZ(${sizeZ / 2}${unit}) rotateX(0deg)`,
      },
    },
    {
      style: {
        width: sizeZ + unit,
        height: sizeY + unit,
        transform: `translate3d(${sizeX - sizeZ / 2}${unit}, 0, 0) rotateY(90deg) `,
      },
    },
    {
      style: {
        width: sizeX + unit,
        height: sizeY + unit,
        transform: `translateZ(${-sizeZ / 2}${unit}) rotateX(180deg)`,
      },
    },
    {
      style: {
        width: sizeZ + unit,
        height: sizeY + unit,
        transform: `translate3d(${-(sizeX - sizeZ / 2)}${unit}, 0, 0) rotateY(-90deg) `,
      },
    },
    {
      style: {
        width: sizeX + unit,
        height: sizeZ + unit,
        transform: `translate3d(0, ${sizeY - sizeZ / 2}${unit}, 0) rotateX(-90deg)`,
      },
    },
    {
      style: {
        width: sizeX + unit,
        height: sizeZ + unit,
        transform: `translate3d(0, ${-(sizeY - sizeZ / 2)}${unit}, 0) rotateX(90deg)`,
      },
    },
  ];
  const transformMove = useMemo((): string => {
    console.log('进入函数');
    const { current } = dataStorage;
    const { lastIndex, lastMap } = current;

    // 如果是初始化， 直接返回上一个
    if (lastIndex === null) {
      // 记录上一个索引为当前
      current.lastIndex = index;
      // 记录上一个坐标信息为当前
      current.lastMap = originMaps[index];
      return transformValue(current.lastMap);
    }
    // 记录上一个索引为当前
    current.lastIndex = index;
    console.log(lastIndex, current.lastIndex);
    //if (i === lastIndex) return transform(lastMap || []);
    console.log(`${lastIndex}${index}`);
    // const currentLogic: number[] = logicMaps[`${lastIndex}${index}`].map((item, s) => {
    //   const value = (lastMap || [0, 0])[s];
    //   return value + item * 90;
    // });
    //console.log(currentLogic);
    return transformValue([Math.random() * 100, Math.random() * 100]);
  }, [index]);
  return (
    <div className={`${Style['cube-container']}`} style={{ transform: `scale(${coefficient})` }}>
      <div
        className={`${Style['cube-info']}`}
        style={{
          transform: transformMove,
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
