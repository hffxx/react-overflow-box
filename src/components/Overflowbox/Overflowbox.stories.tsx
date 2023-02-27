/* eslint-disable no-console */
import React, { useState } from 'react';

import elo from './elo.png';
import { Overflowbox } from './Overflowbox';

export default {
  title: 'Overflowbox',
  component: Overflowbox,
};

export const Default = () => {
  const [x, setX] = useState(0);

  return (
    <Overflowbox
      width={300}
      height={300}
      style={{ border: '1px solid red' }}
      onMoveStart={() => console.log('on move Start')}
      onMoveEnd={() => console.log('on move End')}
      onDragStart={() => console.log('on drag start')}
      onDragEnd={() => console.log('on drag end')}
      showScrollbar
      x={1920 / 2}
      y={1080 / 2}
    >
      <img src={elo} alt="" />
    </Overflowbox>
  );
};
