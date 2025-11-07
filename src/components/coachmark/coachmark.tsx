import React from 'react'
import { Text, View } from 'react-native'

import useStyles from './styles'
import { CoachmarkProps } from './types'
import { getCoachmarkPosition } from './utils'
import { IconArrow, IconCheckCircle } from '@components/icon'
import IconButton from '@components/icon_button'
import { useTheme } from '@providers/theme'

const Coachmark = ({
  anchor,
  title,
  description,
  visible,
  onNext,
  onPrevious,
  onComplete,
  children,
}: CoachmarkProps): React.ReactElement => {
  const styles = useStyles({ visible })

  const [coachmarkPosition, setCoachmarkPosition] = React.useState<{
    top?: number
    left?: number
    right?: number
    bottom?: number
  }>()
  const theme = useTheme()

  React.useLayoutEffect(() => {
    if (!anchor.current) return
    anchor.current.measureInWindow((x, y, width, height) => {
      setCoachmarkPosition(getCoachmarkPosition(x, y, width, height))
    })
    anchor.current.setNativeProps({
      style: { zIndex: visible ? theme.layer.floating : undefined },
    })
  }, [anchor, theme, visible])

  return (
    <>
      <View style={styles.backdrop} />
      <View
        style={[
          styles.root,
          {
            top: coachmarkPosition?.top,
            left: coachmarkPosition?.left,
            bottom: coachmarkPosition?.bottom,
            right: coachmarkPosition?.right,
          },
        ]}
      >
        {title && <Text style={styles.title}>{title}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}

        <View style={styles.footer}>
          {/* {children} */}

          {onPrevious && (
            <IconButton
              icon={<IconArrow />}
              // variant="secondary"
              onPress={onPrevious}
            />
          )}
          {onNext && (
            <IconButton
              icon={<IconArrow style={{ transform: [{ rotate: '180deg' }] }} />}
              // variant="primary"
              onPress={onNext}
            />
          )}
          {onComplete && (
            <IconButton
              icon={<IconCheckCircle />}
              // size="medium"
              onPress={onComplete}
            />
          )}
        </View>
      </View>
    </>
  )
}

export default Coachmark
