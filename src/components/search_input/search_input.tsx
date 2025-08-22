import React, { useRef } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import useStyles from './styles'
import { SearchInputProps } from './types'
import { IconMagnifyingGlass } from '@components/icon'
import { useStrings } from '@providers/strings'
import { useTheme } from '@providers/theme'

const SearchInput = ({ ...props }: SearchInputProps): React.ReactElement => {
  const inputRef = useRef<TextInput>(null)
  const styles = useStyles()
  const { colors } = useTheme()
  const { search } = useStrings()

  return (
    <View style={styles.root}>
      <TextInput
        ref={inputRef}
        placeholder={search.placeholder}
        placeholderTextColor={colors.foreground.light}
        selectionColor={colors.foreground.light}
        cursorColor={colors.foreground.default}
        style={styles.input}
        {...props}
      />
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.icon}
      >
        <IconMagnifyingGlass color={colors.foreground.default} />
      </Pressable>
    </View>
  )
}

export default SearchInput
