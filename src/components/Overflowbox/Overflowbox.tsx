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
    disable,
    onDragEnd,
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
  const [isMouseInside, setIsMouseInside] = useState(false);
  const containerRef = reactRef || innerRef;

  const [scrolling, setScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

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
      setMouseDown(false);
      setIsDrag(false);
    }
  }, [mouseDown, isDrag, disable, onDragEnd]);

  const handleMouseUp = useCallback(() => {
    if (disable) {
      return;
    }
    if (mouseDown) {
      if (isDrag) {
        onDragEnd?.();
      }
      setMouseDown(false);
      setIsDrag(false);
    }
  }, [mouseDown, disable, isDrag, onDragEnd]);

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
  }, [mouseDown, containerRef, onDragStart, isDrag, disable]);


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
      if (!disableX) {
        containerRef.current.scrollLeft = axisX - scrollX;
      }
      if (!disableY) {
        containerRef.current.scrollTop = axisY - scrollY;
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
      disable,
    ],
  );


  const onScroll = () => {
    setScrolling(true);
    if (scrollTimeout !== null) {
      clearTimeout(scrollTimeout);
    }
    const newTimeout = setTimeout(() => {
      setScrolling(false);
    }, 100);
    setScrollTimeout(newTimeout);
  };

  useEffect(() => {
    if (!scrolling && mounted && containerRef.current) {
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
  }, [scrolling, mounted, containerRef, disableX, disableY, setX, setY]);

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
      onTouchMove={handleTouchMove}
      onScroll={onScroll}
      style={{
        width: width,
        height: height,
        cursor: mouseDown ? grabCursor : cursor,
        overflowX: disableX ? 'hidden' : 'auto',
        overflowY: disableY ? 'hidden' : 'auto',
        overflow: disable ? 'hidden' : 'auto',
        ...style,
      }}
    >
      {mounted ? children : null}
    </Wrapper>
  );
};
