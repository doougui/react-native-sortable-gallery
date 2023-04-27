import React from 'react';
import { StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  SIZE,
  getPosition,
  type Positions,
  COL,
  animationConfig,
  getOrder,
} from './module';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

type ImageItemProps = {
  children: React.ReactNode;
  id: string;
  positions: Animated.SharedValue<Positions>;
  scrollView: React.RefObject<Animated.ScrollView>;
  onDragEnd: (
    diffs: Positions,
    itemBeingEdited: string,
    newOrder: number
  ) => void;
  editing: boolean;
  scrollY: Animated.SharedValue<number>;
};

export function ImageItem({
  children,
  editing,
  positions,
  id,
  scrollY,
  scrollView,
  onDragEnd,
}: ImageItemProps) {
  const insets = useSafeAreaInsets();

  const containerHeight =
    Dimensions.get('window').height - insets.top - insets.bottom;
  const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;

  const isGestureActive = useSharedValue(false);

  const position = getPosition(positions.value[id] as number);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  /**
   * Update the position of the item
   * every time the position.value of the current id
   * changes. It works kind of like a useEffect
   *
   * For instance, if we drop the second tile above
   * the first tile, positions.value will change
   * with the new orders and the old first tile will
   * now take the old place of the second tile
   * (because the second tile will now be the first item,
   * since the order changed)
   */
  useAnimatedReaction(
    () => positions.value[id],
    (newOrder) => {
      if (!isGestureActive.value) {
        const pos = getPosition(newOrder as number);
        translateX.value = withTiming(pos.x, animationConfig);
        translateY.value = withTiming(pos.y, animationConfig);
      }
    }
  );

  const handleGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_, ctx) => {
      /**
       * Don't allow drag start if we're done editing
       */
      if (editing) {
        /**
         * Set the default value for the context
         * share between all the events (onStart, onActive, etc)
         * with the initial translation values
         */
        ctx.x = translateX.value;
        ctx.y = translateY.value;
        isGestureActive.value = true;
      }
    },
    onActive: ({ translationX, translationY }, ctx) => {
      /**
       * Don't allow drag if we're done editing
       */
      if (editing) {
        /**
         * Update the value of the shared value
         * with the current value of the dragged item
         */
        translateX.value = ctx.x + translationX;
        translateY.value = ctx.y + translationY;

        /**
         * 1. We calculate where the tile should be
         *
         * Gets the new order based on the shared translation values (x, y)
         * Max value from getOrder needs to be the total amount of items in the list
         */
        const oldOrder = positions.value[id] as number;
        const newOrder = getOrder(
          translateX.value,
          translateY.value,
          Object.keys(positions.value).length - 1
        );

        /**
         * We swap the positions of the tiles
         * only if the old order is different from the new one
         * If not, just skip this
         */
        if (oldOrder !== newOrder) {
          /**
           * Clone the positions object
           */
          const newPositions = { ...positions.value };

          /**
           * Get the items in between the old order and the new order and
           * increase the order of the items in between by 1
           */
          if (oldOrder > newOrder) {
            Object.keys(newPositions).map((key) => {
              if (
                (newPositions[key] as number) < newOrder ||
                (newPositions[key] as number) >= oldOrder
              )
                return newPositions;

              newPositions[key] += 1;
              return newPositions;
            });
          }

          /**
           * Get the items in between the new order and the old order and
           * decrease the order of the items in between by 1
           */
          if (newOrder > oldOrder) {
            Object.keys(newPositions).map((key) => {
              if (
                (newPositions[key] as number) > newOrder ||
                (newPositions[key] as number) <= oldOrder
              )
                return newPositions;

              newPositions[key] -= 1;
              return newPositions;
            });
          }

          /**
           * We update the positions of the tiles
           */
          newPositions[id] = newOrder;
          positions.value = newPositions;
        }

        /**
         * Boundaries to trigger the scroll
         * scrollY.value = what we scrolled already
         */
        const lowerBound = scrollY.value;
        const upperBound = lowerBound + containerHeight - SIZE;

        /**
         * Do not allow to scroll more than what is available
         */
        const maxScroll = contentHeight - containerHeight;
        const leftToScrollDown = maxScroll - scrollY.value;

        /**
         * Scrolls up when the tile being moved is at the top
         */
        if (translateY.value < lowerBound) {
          const diff = Math.min(lowerBound - translateY.value, lowerBound);
          scrollY.value -= diff;
          scrollTo(scrollView, 0, scrollY.value, false);

          /**
           * The tile being dragged needs to be in sync with the scroll
           */
          ctx.y -= diff;
          translateY.value = ctx.y + translationY;
        }

        /**
         * Scrolls down when the tile being moved is at the bottom
         */
        if (translateY.value > upperBound) {
          const diff = Math.min(
            translateY.value - upperBound,
            leftToScrollDown
          );
          scrollY.value += diff;
          scrollTo(scrollView, 0, scrollY.value, false);

          /**
           * The tile being dragged needs to be in sync with the scroll
           */
          ctx.y += diff;
          translateY.value = ctx.y + translationY;
        }
      }
    },
    onEnd: () => {
      const destination = getPosition(positions.value[id] as number);

      /**
       * Goes back to the initial position if the position didn't change
       *
       * If the order changed, this will change the position of the item
       * to the place relative to that order
       * If not, the item will just go back to its initial position
       */
      translateX.value = withTiming(destination.x, animationConfig, () => {
        isGestureActive.value = false;
        runOnJS(onDragEnd)(positions.value, id, positions.value[id] as number);
      });

      translateY.value = withTiming(destination.y, animationConfig);
    },
  });

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = withSpring(isGestureActive.value ? 1.05 : 1);

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      zIndex,
      transform: [
        { translateX: translateX.value || 0 },
        { translateY: translateY.value || 0 },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={style}>
      <PanGestureHandler enabled={editing} onGestureEvent={handleGestureEvent}>
        <Animated.View style={StyleSheet.absoluteFill}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}
