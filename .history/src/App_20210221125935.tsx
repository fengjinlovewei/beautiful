import React, { useState } from 'react';
import Reverse from './components/reverse';
import Cube from './components/cube';
import Demo from './components/demo';
import './App.css';

function App() {
  const [move, setMove] = useState<boolean>(false);
  const [index, setIndex] = useState<0 | 1 | 2 | 3 | 4 | 5>(3);
  const btnReverse = () => {
    setMove((val) => !val);
  };
  const btnCube = () => {
    setIndex((val) => ++val);
  };
  const cubeMaps = Array(6)
    .fill(null)
    .map((item, i) => <div className={`cube cube-${i}`}>{i}</div>);
  const cubeSizeMaps = [10, 10, 10];
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
            <Cube planeNode={cubeMaps} planeSize={cubeSizeMaps} index={index} unit="vw" />
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
