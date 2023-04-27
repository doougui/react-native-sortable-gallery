import React from 'react';
import { ImageTile } from './ImageTile';
import { SortableList } from './SortableList';
import type { Image } from './types';

type SortableGalleryProps = {
  items: Image[];
  isEditable: boolean;
};

export function SortableGallery({ items, isEditable }: SortableGalleryProps) {
  function handleDragEnd() {}

  return (
    <SortableList editing={isEditable} onDragEnd={handleDragEnd}>
      {(items || []).map((image) => (
        <ImageTile key={image.id} item={image} />
      ))}
    </SortableList>
  );
}
