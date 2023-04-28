import { SortableGalleryProvider } from 'contexts/SortableGalleryContext';
import React from 'react';
import type { Cols, Image, Margin } from '../types';
import { ImageTile } from './ImageTile';
import { SortableList } from './SortableList';

type SortableGalleryProps = {
  items: Image[];
  isEditing: boolean;
  cols?: Cols;
  margin?: Margin;
};

export function SortableGallery({
  items,
  isEditing,
  cols = 3,
  margin = 0,
}: SortableGalleryProps) {
  function handleDragEnd() {}

  return (
    <SortableGalleryProvider cols={cols} margin={margin}>
      <SortableList editing={isEditing} onDragEnd={handleDragEnd}>
        {(items || []).map((image) => (
          <ImageTile key={image.id} item={image} />
        ))}
      </SortableList>
    </SortableGalleryProvider>
  );
}
