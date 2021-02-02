import React, { useState } from 'react';
import Reverse from './components/reverse';
import Cube from './components/cube';
import './App.css';

function App() {
  const [move, setMove] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const btnReverse = () => {
    setMove((val) => !val);
  };
  const btnCube = () => {
    setIndex((val) => ++val);
  };
  const cubeMaps = Array(6)
    .fill(null)
    .map((item, i) => <div className={`cube cube-${i}`}>{i}</div>);
  const cubeSizeMaps: [[number, number], [number, number]] = [
    [30, 30],
    [70, 30],
  ];
  return (
    <div className="App">
      <div className="App-header">
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
        <div className="type-item">
          <div>
            <Cube planeNode={cubeMaps} planeSize={cubeSizeMaps} index={index} unit="vw" />
          </div>
          <div style={{ marginTop: '100px' }}>
            <button onClick={btnCube}>变换</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
