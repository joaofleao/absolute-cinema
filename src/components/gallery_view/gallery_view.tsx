import React from 'react'
import { Dimensions, FlatList, ListRenderItem, View } from 'react-native'

import GalleryViewItem from './gallery_view_item'
import useStyles from './styles'
import { GalleryViewItemProps, GalleryViewProps } from './types'

const GalleryView = ({
  data = [],
  header,
  footer,
  empty,
  contentContainerStyle,
  style,
  ...props
}: GalleryViewProps): React.ReactElement => {
  const styles = useStyles()

  const renderGalleryViewItem: ListRenderItem<GalleryViewItemProps> = ({ item, index }) => (
    <React.Fragment key={index}>
      <GalleryViewItem {...item} />
      {data.length % 3 !== 0 && index === data.length - 1 && (
        <>
          <View style={{ width: (Dimensions.get('screen').width - 32 - 32) / 3 }} />
          {data.length % 3 === 1 && (
            <View style={{ width: (Dimensions.get('screen').width - 32 - 32) / 3 }} />
          )}
        </>
      )}
    </React.Fragment>
  )

  return (
    <FlatList
      data={data}
      renderItem={renderGalleryViewItem}
      numColumns={3}
      columnWrapperStyle={styles.gallery}
      contentContainerStyle={[styles.list, contentContainerStyle]}
      style={[styles.root, style]}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={empty}
      {...props}
    />
  )
}

export default GalleryView
