import { StyleSheet } from 'react-native';
import { SortableGallery } from './src';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <SortableGallery
          items={[
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
          ]}
          isEditable
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
