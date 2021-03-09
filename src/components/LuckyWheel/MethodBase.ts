class Wheel {
  private speed: number; // 速度
  private pointer: any; // 旋转dom
  private timer: number | null; // 定时器id
  private currentDeg: number; // 当前度数
  private targetDeg: number; //是否存在目标度数，-1为不存在, 正数为存在的度数。
  private resolve: (value: any) => any;

  constructor(pointer: any, speed: number = 30) {
    this.speed = speed;
    this.pointer = pointer;
    this.timer = null;
    this.currentDeg = 0;
    this.targetDeg = -1;
    this.resolve = () => {};
    this.init();
  }

  init() {
    // 初始化样式设定
    this.setStyle();
  }
  setStyle(deg: number = 0) {
    this.pointer.style.transform = `translate3d(0,0,0) rotate(${deg}deg)`;
  }
  end() {
    if (!this.timer) return;
    cancelAnimationFrame(this.timer);
    this.timer = null;
    this.resolve('end');
  }

  stop(endDeg: number): Promise<any> {
    //debugger;
    // 根据目标相对度数，和当前度数，求出实际的度数
    const tip = 360 - (this.currentDeg % 360) + endDeg;
    // 随机旋转几圈再停止
    // 速度越快，惯力越大，圆盘质量不变，点击停止时额外转动的圈数就应该越多。
    const tail = (((this.speed / 10) >> 0) + 1) * 360;
    this.targetDeg = this.currentDeg + tip + tail;
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  step() {
    // 如果没有设置结束点 就匀速不停旋转
    // 如果设置了结束点 就减速到达结束点
    if (this.targetDeg === -1) {
      this.currentDeg += this.speed;
    } else {
      // 目标度数 - 当前度数 = 剩余度数
      // 减速系数度数
      let coefficientDeg = (this.targetDeg - this.currentDeg) / (this.speed * 2);

      coefficientDeg =
        coefficientDeg > this.speed ? this.speed : coefficientDeg < 0.5 ? 0.5 : coefficientDeg;

      this.currentDeg += coefficientDeg;
      this.currentDeg = this.currentDeg > this.targetDeg ? this.targetDeg : this.currentDeg;
    }
    // 指针旋转
    this.setStyle(this.currentDeg % 360);

    if (this.currentDeg === this.targetDeg) {
      this.end();
    } else {
      this.timer = requestAnimationFrame(() => this.step());
    }
  }

  start() {
    if (this.timer) return;
    this.targetDeg = -1;
    this.currentDeg = 0;
    this.setStyle();
    this.timer = requestAnimationFrame(() => this.step());
  }
}

export default Wheel;
