import React from 'react'
import { TextInput } from 'react-native'

import useStyles from './styles'
import { SearchInputProps } from './types'
import { useTheme } from '@providers/theme'
// import { IconProps } from '@components/icon/types'
// import { useTheme } from '@providers/theme'

const SearchInput = ({ ...props }: SearchInputProps): React.ReactElement => {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <TextInput
      placeholderTextColor={theme.colors.foreground.light}
      selectionColor={theme.colors.foreground.light}
      cursorColor={theme.colors.foreground.default}
      style={styles.root}
      {...props}
    >
      {/* {React.cloneElement<IconProps>(icon, {
        color: theme.colors.foreground.default,
      })} */}
    </TextInput>
  )
}

export default SearchInput
