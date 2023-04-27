import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';

/**
 * id: key of item
 * value: order of item
 */
export type Positions = {
  [id: string]: number;
};

const { width } = Dimensions.get('window');

export const MARGIN = 0;

export const COL = 3;

/**
 * Calculates de size of each item
 * Width of the entire screen divided by
 * the number of columns minus the margin
 */
export const SIZE = width / COL - MARGIN;

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
};

export function getPosition(order: number) {
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
    x: (order % COL) * SIZE,

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
    y: Math.floor(order / COL) * SIZE,
  };
}

export function getOrder(tx: number, ty: number, max: number) {
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
  const x = Math.round(tx / SIZE) * SIZE;
  const y = Math.round(ty / SIZE) * SIZE;

  const row = Math.max(y, 0) / SIZE; // Example: 130/130 = 1
  const col = Math.max(x, 0) / SIZE; // Example: 260/130 = 2

  /**
   * Calculates the new order of the item
   * or returns the last position of the grid
   * if the resulting number is greater than
   * the total number of items
   */
  return Math.min(row * COL + col, max);
}
