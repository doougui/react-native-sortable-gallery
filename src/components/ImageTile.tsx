import { useSortableGallery } from 'contexts/SortableGalleryContext';
import React from 'react';
import {
  ImageBackground,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';
import type { Image } from '../types';

type ImageTileProps = {
  item: Image;
  imageStyle?: StyleProp<ImageStyle>;
};

export function ImageTile({ item, imageStyle }: ImageTileProps) {
  const { size } = useSortableGallery();

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      pointerEvents="none"
    >
      <ImageBackground
        style={styles.backgroundImage}
        source={{ uri: item.file_url }}
        imageStyle={[styles.imageStyle, imageStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  backgroundImage: {
    flex: 1,
  },
  imageStyle: {},
});
