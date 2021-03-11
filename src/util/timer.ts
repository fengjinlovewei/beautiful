/**
 *
 * @param fn
 * @param speed
 *
 */

interface Obj {
  [x: number]: number;
}

// 可以传入任意类型参数值/返回任意类型值的函数
type anyFn = (...args: any[]) => any;

enum MoveType {
  Timeout,
  Interval,
}

const idList: Obj = {};

const commonMove = (type: MoveType) => {
  const move = (fn: anyFn, speed: number, id: number) => {
    const tipTime = idList[id];
    // 如果 obj 为undefined，说明主动调用了myClear函数，停止即可
    if (tipTime === undefined) return;
    // 获取当前时间戳
    const time = Date.now();
    // 如果当前时间 - 上一次标记时间 >= speed，
    // 说明已经到达执行函数的节点，执行函数，并终止循环
    if (time - tipTime >= speed) {
      if (type === MoveType.Timeout) {
        myClear(id);
        return fn();
      }
      if (type === MoveType.Interval) {
        fn();
        // 因为函数执行是需要时间的，所以为了准确起见，还是重新赋值时间，
        // 而不直接用 time
        idList[id] = Date.now();
      }
    }
    requestAnimationFrame(() => move(fn, speed, id));
  };
  return move;
};

const commonSet = (typefn: anyFn) => {
  return (fn: anyFn, speed: number) => {
    //获取最后一个id，也是id的值最大的那个
    const endId = Math.max(...Object.keys(idList).map(Number));
    // Math.max() 空参数执行结果为 -Infinity，所以需要判断
    // 用过的id不能再用
    const id = endId < 0 ? 0 : endId + 1;
    idList[id] = Date.now();
    typefn(fn, speed, id);
    return id;
  };
};

const myTimeout = commonSet(commonMove(MoveType.Timeout));
const myInterval = commonSet(commonMove(MoveType.Interval));

const myClear = (id: number) => {
  if (idList[id]) {
    delete idList[id];
  }
};

export { myTimeout, myInterval, myClear };
