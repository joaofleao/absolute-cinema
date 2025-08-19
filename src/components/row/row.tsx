import { View } from 'react-native'

import useStyles from './styles'
import { RowProps } from './types'

const Row = ({ ...props }: RowProps): React.ReactElement => {
  const style = useStyles()

  return (
    <View
      style={style.row}
      {...props}
    />
  )
}

export default Row
