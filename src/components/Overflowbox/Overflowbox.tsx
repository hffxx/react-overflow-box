import './Overflowbox.css';

import { clsx } from 'clsx';
import React, {
  CSSProperties,
  Dispatch,
  ElementType,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import useDebounce from '../../hooks/useDebounce';

export interface OverflowboxProps {
  children?: ReactNode;
  wrapper?: ElementType;
  showScrollbar?: boolean;
  className?: string;
  disableX?: boolean;
  disableY?: boolean;
  disable?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  onStart?: (...args: any[]) => any;
  onEnd?: (...args: any[]) => any;
  style?: CSSProperties;
  reactRef?: MutableRefObject<HTMLElement | null>;
  // disableScrollWheel?: boolean;
}

export const Overflowbox = (props: OverflowboxProps) => {
  const Wrapper = props.wrapper || 'div';
  const { x = 0, y = 0 } = props;
  const innerRef = useRef<null | HTMLElement>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = props.reactRef || innerRef;

  const debouncedMouseDown = useDebounce<boolean>(mouseDown, 250);

  useEffect(() => {
    if (isDragging) {
      props.onStart?.();
    }
  }, [isDragging, props]);

  useEffect(() => {
    if (!containerRef.current || mounted) {
      return;
    }
    const images = Array.from(containerRef.current.querySelectorAll('img'));

    if (images.length) {
      Promise.all(
        images.map(
          (image) =>
            new Promise((resolve) => {
              if (image.complete) {
                resolve(null);
              } else {
                image.onload = resolve;
              }
            }),
        ),
      ).then(() => {
        setMounted(true);
      });
    } else {
      setMounted(true);
    }
  }, [mounted, containerRef]);

  const scrollTo = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const { width, height } = containerRef.current.getBoundingClientRect();
    const containerWidth = Math.floor(width);
    const containerHeight = Math.floor(height);
    const initialX = x - containerWidth / 2;
    const initialY = y - containerHeight / 2;
    containerRef.current.scrollLeft = initialX;
    containerRef.current.scrollTop = initialY;
  }, [x, y, containerRef]);

  useEffect(() => {
    if (mounted) {
      scrollTo();
    }
  }, [x, y, mounted, scrollTo]);

  // useEffect(() => {
  //   const handleWheel = (e: WheelEvent) => {
  //     e.preventDefault();
  //   };

  //   if (props.disableScrollWheel) {
  //     document.addEventListener('wheel', handleWheel, { passive: false });
  //   } else {
  //     document.removeEventListener('wheel', handleWheel);
  //   }
  //   return () => {
  //     document.removeEventListener('wheel', handleWheel);
  //   };
  // }, [props.disableScrollWheel]);

  const handleMouseLeave = useCallback(() => {
    setMouseDown(false);
    if (mouseDown) {
      setIsDragging(false);
      props.onEnd?.();
    }
  }, [mouseDown, props]);

  const handleMouseUp = useCallback(() => {
    if (mouseDown) {
      setMouseDown(false);
    }
    if (mouseDown && isDragging) {
      props.onEnd?.();
    }
    setIsDragging(false);
  }, [mouseDown, props, isDragging]);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!containerRef.current) {
        return;
      }
      const { offsetLeft, offsetTop, scrollLeft, scrollTop } =
        containerRef.current;
      const x = event.pageX - offsetLeft;
      const y = event.pageY - offsetTop;
      setStartX(x);
      setStartY(y);
      setScrollLeft(scrollLeft);
      setScrollTop(scrollTop);
      setMouseDown(true);
    },
    [containerRef],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!mouseDown || !containerRef.current || props.disable) {
        return;
      }
      const x = event.pageX - containerRef.current.offsetLeft;
      const y = event.pageY - containerRef.current.offsetTop;
      const scrollX = x - startX;
      const scrollY = y - startY;
      setIsDragging(true);
      if (!props.disableX) {
        containerRef.current.scrollLeft = scrollLeft - scrollX;
      }
      if (!props.disableY) {
        containerRef.current.scrollTop = scrollTop - scrollY;
      }
    },
    [
      mouseDown,
      startX,
      startY,
      scrollLeft,
      scrollTop,
      containerRef,
      props.disable,
      props.disableX,
      props.disableY,
    ],
  );

  return (
    <Wrapper
      className={clsx(
        'wrapper',
        !props.showScrollbar && 'hide-scroll',
        mouseDown && 'is-dragging',
        props.className,
        props.disable && 'disabled',
        props.disableX && props.disableY && 'disabled',
      )}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: props.width, height: props.height, ...props.style }}
    >
      {props.children}
    </Wrapper>
  );
};
