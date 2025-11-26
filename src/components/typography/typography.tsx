import { Text } from 'react-native'

import useStyles from './styles'
import { TypographyProps } from './types'

const Typography = ({
  style,
  display = false,
  onboardingAccent = false,
  onboarding = false,
  header = false,
  title = true,
  body = false,
  description = false,
  legend = false,
  color,
  ...props
}: TypographyProps): React.ReactElement => {
  const styles = useStyles({ color })

  return (
    <Text
      style={[
        title && styles.title,
        display && styles.display,
        onboardingAccent && styles.onboardingAccent,
        onboarding && styles.onboarding,
        header && styles.header,
        body && styles.body,
        description && styles.description,
        legend && styles.legend,
        style,
      ]}
      {...props}
    />
  )
}

export default Typography
