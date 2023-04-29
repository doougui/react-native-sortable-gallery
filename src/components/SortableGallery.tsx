import { SortableGalleryProvider } from 'contexts/SortableGalleryContext';
import React from 'react';
import type { Cols, Image, Margin, Positions } from '../types';
import { ImageTile } from './ImageTile';
import { SortableList } from './SortableList';
import { ImageStyle, StyleProp } from 'react-native';

type SortableGalleryProps = {
  items: Image[];
  isEditing: boolean;
  onDragEnd?: (item: Image) => void;
  cols?: Cols;
  margin?: Margin;
  imageTileStyles?: StyleProp<ImageStyle>;
};

export function SortableGallery({
  items,
  isEditing,
  onDragEnd,
  cols = 3,
  margin = 0,
  imageTileStyles = {},
}: SortableGalleryProps) {
  function handleDragEnd(
    _: Positions,
    itemBeingEdited: string,
    newOrder: number,
  ) {
    const imageBeingEdited = (items || []).find(
      (image) => image.id === itemBeingEdited,
    );
    if (!imageBeingEdited) return;

    if (onDragEnd) {
      onDragEnd({ ...imageBeingEdited, order: newOrder + 1 });
    }
  }

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
