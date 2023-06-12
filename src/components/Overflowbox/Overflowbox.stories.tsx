/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';

import elo from './elo.png';
import { Overflowbox } from './Overflowbox';

export default {
  title: 'Overflowbox',
  component: Overflowbox,
};

export const Default = () => {
  const [x, setX] = useState(1920 / 2);
  const [y, setY] = useState(1080 / 2);

  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <Overflowbox
        width={500}
        height={500}
        x={x}
        y={y}
        setX={setX}
        setY={setY}
        smoothScrolling
        onDragStart={() => console.log('drag start')}
        onDragEnd={() => console.log('drag end')}
      >
        <img src={elo} alt="" />
      </Overflowbox>
      <button
        onClick={() => {
          setX(1920 / 2);
          setY(1080 / 2);
        }}
      >
        scroll to mid
      </button>
      <button
        onClick={() => {
          setX(0);
          setY(0);
        }}
      >
        scroll to 0
      </button>
      <div>{isDragging ? 'is drag' : 'no drag'}</div>
    </>
  );
};
