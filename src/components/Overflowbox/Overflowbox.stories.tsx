import React, { useRef, useState } from 'react';

import image from './mountains.jpeg';
import { Overflowbox } from './Overflowbox';

export default {
  title: 'Overflowbox',
  component: Overflowbox,
};

export const Default = () => {
  const [x, setX] = useState(0);
  const overflowboxRef = useRef(null);
  return (
    <Overflowbox
      width={500}
      height={300}
      reactRef={overflowboxRef}
      x={x}
      style={{ border: '1px solid red' }}
      onStart={() => console.log('on start')}
      onEnd={() => console.log('on end')}
    >
      <img src={image} alt="" />
    </Overflowbox>
  );
};
