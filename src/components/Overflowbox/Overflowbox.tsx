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
  setX?: Dispatch<SetStateAction<number>>;
  setY?: Dispatch<SetStateAction<number>>;
  width?: number;
  height?: number;
  onDragStart?: (...args: any[]) => any;
  onDragEnd?: (...args: any[]) => any;
  style?: CSSProperties;
  reactRef?: MutableRefObject<HTMLElement | null>;
  cursor?: CSSProperties['cursor'];
  grabCursor?: CSSProperties['cursor'];
  disableScrollWheel?: boolean;
  smoothScrolling?: boolean;
}

export const Overflowbox = (props: OverflowboxProps) => {
  const {
    x = 0,
    y = 0,
    onDragStart,
    onDragEnd,
    smoothScrolling,
    disable,
    disableX,
    disableY,
    reactRef,
    setY,
    setX,
    showScrollbar,
    disableScrollWheel,
    className,
    width,
    height,
    children,
    grabCursor,
    cursor,
    style,
  } = props;
  const Wrapper = props.wrapper || 'div';

  const [mounted, setMounted] = useState(false);

  const innerRef = useRef<null | HTMLElement>(null);
  const containerRef = reactRef || innerRef;

  const [mouseDown, setMouseDown] = useState(false);
  const [fingerDown, setFingerDown] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [drag, setDrag] = useState(false);

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [axisX, setAxisX] = useState(0);
  const [axisY, setAxisY] = useState(0);

  const [isMouseInside, setIsMouseInside] = useState(false);

  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const scrollTo = useCallback(
    (smooth: boolean) => {
      if (!containerRef.current) {
        return;
      }
      const { width, height } = containerRef.current.getBoundingClientRect();
      const containerWidth = Math.ceil(width);
      const containerHeight = Math.ceil(height);
      if (
        containerRef.current.scrollLeft === x - containerWidth / 2 &&
        containerRef.current.scrollTop === y - containerHeight / 2
      ) {
        return;
      }
      containerRef.current.scrollTo({
        left: x - containerWidth / 2,
        top: y - containerHeight / 2,
        behavior: smooth ? 'smooth' : 'auto',
      });
    },
    [x, y, containerRef],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const images = Array.from(containerRef.current.querySelectorAll('img'));
    if (images.length && !mounted) {
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
        scrollTo(false);
        setMounted(true);
      });
    }
    if (mounted) {
      scrollTo(!!smoothScrolling);
    }
  }, [x, y, scrollTo, containerRef, mounted, smoothScrolling]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    if (disableScrollWheel && isMouseInside) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      document.removeEventListener('wheel', handleWheel);
    }
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [disableScrollWheel, isMouseInside]);

  const handleMouseLeave = useCallback(() => {
    setIsMouseInside(false);
    if (mouseDown) {
      setMouseDown(false);
    }
  }, [mouseDown]);

  const handleMouseUp = useCallback(() => {
    if (mouseDown) {
      setMouseDown(false);
    }
  }, [mouseDown]);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!containerRef.current || disable || (disableX && disableY)) {
        return;
      }
      const { offsetLeft, offsetTop, scrollLeft, scrollTop } =
        containerRef.current;
      const x = event.pageX - offsetLeft;
      const y = event.pageY - offsetTop;
      setStartX(x);
      setStartY(y);
      setAxisX(scrollLeft);
      setAxisY(scrollTop);
      setMouseDown(true);
    },
    [containerRef, disableX, disableY, disable],
  );

  const setNewPosition = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const containerWidth = Math.ceil(width);
      const containerHeight = Math.ceil(height);
      if (!disableX) {
        setX?.(containerRef.current.scrollLeft + containerWidth / 2);
      }
      if (!disableY) {
        setY?.(containerRef.current.scrollTop + containerHeight / 2);
      }
    }
  }, [containerRef, disableX, disableY, setX, setY]);

  const handleTouchMove = useCallback(() => {
    if (disable) {
      return;
    }
    if (!drag) {
      onDragStart?.();
      setDrag(true);
    }
  }, [disable, drag, onDragStart]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!mouseDown || !containerRef.current || disable) {
        return;
      }
      if (!drag) {
        onDragStart?.();
        setDrag(true);
      }
      const x = event.pageX - containerRef.current.offsetLeft;
      const y = event.pageY - containerRef.current.offsetTop;
      const scrollX = x - startX;
      const scrollY = y - startY;
      if (!disableX) {
        containerRef.current.scrollLeft = axisX - scrollX;
      }
      if (!disableY) {
        containerRef.current.scrollTop = axisY - scrollY;
      }
    },
    [
      onDragStart,
      drag,
      mouseDown,
      startX,
      startY,
      axisX,
      axisY,
      containerRef,
      disableY,
      disableX,
      disable,
    ],
  );

  const onScroll = () => {
    if (fingerDown || mouseDown) {
      setScrolling(true);
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
      }
      const newTimeout = setTimeout(() => {
        setScrolling(false);
      }, 100);
      setScrollTimeout(newTimeout);
    }
  };

  useEffect(() => {
    if (!mouseDown || !scrolling) {
      return;
    }
    setNewPosition();
  }, [scrolling, setNewPosition, mouseDown]);

  useEffect(() => {
    if (!fingerDown || !scrolling) {
      return;
    }
    setNewPosition();
  }, [scrolling, setNewPosition, fingerDown]);

  useEffect(() => {
    if (!mouseDown || !fingerDown) {
      setDrag(false);
    }
  }, [mouseDown, fingerDown]);

  useEffect(() => {
    if (drag) {
      if (!mouseDown && !fingerDown) {
        onDragEnd?.();
      }
    }
  }, [drag, onDragEnd, mouseDown, fingerDown]);

  return (
    <Wrapper
      className={clsx(
        'wrapper',
        !showScrollbar && 'hide-scroll',
        mouseDown && 'is-dragging',
        className,
        disable && 'disabled',
        disableX && disableY && 'disabled',
      )}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsMouseInside(true)}
      onTouchStart={() => setFingerDown(true)}
      onTouchEnd={() => setFingerDown(false)}
      onScroll={onScroll}
      style={{
        width: width,
        height: height,
        cursor: mouseDown ? grabCursor : cursor,
        overflowX: disableX || disable ? 'hidden' : 'auto',
        overflowY: disableY || disable ? 'hidden' : 'auto',
        ...style,
      }}
    >
      {children}
    </Wrapper>
  );
};
