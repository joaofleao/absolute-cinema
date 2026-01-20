import React, { useEffect } from 'react'
import { Alert, Linking, View } from 'react-native'
import { useQuery } from 'convex/react'
import { api } from 'convex_api'
import { deleteItemAsync, getItem, setItem } from 'expo-secure-store'
import { useTranslation } from 'react-i18next'

import packageJson from '../../../package.json'
import NavBarItem from './nav_bar_item'
import useStyles from './styles'
import { NavBarProps, TabType } from './types'
import { IconMagnifyingGlass } from '@components/icon'

const NavBar = ({ tabs, navigation, state }: NavBarProps): React.ReactElement => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const latest = useQuery(api.user.getLatestVersion, {
    language: i18n.language,
  })

  useEffect(() => {
    if (latest === undefined) return
    const ver = getItem('version')

    if (ver === null) {
      setItem('version', packageJson.version)
      return
    }

    if (ver !== latest.version)
      Alert.alert(
        t('home:new_version'),
        latest.changelog.length > 0 ? latest.changelog : t('home:update'),
        [
          {
            text: t('home:update_now'),
            isPreferred: true,
            onPress: (): void => {
              Linking.openURL(latest.url)
              deleteItemAsync('version')
            },
          },
        ],
        { cancelable: false },
      )
  }, [latest, t])

  setTimeout(() => {
    const onb = getItem('onboarding')
    if (onb !== 'done') navigation.navigate('onboarding')
  }, 2000)

  const renderTabs = (tab: TabType, index: number): React.ReactElement => {
    const handleTabPress = (): void => {
      navigation.navigate(tab.id)
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
          onPress={() => navigation.navigate('search')}
          icon={<IconMagnifyingGlass size={24} />}
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
