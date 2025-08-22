import { Dimensions, Image, ScrollView, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Bar from '@components/bar'
import DottedText from '@components/dotted_text'
import { IconArrow, IconChevron, IconLanguages, IconMagnifyingGlass } from '@components/icon'
import IconButton from '@components/icon_button'
import Typography from '@components/typography'
import { routes, ScreenType } from '@router'

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()

  const { width } = Dimensions.get('window')

  return (
    <>
      <ScrollView style={styles.root}>
        <View style={styles.gradientContainer}>
          <RadialGradient
            style={styles.gradient}
            colors={['#481010', '#000000']}
            radius={300}
            center={[width / 2, width]}
          />
        </View>
        <View>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require('@assets/mascot.png')}
            />

            <View style={styles.title}>
              <Typography
                title
                light
              >
                ABSOLUTE
              </Typography>
              <Typography display>CINEMA</Typography>
            </View>
          </View>

          <View style={styles.content}>
            <Bar.Root>
              <Bar.Item icon={<IconChevron />}>2025</Bar.Item>
              <Bar.Item icon={<IconChevron />}>{t('home:watched')}</Bar.Item>
              <Bar.Item icon={<IconArrow />}>{t('home:by_date')}</Bar.Item>
            </Bar.Root>

            <DottedText>{t('home:empty_state')}</DottedText>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <IconButton
          icon={<IconLanguages />}
          onPress={() => {
            i18n.changeLanguage(i18n.language === 'en-US' ? 'pt-BR' : 'en-US')
          }}
        />
        <IconButton
          onPress={() => navigation.navigate(routes.search)}
          icon={<IconMagnifyingGlass />}
        />
      </View>
    </>
  )
}

export default Home
