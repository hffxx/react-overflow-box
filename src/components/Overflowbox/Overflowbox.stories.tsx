import React, { useRef, useState } from 'react';

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
      width={500}
      height={300}
      x={x}
      style={{ border: '1px solid red' }}
      onStart={() => console.log('on start')}
      onEnd={() => console.log('on end')}
    >
      <img src={image} alt="" />
    </Overflowbox>
  );
};
