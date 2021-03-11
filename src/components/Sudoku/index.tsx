import React, { useEffect, useRef, useState } from 'react';
import Style from './index.module.scss';
import SudokuController from './MethodBase';

/**
 *
 */
interface SudokuProps {}

const maps = [
  {
    style: {
      left: 0,
      top: 0,
    },
  },
  {
    style: {
      left: '22vw',
      top: 0,
    },
  },
  {
    style: {
      right: 0,
      top: 0,
    },
  },
  {
    style: {
      right: 0,
      top: '22vw',
    },
  },
  {
    style: {
      right: 0,
      bottom: 0,
    },
  },
  {
    style: {
      right: '22vw',
      bottom: 0,
    },
  },
  {
    style: {
      left: 0,
      bottom: 0,
    },
  },
  {
    style: {
      left: 0,
      top: '22vw',
    },
  },
];

const Sudoku: React.FC<SudokuProps> = (props) => {
  const [index, setIndex] = useState<null | number>(null);
  const SudokuRef = useRef<SudokuController | null>(null);
  useEffect(() => {
    SudokuRef.current = new SudokuController(
      8,
      (index) => {
        setIndex(index);
      },
      100,
    );
  }, []);
  const begin = () => {
    if (SudokuRef.current !== null) {
      SudokuRef.current.start();
    }
  };
  const stop = () => {
    if (SudokuRef.current !== null) {
      SudokuRef.current.stop(5).then((res) => {
        console.log(res);
      });
    }
  };
  return (
    <>
      <div className={Style['Sudoku-box']}>
        {maps.map((item, i) => (
          <div
            style={item.style}
            key={i}
            className={`${Style['Sudoku-item']} ${i === index ? Style['active'] : ''}`}
          >
            {i}
          </div>
        ))}
      </div>
      <button onClick={begin}>开始</button>
      <button onClick={stop}>停</button>
    </>
  );
};

export default Sudoku;
