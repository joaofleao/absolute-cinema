import { Button, Dimensions, Image, ScrollView, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Bar from '@components/bar'
import DottedText from '@components/dotted_text'
import { IconArrow, IconChevron } from '@components/icon'
import Typography from '@components/typography'
import { ScreenType } from '@router'

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()

  const { width } = Dimensions.get('window')

  return (
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

          <Button
            title="Translate"
            onPress={() => {
              i18n.changeLanguage(i18n.language === 'en-US' ? 'pt-BR' : 'en-US')
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default Home
