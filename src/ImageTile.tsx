import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { SIZE } from './module';
import { ImageBackground } from 'react-native';
import type { Image } from './types';

export function ImageTile({ item }: { item: Image }) {
  return (
    <View style={styles.Container} pointerEvents="none">
      <ImageBackground
        style={styles.BackgroundImage}
        source={{ uri: item.file_url }}
        imageStyle={styles.ImageStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: SIZE,
    height: SIZE,
  },
  BackgroundImage: {
    flex: 1,
  },
  ImageStyle: {
    borderRadius: 4,
  },
});
