function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default (context: any) => {
  return {
    // 一小发
    BasicCannon() {
      context({
        //particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
      });
    },
    // 一小发（随机方向）
    RandomDirection() {
      context({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
      });
    },
    // 一大发
    RealisticLook() {
      const count = 200;
      const defaults = {
        origin: { y: 0.8 },
      };

      function fire(particleRatio: number, opts: any) {
        context(
          Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
          }),
        );
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    },
    // 多发（随机方向）
    RandomFireworks() {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        context(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          }),
        );
        context(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          }),
        );
      }, 250);
    },
    // 下雪花
    Snow() {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      let skew = 1;
      (function frame() {
        const timeLeft = animationEnd - Date.now();
        const ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        context({
          particleCount: 1,
          startVelocity: 0,
          ticks: ticks,
          gravity: 0.5,
          origin: {
            x: Math.random(),
            // since particles fall down, skew start toward the top
            y: Math.random() * skew - 0.2,
          },
          colors: ['#ffffff'],
          shapes: ['circle'],
          scalar: randomInRange(0.4, 1),
        });

        if (timeLeft > 0) {
          requestAnimationFrame(frame);
        }
      })();
    },
    // 连发
    SchoolPride(s: number = 4) {
      const end = Date.now() + s * 1000;
      // go Buckeyes!
      const colors = ['#bb0000', '#ffffff'];

      (function frame() {
        context({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        context({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    },
  };
};
