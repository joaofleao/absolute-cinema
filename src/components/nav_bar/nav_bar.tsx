import React from 'react'
import { View } from 'react-native'

import NavBarItem from './nav_bar_item'
import useStyles from './styles'
import { NavBarProps, TabType } from './types'
import { IconMagnifyingGlass } from '@components/icon'
import { routes } from '@router/index'

const NavBar = ({ tabs, navigation, state }: NavBarProps): React.ReactElement => {
  const styles = useStyles()

  const renderTabs = (tab: TabType, index: number): React.ReactElement => {
    const handleTabPress = (): void => {
      navigation.navigate(tab.label)
    }

    return (
      <NavBarItem
        key={index}
        first={index === 0}
        last={index === tabs.length - 1}
        onPress={handleTabPress}
        selected={state.index === index}
        icon={tab.icon}
        label={tab.label}
      />
    )
  }

  const leadingArea = (
    <View style={[styles.container, styles.leading]}>
      <View style={styles.background}>{tabs.map(renderTabs)}</View>
    </View>
  )

  const trailingArea = (
    <View style={[styles.container, styles.trailing]}>
      <View style={styles.background}>
        <NavBarItem
          onPress={() => navigation.navigate(routes.search)}
          icon={<IconMagnifyingGlass />}
        />
      </View>
    </View>
  )

  return (
    <>
      {leadingArea}
      {trailingArea}
    </>
  )
}

export default NavBar
