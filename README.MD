# react-overflowbox

React Overflowbox to implement mouse-like dragging.

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

| Prop               | Type          | Description                            | Default |
| ------------------ | ------------- | -------------------------------------- | ------- |
| width              | number        | Overflowbox width                      |         |
| height             | number        | Overflowbox height                     |         |
| x                  | number        | Initial X axis scroll position         | 0       |
| y                  | number        | Initial Y axis scroll position         | 0       |
| wrapper            | ElementType   | Overflowbox wrapper                    | "div"   |
| children           | ReactNode     | Children                               |         |
| showScrollbar      | Boolean       | Show the scrollbars                    | false   |
| className          | String        | The custom classname for the container |         |
| disableX           | Boolean       | Disable X axis scroll                  | false   |
| disableY           | Boolean       | Disable Y axis scroll                  | false   |
| disable            | Boolean       | Disable X and Y axis scroll            | false   |
| disableScrollWheel | Boolean       | Disable scrolling wheel                | false   |
| onStart            | Function      | Invoked when user start scrolling      |         |
| onEnd              | Function      | Invoked when user ends scrolling       |         |
| style              | CSSProperties | Inline styles for the Overflowbox      |         |

## License

The source code is licensed under MIT
