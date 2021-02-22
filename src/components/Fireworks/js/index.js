// 从这个范围内，得出随机值
export const randomBetween = (from, to) => {
  return Math.random() * (to - from) + from;
};
export class Fireworks {
  constructor(node, option = {}) {
    const { color, interval = 80, count = 200, length = [5, 5] } = option;
    this.canvas = node;
    this.start = true;
    this.timer = null;
    this.ctx = this.canvas.getContext('2d');
    // `hsla(${color}, 100%, ${this.brightness(65-75)}%, ${this.opacity})`
    // color 值是hsla模式中第一个值

    this.color = this.getColor(color);
    // 粒子爆炸尾巴长度
    this.length = () => randomBetween(...length) >> 0;
    this.controller = {
      particle: {
        list: new Set(),
        count: count,
        length: 3,
      },
      firework: {
        list: new Set(),
        // 设置随机焰火产生的间隔，以及将产生多少焰火
        timer: {
          current: 40,
          random: 35,
          total: interval || 40, //数值越大，频率越低
          batch: 1,
          reset: () => {
            this.controller.firework.timer.current = randomBetween(
              0,
              this.controller.firework.timer.random,
            );
            return this.controller.firework.timer;
          },
        },
      },
      // 背景星星数
      star: {
        list: new Set(),
        count: 0,
      },

      // 重力加速度
      // 值越大，物体向地面的拉力就越大
      gravity: 0.1,

      // 定义将当前队列保存为前一个队列的时间
      // 值越大，跟踪时间越长
      trail: {
        length: 0,
        width: 8,
      },

      // 定义焰火的起始位置
      launchPosition: {
        x: undefined,
        y: undefined,
        update: () => {
          this.controller.launchPosition.x = this.canvas.width / 2;
          this.controller.launchPosition.y = this.canvas.height;

          return this.controller.launchPosition;
        },
      },

      // 在画布上定义烟花将击中的区域
      targetRectangle: {
        x1: undefined,
        x2: undefined,
        y1: undefined,
        y2: undefined,
        update: () => {
          this.controller.targetRectangle.x1 = this.canvas.width * 0.25;
          this.controller.targetRectangle.x2 = this.canvas.width * 0.75;
          this.controller.targetRectangle.y1 = this.canvas.height * 0.25;
          this.controller.targetRectangle.y2 = this.canvas.height * 0.5;

          return this.controller.targetRectangle;
        },
      },
    };
    this.mouse = {
      x: 0,
      y: 0,
      isPressed: false,
      limiter: {
        current: 10,
        target: 10,
        reset: () => {
          this.mouse.limiter.current = 0;
        },
      },
    };

    this.init();
  }

  init() {
    this.updateCanvas();
    this.createNewStars();
    this.loop();
  }
  getColor(color) {
    if (typeof color === 'string' && color) {
      let arr = color.split(',');
      if (arr.length === 2) {
        return () => randomBetween(arr[0], arr[1]);
      }
      if (arr.length === 1) {
        return () => color;
      }
    }
    return () => randomBetween(0, 360);
  }
  clear() {
    window.cancelAnimationFrame(this.timer);
  }
  move() {
    // 偶尔发射随机烟火，以防止画布是空的
    this.makeRandomFireworks();
    //console.log(9999);
    // 清除之前循环中绘制的所有内容
    this.clearCanvas();

    // 绘制并更新所有内容
    this.controller.firework.list.forEach((firework) => {
      if (firework.reachedTarget) {
        firework.explode();
      } else {
        firework.update().draw();
      }
    });

    this.controller.particle.list.forEach((particle) => {
      if (particle.disappeared) {
        this.controller.particle.list.delete(particle);
      } else {
        particle.update().draw();
      }
    });

    this.controller.star.list.forEach((star) => {
      if (star.disappeared) {
        this.controller.star.list.delete(star);
      } else {
        star.update().draw();
      }
    });
    this.createNewStars();

    // 单击生成烟火，将达到鼠标的位置
    if (this.mouse.isPressed) this.makeMouseGeneratedFirework();
  }
  loop() {
    this.move();
    this.timer = window.requestAnimationFrame(this.loop.bind(this, Date.now()));
  }
  updateCanvas() {
    // 使画布填充整个文档
    // 基于新的画布尺寸更新启动位置和目标位置
    this.controller.launchPosition.update();
    this.controller.targetRectangle.update();
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 使粒子相互重叠
    this.ctx.globalCompositeOperation = 'lighter';
  }
  makeRandomFireworks() {
    // controller.firework.timer.total 设置随机烟火产生的间隔
    this.controller.firework.timer.current++;
    if (this.controller.firework.timer.current >= this.controller.firework.timer.total) {
      for (let i = 0; i < this.controller.firework.timer.batch; i++) {
        // 在目标区域内随机选择一个点
        const randomCoords = {
          x: randomBetween(this.controller.targetRectangle.x1, this.controller.targetRectangle.x2),
          y: randomBetween(this.controller.targetRectangle.y1, this.controller.targetRectangle.y2),
        };
        this.controller.firework.list.add(
          new Firework(
            this.controller.launchPosition.x,
            this.controller.launchPosition.y,
            randomCoords.x,
            randomCoords.y,
            this,
          ),
        );
      }
      this.controller.firework.timer.reset();
    }
  }
  makeMouseGeneratedFirework() {
    if (this.mouse.limiter.current >= this.mouse.limiter.target) {
      this.controller.firework.list.add(
        new Firework(
          this.controller.launchPosition.x,
          this.controller.launchPosition.y,
          this.mouse.x,
          this.mouse.y,
          this,
        ),
      );
      this.mouse.limiter.reset();
    } else {
      this.mouse.limiter.current++;
    }
  }
  createNewStars() {
    while (this.controller.star.list.size < this.controller.star.count) {
      this.controller.star.list.add(new Star(this));
    }
  }
}
class Firework {
  // 烟花是用给定的起点和目标点在画布上构造的
  constructor(startX, startY, targetX, targetY, context) {
    this.context = context;
    this.coords = {
      current: {
        x: startX,
        y: startY,
      },
      previous: new Array(this.context.controller.trail.length).fill({
        x: startX,
        y: startY,
      }),
      target: {
        x: targetX,
        y: targetY,
      },
    };

    // 通过知道重力加速度、起始点和目标点，可以计算出弹丸在重力场中的初速度和运动时间

    // a -> 重力加速度(恒定重力)
    // v0 -> 初始y轴速度
    // u0 -> 初始x轴速度
    // t -> time in air 在空中的时间
    // h -> 沿着y轴移动的高度(startY - targetY) ->在canvas中，我们认为“更高”的点具有较低的y值，因为值从上到下递增)
    // s -> 沿x轴移动的距离(targetX - startX)

    this.velocity = {
      // 我们希望当弹丸到达目标时，y轴速度逐渐降低并达到0

      // y轴抛物运动方程:
      // v0 = at
      // h = v0t - at^2/2

      // 因此 v0 = sqrt(2ah)
      y: Math.sqrt(2 * this.context.controller.gravity * (startY - targetY)),

      // 同时，它也应该到达它的x轴目的地:
      // u0 = s / t

      // 我们已经知道了y轴速度，所以我们可以计算在空中的时间:
      // t = v0 / a,

      // so:
      // u0 = s / (v0 / a)
      // u0 = s * a / v0

      x:
        ((targetX - startX) * this.context.controller.gravity) /
        Math.sqrt(2 * this.context.controller.gravity * (startY - targetY)),
    };

    // 这个属性存储烟花已经旅行和应该旅行的时间
    this.time = {
      inAir: 0,

      // t = v0 / a
      toTravel: this.velocity.y / this.context.controller.gravity,
    };

    // 此属性存储指示烟花目标的环的值
    this.ring = {
      hue: 0,
      angle: 0,
      sector: (Math.PI * 4) / 3, // 整个圆的 0.66
    };

    this.gravity = this.context.controller.gravity;
  }

  update() {
    // 更新空中时间
    this.time.inAir++;

    // 将当前坐标保存为上一个坐标
    this.coords.previous.push({
      x: this.coords.current.x,
      y: this.coords.current.y,
    });
    this.coords.previous.splice(0, 1);

    // 更新坐标
    this.coords.current.x += this.velocity.x;
    this.coords.current.y -= this.velocity.y;

    // 更新速度
    this.velocity.y -= this.gravity;
    // this.velocity.x 不会改变(我们在计算中不包括拖拽)

    // 更新目标圆
    this.ring.hue += 2;
    this.ring.angle += 0.04;

    return this;
  }

  draw() {
    this.drawTrail();
    // 对不起，我不喜欢这个环，不要给妇女套环
    //this.drawRing();

    return this;
  }

  drawTrail() {
    this.context.ctx.beginPath();
    this.context.ctx.moveTo(this.coords.current.x, this.coords.current.y);

    for (let i = this.coords.previous.length - 1; i > 0; i--) {
      const position = this.coords.previous[i];

      this.context.ctx.lineTo(position.x, position.y);
      this.context.ctx.lineWidth = this.context.controller.trail.width;

      const opacity = i / this.context.controller.trail.length;

      this.context.ctx.strokeStyle = `hsla(40, 100%, 80%, ${opacity * 100}%)`;
      this.context.ctx.stroke();

      // 如果这不是数组中的最后一个位置，开始画新行
      if (i != 1) {
        this.context.ctx.beginPath();
        this.context.ctx.moveTo(position.x, position.y);
      }
    }
  }

  drawRing() {
    this.context.ctx.beginPath();
    this.context.ctx.arc(
      this.coords.target.x,
      this.coords.target.y,
      8,
      this.ring.angle,
      this.ring.angle + (Math.PI * 4) / 3,
    );

    let opacity = 1;
    //当烟花靠近目标时，环会慢慢消失
    if (this.time.toTravel - this.time.inAir < 40) {
      opacity = (this.time.toTravel - this.time.inAir) / 40; // 返回0到1之间的分数
    }
    this.context.ctx.strokeStyle = `hsla(${this.ring.hue}, 100%, 10%, ${opacity})`;
    this.context.ctx.lineWidth = 2;
    this.context.ctx.stroke();
  }

  explode() {
    // 为同一烟花中的粒子选择一个随机的颜色 // 随机randomBetween(0, 360)
    const givenHue = this.context.color();
    // 粒子爆炸尾巴长度
    const length = this.context.length();
    // 在爆炸位置创建新的粒子
    for (let i = 0; i < this.context.controller.particle.count; i++) {
      this.context.controller.particle.list.add(
        new Particle(this.coords.target.x, this.coords.target.y, givenHue, this.context, length),
      );
    }

    // 创建粒子后，从集合中删除烟花
    this.context.controller.firework.list.delete(this);
  }

  get reachedTarget() {
    return this.time.inAir >= this.time.toTravel;
  }
}
class Particle {
  constructor(startX, startY, givenHue, context, length) {
    this.context = context;
    this.coords = {
      current: {
        x: startX,
        y: startY,
      },
      //this.context.controller.particle.length
      previous: new Array(length).fill({
        x: startX,
        y: startY,
      }),
    };

    // 设置随机发射角度和速度
    this.angle = randomBetween(0, Math.PI * 2);
    this.velocity = randomBetween(0, 10);

    // 为同一焰火中的所有粒子设置稍微不同的色调
    this.hue = givenHue + randomBetween(-10, 10);

    this.brightness = randomBetween(65, 75);
    this.opacity = 1;

    // 设定粒子消失的速度
    this.fade = randomBetween(0.01, 0.03);
  }

  update() {
    // 删除最后一个坐标并push新的坐标
    this.coords.previous.shift();
    this.coords.previous.push([this.coords.current.x, this.coords.current.y]);
    // 使粒子减速
    this.velocity *= 0.95;
    // 改变坐标
    this.coords.current.x += Math.cos(this.angle) * this.velocity;
    this.coords.current.y +=
      Math.sin(this.angle) * this.velocity + this.context.controller.gravity * 10;
    // 改变透明度
    this.opacity -= this.fade;
    // 移除不可见的粒子以防止性能问题

    return this;
  }

  draw() {
    // 移动到前一个位置，并画线到当前的位置
    this.context.ctx.beginPath();
    this.context.ctx.lineWidth = randomBetween(2, 4);
    this.context.ctx.moveTo(this.coords.previous[0][0], this.coords.previous[0][1]);
    this.context.ctx.lineTo(this.coords.current.x, this.coords.current.y);
    this.context.ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.opacity})`;
    this.context.ctx.stroke();

    return this;
  }

  get disappeared() {
    return this.opacity < this.fade;
  }
}
class Star {
  constructor(context) {
    this.context = context;
    this.coords = {
      x: Math.floor(randomBetween(0, this.context.canvas.width)),
      y: Math.floor(randomBetween(0, this.context.canvas.height)),
    };
    this.size = Math.ceil(randomBetween(0, 2));
    this.life = {
      current: 0,
      target: Math.floor(randomBetween(150, 300)),
    };
    this.opacity = 0;
  }
  update() {
    this.life.current++;

    // 在开始时增加星星的透明度，最后逐渐淡入
    if (this.life.current < 50) {
      this.opacity = this.life.current / 50; // 从0增加到1
    } else if (this.life.current > this.life.target - 50) {
      this.opacity = (this.life.target - this.life.current) / 50; // 从1减少到0
    } else this.opacity = 1;

    return this;
  }

  draw() {
    // 用圆圈画星星
    this.context.ctx.beginPath();
    this.context.ctx.arc(this.coords.x, this.coords.y, this.size, 0, 2 * Math.PI);
    this.context.ctx.fillStyle = `hsla(60, 100%, 20%, ${this.opacity}`;
    this.context.ctx.fill();

    return this;
  }

  get disappeared() {
    return this.opacity < 0;
  }
}
