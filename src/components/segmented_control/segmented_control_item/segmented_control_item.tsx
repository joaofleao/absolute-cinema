import React from 'react'
import { TouchableOpacity } from 'react-native'

import useStyles from './styles'
import { SegmentedControlItemProps } from './types'
import Typography from '@components/typography'

const SegmentedControlItem = ({
  selected,
  children,
  ...props
}: SegmentedControlItemProps): React.ReactElement => {
  const style = useStyles()

  return (
    <TouchableOpacity
      style={[style.root, selected && style.selected]}
      {...props}
    >
      <Typography
        inverse={selected}
        custom
      >
        {children}
      </Typography>
    </TouchableOpacity>
  )
}

export default SegmentedControlItem
