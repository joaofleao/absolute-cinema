import React, { useRef } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import useStyles from './styles'
import { SearchInputProps } from './types'
import { IconMagnifyingGlass, IconX } from '@components/icon'
import { useStrings } from '@providers/strings'
import { useTheme } from '@providers/theme'
const SearchInput = ({
  debounce = 0,
  value,
  onChangeText,
  onDebouncedText,
  onClear,
  style,
  ...props
}: SearchInputProps): React.ReactElement => {
  const inputRef = useRef<TextInput>(null)
  const styles = useStyles()
  const { semantics } = useTheme()
  const { search } = useStrings()

  let timeoutId: NodeJS.Timeout

  const debouncer = (text: string): void => {
    timeoutId = setTimeout(() => {
      onDebouncedText?.(text)
    }, debounce)
  }

  const handleChangeText = (text: string): void => {
    onChangeText?.(text)
    clearTimeout(timeoutId)
    debouncer(text)
  }

  const handleClear = (): void => {
    inputRef.current?.clear()
    onClear?.()
  }

  return (
    <View style={[styles.root, style]}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.leading}
      >
        <IconMagnifyingGlass
          color={semantics.container.foreground.default}
          size={16}
        />
      </Pressable>

      <TextInput
        ref={inputRef}
        placeholder={search.placeholder}
        placeholderTextColor={semantics.container.foreground.light}
        selectionColor={semantics.container.foreground.light}
        cursorColor={semantics.container.foreground.default}
        style={styles.input}
        onChangeText={handleChangeText}
        value={value}
        {...props}
      />

      {inputRef?.current?.isFocused() && (
        <>
          <View style={styles.divider} />
          <Pressable
            onPress={handleClear}
            style={styles.trailing}
          >
            <IconX
              color={semantics.container.foreground.default}
              size={16}
            />
          </Pressable>
        </>
      )}
    </View>
  )
}

export default SearchInput
