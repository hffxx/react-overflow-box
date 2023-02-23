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

| Prop          | Type             | Description                               | Default |
| ------------- | ---------------- | ----------------------------------------- | ------- |
| width         | number           | view width                                |         |
| height        | number           | view height                               |         |
| x             | number           | Initial X axis position                   | 0       |
| y             | number           | Initial Y axis position                   | 0       |
| wrapper       | ElementType      | wrapper                                   | "div"   |
| reactRef      | MutableRefObject | ref                                       |         |
| children      | ReactNode        | Children                                  |         |
| showScrollbar | Boolean          | Show the scrollbars                       | false   |
| className     | String           | The custom classname for wrapper          |         |
| disableX      | Boolean          | Disable X axis drag                       | false   |
| disableY      | Boolean          | Disable Y axis drag                       | false   |
| disable       | Boolean          | Disable X and Y axis drag                 | false   |
| onDragStart   | Function         | Invoked when user start dragging          |         |
| onDragEnd     | Function         | Invoked when user ends dragging           |         |
| onMoveStart   | Function         | Invoked when view position is changed     |         |
| onMoveEnd     | Function         | Invoked when view stops changing position |         |
| style         | CSSProperties    | Inline styles for the Overflowbox         |         |

## License

The source code is licensed under MIT
