import { View } from 'react-native'

import useStyles from './styles'
import { RowProps } from './types'

const Row = ({ wrap = false, ...props }: RowProps): React.ReactElement => {
  const style = useStyles()

  return (
    <View
      style={[style.row, wrap && style.wrap]}
      {...props}
    />
  )
}

export default Row
