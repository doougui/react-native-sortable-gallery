import React from 'react';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import type { Image } from './types';
import { COL, SIZE, type Positions } from './module';
import { ImageItem } from './ImageItem';

type SortableListProps = {
  children: React.ReactElement<{ item: Image }>[];
  editing: boolean;
  onDragEnd: (
    diff: Positions,
    itemBeingEdited: string,
    newOrder: number
  ) => void;
};

export function SortableList({
  children,
  editing,
  onDragEnd,
}: SortableListProps) {
  const scrollView = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);

  const positions = useSharedValue<Positions>(
    Object.assign(
      {},
      ...(children
        ? children.map((child, index) => ({ [child.props.item.id]: index }))
        : [])
    )
  );

  /**
   * Bind the scrollY to the ScrollView
   */
  const handleScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
    },
  });

  return (
    <View style={styles.Container}>
      <Animated.ScrollView
        ref={scrollView}
        contentContainerStyle={{
          /**
           * The component is going to be layouted by us, so we need to force the height
           * of the contentContainerStyle
           *
           * Example: 6 items, each with a height of 100px,
           * We divide 6 by the number of columns (3) to get the number of rows
           * And multiply by the size of the item (100) to get the total height
           *
           * 6 / 3 = 2
           * 2 * 100 = 200
           */
          height: Math.ceil((children?.length ?? 0) / COL) * SIZE,
        }}
        showsVerticalScrollIndicator
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {children?.map((child) => (
          <ImageItem
            scrollView={scrollView}
            editing={editing}
            key={child.props.item.id}
            id={child.props.item.id}
            onDragEnd={onDragEnd}
            positions={positions}
            scrollY={scrollY}
          >
            {child}
          </ImageItem>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
