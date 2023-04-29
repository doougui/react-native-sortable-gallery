import { SortableGallery } from './src';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'types';
import { items } from './items';

export default function App() {
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
