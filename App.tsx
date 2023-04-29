import { SortableGallery } from './src';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'types';

export default function App() {
  const items = [
    {
      id: '1',
      file_url: 'https://picsum.photos/200',
      order: 1,
    },
    {
      id: '2',
      file_url: 'https://picsum.photos/200',
      order: 2,
    },
    {
      id: '3',
      file_url: 'https://picsum.photos/200',
      order: 3,
    },
    {
      id: '4',
      file_url: 'https://picsum.photos/200',
      order: 4,
    },
    {
      id: '5',
      file_url: 'https://picsum.photos/200',
      order: 5,
    },
    {
      id: '6',
      file_url: 'https://picsum.photos/200',
      order: 6,
    },
    {
      id: '7',
      file_url: 'https://picsum.photos/200',
      order: 7,
    },
    {
      id: '8',
      file_url: 'https://picsum.photos/200',
      order: 8,
    },
    {
      id: '9',
      file_url: 'https://picsum.photos/200',
      order: 9,
    },
    {
      id: '10',
      file_url: 'https://picsum.photos/200',
      order: 10,
    },
    {
      id: '11',
      file_url: 'https://picsum.photos/200',
      order: 11,
    },
  ];

  function handleDragEnd(item: Image) {
    console.log('handleDragEnd', item);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <SortableGallery
          items={items}
          cols={3}
          imageTileStyles={styles.imageTileStyles}
          onDragEnd={handleDragEnd}
          isEditing
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageTileStyles: {
    borderRadius: 2,
  },
});
