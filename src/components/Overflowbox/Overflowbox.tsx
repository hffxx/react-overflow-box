import './Overflowbox.css';

import React, {
  CSSProperties,
  ElementType,
  ReactNode,
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
  disableScrollWheel?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  onStart?: (...args: any[]) => any;
  onEnd?: (...args: any[]) => any;
  style?: CSSProperties;
}

export const Overflowbox = (props: OverflowboxProps) => {
  const Wrapper = props.wrapper || 'div';
  const { x = 0, y = 0, className = '' } = props;
  const containerRef = useRef<null | HTMLElement>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [mounted, setMounted] = useState(false);

  const debouncedMouseDown = useDebounce<boolean>(mouseDown, 250);

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
  }, [x, y]);

  useEffect(() => {
    if (mounted) {
      scrollTo();
    }
  }, [x, y, mounted, scrollTo]);

  useEffect(() => {
    if (debouncedMouseDown) {
      props.onStart?.();
    }
  }, [debouncedMouseDown, props]);

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
  }, [mounted]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    if (props.disableScrollWheel) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      document.removeEventListener('wheel', handleWheel);
    }
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [props.disableScrollWheel]);

  const handleMouseLeave = useCallback(() => {
    setMouseDown(false);
    if (debouncedMouseDown) {
      props.onEnd?.();
    }
  }, [props, debouncedMouseDown]);

  const handleMouseUp = useCallback(() => {
    if (mouseDown) {
      setMouseDown(false);
    }
    if (debouncedMouseDown) {
      props.onEnd?.();
    }
  }, [mouseDown, props, debouncedMouseDown]);

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
      className={`'wrapper' ${!props.showScrollbar && 'hide-scroll'} ${
        mouseDown && 'is-dragging'
      } ${props.disable && 'disabled'} ${
        props.disableX && props.disableY && 'disabled'
      } ${className}`}
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
