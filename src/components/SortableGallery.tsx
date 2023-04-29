import { SortableGalleryProvider } from 'contexts/SortableGalleryContext';
import React from 'react';
import type { Cols, Image, Margin } from '../types';
import { ImageTile } from './ImageTile';
import { SortableList } from './SortableList';
import { ImageStyle, StyleProp } from 'react-native';

type SortableGalleryProps = {
  items: Image[];
  isEditing: boolean;
  cols?: Cols;
  margin?: Margin;
  imageTileStyles?: StyleProp<ImageStyle>;
};

export function SortableGallery({
  items,
  isEditing,
  cols = 3,
  margin = 0,
  imageTileStyles = {},
}: SortableGalleryProps) {
  function handleDragEnd() {}

  return (
    <SortableGalleryProvider cols={cols} margin={margin}>
      <SortableList editing={isEditing} onDragEnd={handleDragEnd}>
        {(items || []).map((image) => (
          <ImageTile key={image.id} item={image} imageStyle={imageTileStyles} />
        ))}
      </SortableList>
    </SortableGalleryProvider>
  );
}
