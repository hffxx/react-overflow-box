# react-overflow-box

React Overflowbox to implement mouse-like dragging.

## Demo

[Codesandbox demo](https://codesandbox.io/s/react-overflowbox-o3put1?file=/src/App.tsx/)

## Install

```bash
npm i @hffxx/react-overflow-box
```

```bash
yarn add @hffxx/react-overflow-box
```

## Usage

```jsx
import { Overflowbox } from '@hffxx/react-overflow-box';

const Component = () => {
  return (
    <Overflowbox width={500} height={500}>
      <img src={your_src} alt="" />
    </Overflowbox>
  );
};
```

## Component properties

| Prop               | Type                   | Description                             | Default    |
| ------------------ | ---------------------- | --------------------------------------- | ---------- |
| width              | number                 | View width                              |            |
| height             | number                 | View height                             |            |
| x                  | number                 | Initial X-axis view position            |            |
| y                  | number                 | Initial Y-axis view position            |            |
| setX               | SetStateAction<number> | React setState for X-axis value         |            |
| setY               | SetStateAction<number> | React setState for Y-axis value         |            |
| wrapper            | ElementType            | Wrapper element                         | "div"      |
| reactRef           | MutableRefObject       | Ref                                     |            |
| children           | ReactNode              | Children                                |            |
| showScrollbar      | Boolean                | Show the scrollbars                     | false      |
| smoothScrolling    | Boolean                | Enables smooth animation for scrolling  | false      |
| className          | String                 | Custom classname for the wrapper        |            |
| disableX           | Boolean                | Disable X-axis view drag                | false      |
| disableY           | Boolean                | Disable Y-axis view drag                | false      |
| disable            | Boolean                | Disable X-axis and Y-axis view drag     | false      |
| onDragStart        | Function               | Invoked when the user starts dragging   |            |
| onDragEnd          | Function               | Invoked when the user ends dragging     |            |
| cursor             | Cursor                 | Overrides default cursor                | "grab"     |
| grabCursor         | Cursor                 | Overrides default cursor while dragging | "grabbing" |
| disableScrollWheel | Boolean                | Disables scrolling inside wrapper       | false      |

## FAQ

- **How do I position the view in pixels?**

  In the Overflowbox component, you pass the x and y as number. If you have an image that is 1000px width, you can set x value as 500 to center the image.

## License

The source code is licensed under MIT
