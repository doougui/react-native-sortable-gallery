import React from 'react';
import Animated, { Easing } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { Cols, Margin } from 'types';

type SortableGalleryContextData = {
  animationConfig: {
    easing: Animated.EasingFunction;
    duration: number;
  };
  getPosition: (order: number) => { x: number; y: number };
  getOrder: (tx: number, ty: number, max: number) => number;
  cols: Cols;
  margin: Margin;
  size: number;
};

type SortableGalleryProviderProps = {
  cols: Cols;
  margin: Margin;
  children: React.ReactNode;
};

export const SortableGalleryContextDefaultValues = {
  animationConfig: {
    easing: Easing.inOut(Easing.ease),
    duration: 200,
  },
  getPosition: () => null,
  getOrder: () => null,
  cols: 3,
  margin: 10,
  size: Dimensions.get('window').width,
};

export const SortableGalleryContext =
  React.createContext<SortableGalleryContextData>(
    {} as SortableGalleryContextData,
  );

export function SortableGalleryProvider({
  cols,
  margin,
  ...props
}: SortableGalleryProviderProps) {
  const { width } = Dimensions.get('window');

  /**
   * Calculates de size of each item
   * Width of the entire screen divided by
   * the number of columns minus the margin
   */
  const size = width / cols - margin;

  const animationConfig = {
    easing: Easing.inOut(Easing.ease),
    duration: 350,
  };

  function getPosition(order: number) {
    'worklet';

    return {
      /**
       * x is the horizontal value
       * it can be (0 - left, 1 - middle, 2 - right)
       * Examples:
       * Order 0: 0 % 3 = 0 * (100 / 3) = 0
       * Order 1: 1 % 3 = 1 * (100 / 3) = 33.33
       * Order 2: 2 % 3 = 2 * (100 / 3) = 66.66
       */
      x: (order % cols) * size,

      /**
       * y is the vertical value
       * it will be the sum of the height of the rows above
       * Examples:
       *
       * First row:
       * Order 0: 0 / 3 = 0 = Math.floor(0) = 0 * 100 = 0
       * Order 1: 1 / 3 = 0.3333 = Math.floor(0.3333) = 0 * 100 = 0
       * Order 2: 2 / 3 = 0.6666 = Math.floor(0.6666) = 0 * 100 = 0
       *
       * Second row:
       * Order 3: 3 / 3 = 1 = Math.floor(1) = 1 * 100 = 100
       * Order 4: 4 / 3 = 1.3333 = Math.floor(1.3333) = 1 * 100 = 100
       * Order 5: 5 / 3 = 1.6666 = Math.floor(1.6666) = 1 * 100 = 100
       */
      y: Math.floor(order / cols) * size,
    };
  }

  function getOrder(tx: number, ty: number, max: number) {
    'worklet';

    /**
     * Calculates the new position of the item
     *
     * Example:
     * tx = 260
     * ty = 130
     *
     * x = 260 / 130 = 2 * 130 = 260
     * y = 130 / 130 = 1 * 130 = 130
     *
     * Because the resulting values are integers, the numbers
     * do not need to be rounded. In case it does, depending on the
     * resulting value, the item will take the place of another item.
     */
    const x = Math.round(tx / size) * size;
    const y = Math.round(ty / size) * size;

    const row = Math.max(y, 0) / size; // Example: 130/130 = 1
    const col = Math.max(x, 0) / size; // Example: 260/130 = 2

    /**
     * Calculates the new order of the item
     * or returns the last position of the grid
     * if the resulting number is greater than
     * the total number of items
     */
    return Math.min(row * cols + col, max);
  }

  return (
    <SortableGalleryContext.Provider
      value={{
        animationConfig,
        getPosition,
        getOrder,
        cols,
        margin,
        size,
      }}
      {...props}
    />
  );
}

export function useSortableGallery() {
  const context = React.useContext(SortableGalleryContext);

  if (!context) {
    throw new Error(
      'useSortableGallery must be used within an SortableGalleryContext',
    );
  }

  return context;
}
