import React, { useState, useRef } from 'react';
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
import Demo from './components/other/Demo';
import './App.css';

function App() {
  const [indexReverse, setIndexReverse] = useState<number>(0);
  const [indexCube, setIndexCube] = useState<number>(0);
  const [state, setState] = useState<boolean>(false);
  const CubeRef = useRef({ nowIndex: 0 });
  const ConfettiRef = useRef<any>(null);
  //翻牌子
  const btnReverse = () => {
    setIndexReverse((val) => (val === 0 ? 2 : 0));
  };
  //立方体
  const btnCube = () => {
    const nowIndex = CubeRef.current.nowIndex + 1;
    //const key = (Math.random() * 4) >> 0;
    const key = nowIndex % 4;
    const n = [0, 1, 2, 3][key];
    console.log(n);
    setIndexCube(n);
    CubeRef.current.nowIndex = nowIndex;
  };
  //箭头
  const btnArrows = () => {
    setState((val) => !val);
  };
  return (
    <div className="App">
      <div className="App-header">
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
              planeSize={[70, 100, 0]}
              index={indexReverse}
              unit="vw"
              direction="row-reverse"
              fixed={false}
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
              planeSize={[70, 70, 70]}
              index={indexCube}
              unit="vw"
              direction="row-reverse"
              fixed={true}
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
            <Arrows state={state} deg={40} width={20} />
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
            <WebGLRole />
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={btnArrows}>变换</button>
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
