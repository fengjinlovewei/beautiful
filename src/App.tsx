import React, { useState, useRef, useCallback } from 'react';

import Reverse from './components/other/Reverse';

import Cube from './components/Cube';
import Fireworks from './components/Fireworks';
import Arrows from './components/Arrows';
import Confetti, {
  BasicCannon,
  RandomDirection,
  RealisticLook,
  RandomFireworks,
  Snow,
  SchoolPride,
} from './components/Confetti';
import WebGLSnow from './components/OasisEngine/Snow';
import WebGLRole from './components/OasisEngine/Role';
import LuckyWheel from './components/LuckyWheel';
import Sudoku from './components/Sudoku';
import Demo from './components/other/Demo';
import './App.css';

function App() {
  const [move, setMove] = useState<boolean>(false);
  const [indexReverse, setIndexReverse] = useState<number>(0);
  const [indexCube, setIndexCube] = useState<number>(0);
  const [state, setState] = useState<boolean>(false);
  const CubeRef = useRef({ nowIndex: 0 });
  const ConfettiRef = useRef<any>(null);
  const roleRef = useRef<any>(null);
  const btnMove = () => {
    setMove((val) => !val);
  };
  //翻牌子
  const btnReverse = () => {
    setIndexReverse((val) => (val === 0 ? 2 : 0));
  };
  //立方体
  const direction = 'row';
  // 固定轨迹
  const fixed = false;
  const btnCube = () => {
    const nowIndex = CubeRef.current.nowIndex + 1;
    //const key = (Math.random() * 4) >> 0;
    const key = nowIndex % 4;
    const n = [0, 3, 2, 1][key];
    console.log(n);
    setIndexCube(n);
    CubeRef.current.nowIndex = nowIndex;
  };
  //箭头
  const btnArrows = () => {
    setState((val) => !val);
  };
  const roleCallBack = useCallback((obj) => {
    console.log(obj);
    roleRef.current = obj;
  }, []);
  const btnRole = (type: number) => {
    if (roleRef.current) {
      const { animator, animations } = roleRef.current;
      if (type === 1) {
        console.log(1);
        animator.playAnimationClip('walk');
      }
      if (type === 2) {
        animator.playAnimationClip(animations[0].name);
      }
      if (type === 3) {
        animator.playAnimationClip(animations[0].name);
      }
    }
  };
  return (
    <div className="App">
      <div className="App-header">
        {/* 翻牌子 */}
        <div className="type-item">
          <div>
            <Reverse
              front={<div className="d1">正面</div>}
              back={<div className="d2">背面</div>}
              move={move}
            />
          </div>
          <div>
            <button onClick={btnMove}>变换</button>
          </div>
        </div>
        {/* 翻牌子 */}
        <div className="type-item">
          <div>
            <Cube
              planeNode={[
                <div className={`cube cube-0`}>0</div>,
                '',
                <div className={`cube cube-2`}>2</div>,
                '',
                '',
                '',
              ]}
              planeSize={[40, 60, 0]}
              index={indexReverse}
              unit="vw"
              direction="row-reverse"
              fixed={false}
              perspective={800}
            />
          </div>
          <div>
            <button onClick={btnReverse}>变换</button>
          </div>
        </div>
        {/* 立方体 */}
        <div className="type-item">
          <div>
            <Cube
              planeNode={[
                <div className={`cube cube-0`}>0</div>,
                <div className={`cube cube-1`}>1</div>,
                <div className={`cube cube-2`}>2</div>,
                <div className={`cube cube-3`}>3</div>,
                <div className={`cube cube-4`}>4</div>,
                <div className={`cube cube-5`}>5</div>,
              ]}
              planeSize={[200, 200, 200]}
              index={indexCube}
              unit="px"
              direction={direction}
              fixed={fixed}
            />
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={btnCube}>变换</button>
          </div>
        </div>
        {/* 烟花 */}
        <div className="type-item">
          <div className="Fireworks-box">
            <Fireworks
              color="111"
              width={1800}
              height={900}
              count={350}
              interval={35}
              length={[1, 8]}
            />
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={btnCube}>变换</button>
          </div>
        </div>
        {/* 箭头 */}
        <div className="type-item">
          <div>
            <Arrows state={state} deg={100} width={20} direction="row" />
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={btnArrows}>变换</button>
          </div>
        </div>
        {/* 五彩纸屑 */}
        <div className="type-item">
          <div>
            <p>五彩纸屑</p>
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={() => BasicCannon()}>一小发</button>
            <button onClick={() => RandomDirection()}>一小发（随机方向）</button>
            <button onClick={() => RealisticLook()}>一大发</button>
            <button onClick={() => RandomFireworks()}>多发（随机方向）</button>
            <button onClick={() => Snow()}>下雪花</button>
            <button onClick={() => SchoolPride()}>连发</button>
          </div>
          <div>
            <p>五彩纸屑dom版</p>
          </div>
          <div>
            <Confetti width="320px" height="380px" ref={ConfettiRef}></Confetti>
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={() => ConfettiRef.current.BasicCannon()}>一小发</button>
            <button onClick={() => ConfettiRef.current.RandomDirection()}>
              一小发（随机方向）
            </button>
            <button onClick={() => ConfettiRef.current.RealisticLook()}>一大发</button>
            <button onClick={() => ConfettiRef.current.RandomFireworks()}>多发（随机方向）</button>
            <button onClick={() => ConfettiRef.current.Snow()}>下雪花</button>
            <button onClick={() => ConfettiRef.current.SchoolPride()}>连发</button>
          </div>
        </div>
        {/* webGL 的雪花*/}
        <div className="type-item">
          <div>
            <WebGLSnow />
            {/* <WebGLRole callback={roleCallBack} /> */}
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={() => btnRole(1)}>变换</button>
          </div>
        </div>
        {/* 大转盘*/}
        <div className="type-item">
          <div>
            <LuckyWheel></LuckyWheel>
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={() => btnRole(1)}>变换</button>
          </div>
        </div>
        {/* 九宫格*/}
        <div className="type-item">
          <div>
            <Sudoku></Sudoku>
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={() => btnRole(1)}>变换</button>
          </div>
        </div>
      </div>
      <div className="type-item">
        <Demo text="我是1"></Demo>
      </div>
      <div className="type-item">
        <Demo text="我是2"></Demo>
      </div>
    </div>
  );
}

export default App;
