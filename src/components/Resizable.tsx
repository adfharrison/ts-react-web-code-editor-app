import { ResizableBox, ResizableBoxProps } from 'react-resizable';

import React, { useEffect, useState } from 'react';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;

  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    // DEBOUNCING methodology to ensure size updates dont happen too often when browser is resized
    // this greatly improves responsiveness
    let timer: any;

    // change state to new window dims
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 50);
    };

    //listen to resize events
    window.addEventListener('resize', listener);

    // unsubscribe from resize events
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [width]);

  // set the props of resizable box dependent on the orientation that is required. this makes this component very reusable
  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      height: Infinity,
      width,
      resizeHandles: ['e'],
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
      minConstraints: [Infinity, 30],
      maxConstraints: [Infinity, innerHeight * 0.9],
    };
  }
  return (
    //resizeHandles dictates position of resize grab handle. also, it doesnt support dimensions in percentages.....so Infinity!
    // max constraints limits vertical resize to 90%, and min to 30px
    <ResizableBox {...resizableProps}>{children}</ResizableBox>
  );
};

export default Resizable;
