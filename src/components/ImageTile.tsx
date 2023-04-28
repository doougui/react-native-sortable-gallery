import { useSortableGallery } from 'contexts/SortableGalleryContext';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import type { Image } from '../types';

export function ImageTile({ item }: { item: Image }) {
  const { size } = useSortableGallery();

  return (
    <View
      style={[styles.Container, { width: size, height: size }]}
      pointerEvents="none"
    >
      <ImageBackground
        style={styles.BackgroundImage}
        source={{ uri: item.file_url }}
        imageStyle={styles.ImageStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {},
  BackgroundImage: {
    flex: 1,
  },
  ImageStyle: {
    borderRadius: 4,
  },
});
