// 可以传入任意类型参数值/返回任意类型值的函数
type anyFn = (...args: any[]) => any;
class SudokuController {
  private list: any[]; // 数组
  private length: number; // 需要模的数
  private callback: anyFn; // 回调函数
  private speed: number; // 速度
  private originSpeed: number; // 原速度
  private timer: number | null; // 定时器id
  private tipTime: number; // 时间标记
  private currentTime: number; // 当前运动次数
  private targetTime: number; // 目标运动次数 是否存在目标index，-1为不存在, 正数为存在的index
  private resolve: (value: any) => any;

  constructor(list: any[] | number, callback: anyFn, speed: number = 70) {
    this.list = (() => {
      if (typeof list === 'number') {
        return Array(list)
          .fill(null)
          .map((item, i) => i);
      }
      return list;
    })();
    this.length = this.list.length;
    this.callback = callback;
    this.speed = Math.min(Math.max(speed, 20), 500);
    this.originSpeed = this.speed;
    this.timer = null;
    this.currentTime = 0;
    this.targetTime = -1;
    this.tipTime = 0;
    this.resolve = () => {};
  }
  end() {
    if (!this.timer) return;
    cancelAnimationFrame(this.timer);
    this.timer = null;
    this.resolve('end');
  }

  stop(endIndex: number): Promise<any> {
    //debugger;
    // 当前位置相对于整圈的距离
    const tip = this.length - (this.currentTime % this.length) + this.currentTime;
    // 目标次数
    let quan = ((1 / this.speed) * 150) >> 0;
    // 不能小于1，大于5
    quan = Math.min(Math.max(quan, 0), 5) * this.length;
    this.targetTime = quan + tip + endIndex;
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  step() {
    const time = Date.now();
    // 如果没有设置结束点 就匀速不停旋转
    // 如果设置了结束点 就减速到达结束点

    if (time - this.tipTime >= this.speed) {
      this.callback(this.currentTime % this.length);
      this.tipTime = Date.now();
      this.currentTime++;
      // 说明已经触发了停止
      if (this.targetTime !== -1) {
        this.speed *= 1 + 0.6 / this.length;
      }
    }
    if (this.currentTime - 1 === this.targetTime && this.targetTime !== -1) {
      return this.end();
    }
    this.timer = requestAnimationFrame(() => this.step());
  }

  start() {
    if (this.timer) return;
    this.targetTime = -1;
    this.currentTime = 0;
    this.speed = this.originSpeed;
    this.tipTime = Date.now();
    this.timer = requestAnimationFrame(() => this.step());
  }
}

export default SudokuController;
