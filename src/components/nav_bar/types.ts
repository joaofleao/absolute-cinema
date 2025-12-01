import { IconProps } from '@components/icon'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

export type TabType = {
  label: string
  icon: React.ReactElement<IconProps>
}
export interface NavBarProps extends BottomTabBarProps {
  tabs: TabType[]
}
