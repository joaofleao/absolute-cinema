import { Text } from 'react-native'

import useStyles from './styles'
import { TypographyProps } from './types'

const Typography = ({
  style,
  display,
  header,
  description,
  section,
  primary,
  secondary,
  title,
  custom = true,
  light,
  inverse,
  positive,
  legend,
  ...props
}: TypographyProps): React.ReactElement => {
  const styles = useStyles()

  return (
    <Text
      style={[
        custom && styles.custom,
        display && styles.display,
        header && styles.header,
        description && styles.description,
        section && styles.section,
        primary && styles.primary,
        secondary && styles.secondary,
        title && styles.title,
        legend && styles.legend,
        light && styles.light,
        inverse && styles.inverse,
        positive && styles.positive,
        style,
      ]}
      {...props}
    />
  )
}

export default Typography
