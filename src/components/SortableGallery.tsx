import React from 'react';
import { ImageTile } from './ImageTile';
import { SortableList } from './SortableList';
import type { Image } from '../types';

type SortableGalleryProps = {
  items: Image[];
  isEditing: boolean;
  cols: number;
};

export function SortableGallery({ items, isEditing }: SortableGalleryProps) {
  function handleDragEnd() {}

  return (
    <SortableList editing={isEditing} onDragEnd={handleDragEnd}>
      {(items || []).map((image) => (
        <ImageTile key={image.id} item={image} />
      ))}
    </SortableList>
  );
}
