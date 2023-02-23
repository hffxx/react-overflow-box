import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface OverflowboxState {
  x: number;
  y: number;
  setX: Dispatch<SetStateAction<number>>;
  setY: Dispatch<SetStateAction<number>>;
}

const OverflowboxConext = createContext<OverflowboxState | null>(null);

export const OverflowboxConextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  return (
    <OverflowboxConext.Provider value={{ x, y, setX, setY }}>
      {children}
    </OverflowboxConext.Provider>
  );
};

export const useOverflowbox = () => {
  const overflowboxState = useContext(OverflowboxConext);
  if (!overflowboxState) {
    throw new Error('overflowboxProvider error');
  }
  return overflowboxState;
};
