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
  onMoveStart?: (...args: any[]) => any;
  onMoveEnd?: (...args: any[]) => any;
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
    onMoveStart,
    onDragStart,
    disable,
    onDragEnd,
    onMoveEnd,
    smoothScrolling,
    disableX,
    disableScrollWheel,
    disableY,
    reactRef,
    setY,
    setX,
    showScrollbar,
    className,
    width,
    height,
    children,
    grabCursor,
    cursor,
    style,
  } = props;
  const Wrapper = props.wrapper || 'div';

  const innerRef = useRef<null | HTMLElement>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [axisX, setAxisX] = useState(0);
  const [axisY, setAxisY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  const [isMove, setIsMove] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const containerRef = reactRef || innerRef;

  //Mount after all images are loaded
  useEffect(() => {
    if (!containerRef.current || mounted) {
      return;
    }
    const images = Array.from(containerRef.current.querySelectorAll('img'));
    const { width, height } = containerRef.current.getBoundingClientRect();
    const containerWidth = Math.ceil(width);
    const containerHeight = Math.ceil(height);
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
        //initial scroll
        containerRef.current?.scrollTo({
          left: x - containerWidth / 2,
          top: y - containerHeight / 2,
          behavior: 'auto',
        });
        setMounted(true);
      });
    } else {
      setMounted(true);
    }
  }, [mounted, containerRef, x, y]);

  const scrollTo = useCallback(() => {
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
      behavior: smoothScrolling ? 'smooth' : 'auto',
    });
  }, [x, y, containerRef, smoothScrolling]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    if (mounted) {
      scrollTo();
    }
  }, [scrollTo, containerRef, mounted]);

  //Disable scroll wheel
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
    if (disable) {
      return;
    }
    if (mouseDown) {
      if (isDrag) {
        onDragEnd?.();
      }
      if (isMove) {
        onMoveEnd?.();
      }
      setMouseDown(false);
      setIsMove(false);
      setIsDrag(false);
    }
  }, [mouseDown, isDrag, isMove, disable, onDragEnd, onMoveEnd]);

  const handleMouseUp = useCallback(() => {
    if (disable) {
      return;
    }
    if (mouseDown) {
      if (isDrag) {
        onDragEnd?.();
      }
      if (isMove) {
        onMoveEnd?.();
      }
      setMouseDown(false);
      setIsMove(false);
      setIsDrag(false);
    }
  }, [mouseDown, disable, isDrag, isMove, onDragEnd, onMoveEnd]);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!containerRef.current || disable || (disableX && disableY)) {
        return;
      }
      const { offsetLeft, offsetTop, scrollLeft, scrollTop } =
        containerRef.current;

      const { clientX, clientY } = event.touches[0];
      const x = clientX - offsetLeft;
      const y = clientY - offsetTop;
      setStartX(x);
      setStartY(y);
      setAxisX(scrollLeft);
      setAxisY(scrollTop);
      setMouseDown(true);
    },
    [disableX, disableY, disable, containerRef],
  );

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

  const handleTouchMove = useCallback(() => {
    if (!mouseDown || !containerRef.current || disable) {
      return;
    }
    if (!isDrag) {
      onDragStart?.();
      setIsDrag(true);
    }

    const { width, height } = containerRef.current.getBoundingClientRect();
    const containerWidth = Math.ceil(width);
    const containerHeight = Math.ceil(height);

    if (!disableX) {
      setX?.(containerRef.current.scrollLeft + containerWidth / 2);
    }
    if (!disableY) {
      setY?.(containerRef.current.scrollTop + containerHeight / 2);
    }
  }, [
    mouseDown,
    containerRef,
    onDragStart,
    isDrag,
    disableY,
    disableX,
    setX,
    setY,
    disable,
  ]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!mouseDown || !containerRef.current || disable) {
        return;
      }
      if (!isDrag) {
        onDragStart?.();
        setIsDrag(true);
      }
      const x = event.pageX - containerRef.current.offsetLeft;
      const y = event.pageY - containerRef.current.offsetTop;
      const scrollX = x - startX;
      const scrollY = y - startY;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const containerWidth = Math.ceil(width);
      const containerHeight = Math.ceil(height);

      if (!disableX) {
        containerRef.current.scrollLeft = axisX - scrollX;
        setX?.(containerRef.current.scrollLeft + containerWidth / 2);
      }
      if (!disableY) {
        containerRef.current.scrollTop = axisY - scrollY;
        setY?.(containerRef.current.scrollTop + containerHeight / 2);
      }
    },
    [
      mouseDown,
      startX,
      startY,
      axisX,
      axisY,
      containerRef,
      onDragStart,
      isDrag,
      disableY,
      disableX,
      setX,
      setY,
      disable,
    ],
  );

  const onScroll = useCallback(() => {
    if (!mouseDown) {
      return;
    }
    if (!isMove) {
      onMoveStart?.();
      setIsMove(true);
    }
  }, [onMoveStart, isMove, mouseDown]);

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
      onMouseEnter={() => setIsMouseInside(true)}
      onScroll={onScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{
        width: width,
        height: height,
        cursor: mouseDown ? grabCursor : cursor,
        ...style,
      }}
    >
      {mounted ? children : null}
    </Wrapper>
  );
};
