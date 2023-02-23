# react-overflowbox

React Overflowbox to implement mouse-like dragging.

## Demo

[Codesandbox demo](https://codesandbox.io/s/react-overflowbox-o3put1?file=/src/App.js/)

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

| Prop          | Type             | Description                                    | Default |
| ------------- | ---------------- | ---------------------------------------------- | ------- |
| width         | number           | View width                                     |         |
| height        | number           | View height                                    |         |
| x             | number           | Initial X-axis view position                   | 0       |
| y             | number           | Initial Y-axis view position                   | 0       |
| wrapper       | ElementType      | Wrapper element                                | "div"   |
| reactRef      | MutableRefObject | Ref                                            |         |
| children      | ReactNode        | Children                                       |         |
| showScrollbar | Boolean          | Show the scrollbars                            | false   |
| className     | String           | Custom classname for the wrapper               |         |
| disableX      | Boolean          | Disable X-axis view drag                       | false   |
| disableY      | Boolean          | Disable Y-axis view drag                       | false   |
| disable       | Boolean          | Disable X-axis and Y-axis view drag            | false   |
| onDragStart   | Function         | Invoked when the user starts dragging          |         |
| onDragEnd     | Function         | Invoked when the user ends dragging            |         |
| onMoveStart   | Function         | Invoked when the view position starts changing |         |
| onMoveEnd     | Function         | Invoked when the view position stops changing  |         |
| style         | CSSProperties    | Inline styles for the wrapper                  |         |

## License

The source code is licensed under MIT
