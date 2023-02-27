import './Overflowbox.css';

import { clsx } from 'clsx';
import React, {
  CSSProperties,
  ElementType,
  MutableRefObject,
  ReactNode,
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
}

export const Overflowbox = (props: OverflowboxProps) => {
  const Wrapper = props.wrapper || 'div';
  const { x = 0, y = 0 } = props;
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

  const containerRef = props.reactRef || innerRef;

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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    if (props.disableScrollWheel && isMouseInside) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      document.removeEventListener('wheel', handleWheel);
    }
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [props.disableScrollWheel, isMouseInside]);

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

  const handleMouseLeave = useCallback(() => {
    setIsMouseInside(false);
    if (props.disable) {
      return;
    }
    if (mouseDown) {
      if (isDrag) {
        props.onDragEnd?.();
      }
      if (isMove) {
        props.onMoveEnd?.();
      }
      setMouseDown(false);
      setIsMove(false);
      setIsDrag(false);
    }
  }, [props, mouseDown, isDrag, isMove]);

  const handleMouseUp = useCallback(() => {
    if (props.disable) {
      return;
    }
    if (mouseDown) {
      if (isDrag) {
        props.onDragEnd?.();
      }
      if (isMove) {
        props.onMoveEnd?.();
      }
      setMouseDown(false);
      setIsMove(false);
      setIsDrag(false);
    }
  }, [mouseDown, props, isDrag, isMove]);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!containerRef.current || props.disable) {
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
    [containerRef, props],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!mouseDown || !containerRef.current || props.disable) {
        return;
      }
      if (!isDrag) {
        props.onDragStart?.();
        setIsDrag(true);
      }
      const x = event.pageX - containerRef.current.offsetLeft;
      const y = event.pageY - containerRef.current.offsetTop;
      const scrollX = x - startX;
      const scrollY = y - startY;
      if (!props.disableX) {
        containerRef.current.scrollLeft = axisX - scrollX;
      }
      if (!props.disableY) {
        containerRef.current.scrollTop = axisY - scrollY;
      }
    },
    [mouseDown, startX, startY, axisX, axisY, containerRef, props, isDrag],
  );

  const handleMoveScroll = useCallback(() => {
    props.onMoveStart?.();
    setIsMove(true);
  }, [props]);

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
      onMouseEnter={() => setIsMouseInside(true)}
      onScroll={() => {
        if (!mouseDown) {
          return;
        }
        if (!isMove) {
          handleMoveScroll();
        }
      }}
      style={{
        width: props.width,
        height: props.height,
        cursor: mouseDown ? props.grabCursor : props.cursor,
        ...props.style,
      }}
    >
      {props.children}
    </Wrapper>
  );
};
