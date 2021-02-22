import React, { useState, useRef } from 'react';
import Reverse from './components/reverse';
import Cube from './components/cube';
import Demo from './components/demo';
import './App.css';

function App() {
  const [move, setMove] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const data = useRef({ nowIndex: 0 });
  const btnReverse = () => {
    setMove((val) => !val);
  };
  const btnCube = () => {
    const nowIndex = data.current.nowIndex + 1;
    //const key = (Math.random() * 4) >> 0;
    const key = nowIndex % 4;
    const n = [0, 1, 2, 3][key];
    console.log(n);
    setIndex(n);
    data.current.nowIndex = nowIndex;
  };
  const cubeMaps = Array(6)
    .fill(null)
    .map((item, i) => <div className={`cube cube-${i}`}>{i}</div>);
  const cubeSizeMaps = [30, 30, 30];
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
              speed={0.5}
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
              planeNode={cubeMaps}
              planeSize={cubeSizeMaps}
              index={index}
              unit="vw"
              direction="row-reverse"
              fixed={true}
            />
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={btnCube}>变换</button>
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
