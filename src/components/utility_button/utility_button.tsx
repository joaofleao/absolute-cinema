import React, { useRef } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import useStyles from './styles'
import { SearchInputProps } from './types'
import { IconMagnifyingGlass, IconX } from '@components/icon'
import { useStrings } from '@providers/strings'
import { useTheme } from '@providers/theme'

const SearchInput = ({
  debounce = 0,
  onChangeText,
  ...props
}: SearchInputProps): React.ReactElement => {
  const inputRef = useRef<TextInput>(null)
  const styles = useStyles()
  const { colors } = useTheme()
  const { search } = useStrings()

  let timeoutId: NodeJS.Timeout

  const debouncer = (text: string): void => {
    timeoutId = setTimeout(() => {
      onChangeText?.(text)
    }, debounce)
  }

  const handleChangeText = (text: string): void => {
    clearTimeout(timeoutId)
    debouncer(text)
  }

  return (
    <View style={styles.root}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.icon}
      >
        <IconMagnifyingGlass color={colors.foreground.default} />
      </Pressable>
      <TextInput
        ref={inputRef}
        placeholder={search.placeholder}
        placeholderTextColor={colors.foreground.light}
        selectionColor={colors.foreground.light}
        cursorColor={colors.foreground.default}
        style={styles.input}
        onChangeText={handleChangeText}
        {...props}
      />
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.icon}
      >
        <IconX color={colors.foreground.default} />
      </Pressable>
    </View>
  )
}

export default SearchInput
