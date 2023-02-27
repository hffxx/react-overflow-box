/* eslint-disable no-console */
import React, { useState } from 'react';

import image from './mountains.jpeg';
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
      x={400}
      style={{ border: '1px solid red' }}
      onMoveStart={() => console.log('on move Start')}
      onMoveEnd={() => console.log('on move End')}
      onDragStart={() => console.log('on drag start')}
      onDragEnd={() => console.log('on drag end')}
    >
      <img src={image} alt="" />
    </Overflowbox>
  );
};
