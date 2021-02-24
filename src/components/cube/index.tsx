import React, { useRef, useMemo } from 'react';
import Style from './index.module.scss';
/**
 * 设：这个立方体（长方体）在你的正前方，它一共有6个面
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
 * 实际上，只要确定三条边就能确定一个立方体，那就是 正面的宽(x) 正面的高(y) 右侧面的宽(z)
 * 所以 planeSize 的参数，只需要传入3个值[x, y, z]就能确定立方体
 */

/**
 * 如果想要翻牌的效果，可以把参数z设置为0
 */
interface CubeProps {
  planeSize: number[]; // 传入x, y, z 的值
  planeNode: Array<React.ReactElement | ''>; // 这个数组的项必须是jsx，每个jsx的索引对应着每个面，映射关系参照上面的注释
  index: number; // 要显示在正前方的面的索引值， 参照上面的注释
  speed?: number; // 切换平面时的运动速度
  unit?: 'px' | 'rem' | 'vw' | 'vh'; // 传入的x, y, z 的值的长度单位
  // 1. 在 fixed参数值 为 false 的情况下，
  // row 与 row-reverse 的效果等价， 都是左右切换，也就是在Y轴上切换
  // column 与 column-reverse 的效果等价， 都是上下切换，也就是在X轴上切换
  // 因为在 fixed参数值 为 false 的情况下平面切换时，会自动寻找最短路径

  // 2. 在 fixed参数值 为 true 的情况下
  // row：不会寻找最短路径， 总是从左向右旋转
  // row-reverse：不会寻找最短路径， 总是从右向左旋转
  // column：不会寻找最短路径，总是从上向下旋转
  // column-reverse：不会寻找最短路径， 总是从下向上旋转
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  fixed?: boolean;
}

interface dataStorageProps {
  lastIndex: number | null;
  lastDeg: number[];
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

const directionMaps = {
  row: {
    list: [0, 3, 2, 1],
    deg: [0, 1],
    plane2: '180',
  },
  'row-reverse': {
    list: [0, 1, 2, 3],
    deg: [0, -1],
    plane2: '180',
  },
  column: {
    list: [0, 4, 2, 5],
    deg: [1, 0],
    plane2: '0',
  },
  'column-reverse': {
    list: [0, 5, 2, 4],
    deg: [-1, 0],
    plane2: '0',
  },
};

const transformValue = (x_y: number[]) => {
  const [x = 0, y = 0] = x_y;
  return `rotateX(${x}deg) rotateY(${y}deg)`;
};
const Cube: React.FC<CubeProps> = (props) => {
  const { speed = 1, planeNode, planeSize, unit = 'px', direction = 'row', fixed = false } = props;
  const index = props.index % 6 >> 0;
  const [sizeX, sizeY, sizeZ] = planeSize;
  const dataStorage = useRef<dataStorageProps>({ lastIndex: null, lastDeg: [] });
  // 缩放系数
  // 由于使用了 perspective ，使得子元素 translateZ 值 将影响此元素的缩放比例
  // 当 translateZ 的值为正值，代表此元素离你更近了，所以就变大了
  // 当 translateZ 的值为负值，代表此元素离你更远了，所以就变小了
  // getCoefficient 的作用就是把缩放的元素，还原至原始大小
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
  const List = useMemo(() => {
    const { plane2 } = directionMaps[direction];
    return [
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
          transform: `translateZ(${-sizeZ / 2}${unit}) rotateX(180deg) rotate(${plane2}deg)`,
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
  }, [planeSize, unit, direction]);
  const transformMove = useMemo((): string => {
    const { current } = dataStorage;
    const { lastIndex, lastDeg } = current;
    const { list, deg } = directionMaps[direction];
    // 如果索引不在范围内，直接返回上一次的 度数，相当于不变化
    if (!list.includes(index)) return transformValue(lastDeg);
    // 如果是初始化， 直接返回上一个
    if (lastIndex === null) {
      // 记录上一个 索引,和 坐标值 为当前
      dataStorage.current = {
        lastIndex: index,
        lastDeg: originMaps[index],
      };
      return transformValue(dataStorage.current.lastDeg);
    }
    const currentDeg = (() => {
      return lastDeg.map((item, i) => {
        let n = list.indexOf(index) - list.indexOf(lastIndex);
        if (n === -3) {
          n = 1;
        }
        if (n === 3) {
          n = -1;
        }
        // 如果确定了轨迹，那么运动轨迹将始终往一个方向旋转，不会寻找最短路径
        if (fixed && n < 0) {
          n += 4;
        }
        return item + n * deg[i] * 90;
      });
    })();
    /*******/
    // 这尼玛真是个天坑啊！！！
    // 不使用setTimeoust，修改 useref 的值，和赋值 useref 会引起渲染2次！
    /*******/
    setTimeout(() => {
      // 记录上一个 索引,和 坐标值 为当前
      dataStorage.current = {
        lastIndex: index,
        lastDeg: currentDeg,
      };
    });
    return transformValue(currentDeg);
  }, [index, direction]);
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
              <div className={`${Style['item-info']}`}>{planeNode[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cube;
