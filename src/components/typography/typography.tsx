import { Text } from 'react-native'

import useStyles from './styles'
import { TypographyProps } from './types'

const Typography = ({
  display,
  header,
  description,
  section,
  primary,
  secondary,
  title,
  light,
  ...props
}: TypographyProps): React.ReactElement => {
  const styles = useStyles()

  return (
    <Text
      style={[
        display && styles.display,
        header && styles.header,
        description && styles.description,
        section && styles.section,
        primary && styles.primary,
        secondary && styles.secondary,
        title && styles.title,
        light && styles.light,
      ]}
      {...props}
    />
  )
}

export default Typography
