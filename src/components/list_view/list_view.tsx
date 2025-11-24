import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import ListViewItem from './list_view_item'
import useStyles from './styles'
import { ListViewItemProps, ListViewProps } from './types'

const ListView = ({
  data = [],
  header,
  footer,
  empty,
  contentContainerStyle,
  topButton,
  bottomButton,
  style,

  ...props
}: ListViewProps): React.ReactElement => {
  const styles = useStyles()

  const renderListViewItem: ListRenderItem<ListViewItemProps> = ({ item, index }) => {
    return (
      <ListViewItem
        {...item}
        key={index}
        topButton={topButton}
        bottomButton={bottomButton}
      />
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderListViewItem}
      style={[styles.root, style]}
      contentContainerStyle={[styles.list, contentContainerStyle]}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={empty}
      {...props}
    />
  )
}

export default ListView
