import { useState } from 'react'
import { Alert, View } from 'react-native'
import { api } from 'convex/_generated/api'
import { useAction } from 'convex/react'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Button from '@components/button'
import { IconDoor, IconLanguages } from '@components/icon'
import Modal from '@components/modal'
import Row from '@components/row'
import { useAuthActions } from '@convex-dev/auth/react'
import { ScreenType } from '@router'

const Profile: ScreenType<'profile'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()

  const { signOut } = useAuthActions()

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
  const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [deletedModal, setDeletedModal] = useState<boolean>(false)
  const deleteAccount = useAction(api.user.deleteAccount)

  const handleDelete = async (): Promise<void> => {
    setLoadingDelete(true)
    void deleteAccount()
      .catch((error) => Alert.alert(error.message))
      .then(() => {
        setDeleteModal(false)
        setDeletedModal(true)
      })
      .finally(() => setLoadingDelete(false))
  }

  const handleSignOut = async (): Promise<void> => {
    setLoadingSignOut(true)
    void signOut()
      .catch((error) => Alert.alert(error.message))
      .then(() => {
        navigation.pop()
      })
      .finally(() => setLoadingSignOut(false))
  }
  const handleSwitchLanguage = async (): Promise<void> => {
    i18n.changeLanguage(i18n.language === 'en-US' ? 'pt-BR' : 'en-US')
  }

  return (
    <>
      <View style={styles.root}>
        <View style={styles.header}>
          <Button
            onPress={handleSwitchLanguage}
            title={
              i18n.language === 'en-US' ? t('profile:switch_to_ptbr') : t('profile:switch_to_enus')
            }
            icon={<IconLanguages />}
          />
          <Button
            loading={loadingSignOut}
            onPress={handleSignOut}
            title={t('profile:sign_out')}
            icon={<IconDoor />}
          />
          <Button
            variant="negative"
            onPress={() => setDeleteModal(true)}
            title={t('profile:delete_account')}
            icon={<IconDoor />}
          />
        </View>
      </View>
      <Modal
        setVisible={setDeleteModal}
        visible={deleteModal}
        label={t('profile:delete_account_title')}
        description={t('profile:delete_account_message')}
      >
        <Row center>
          <Button
            onPress={() => setDeleteModal(false)}
            title={t('profile:delete_account_deny')}
          />
          <Button
            loading={loadingDelete}
            onPress={handleDelete}
            variant="negative"
            title={t('profile:delete_account_confirm')}
          />
        </Row>
      </Modal>
      <Modal
        onClose={handleSignOut}
        setVisible={setDeletedModal}
        visible={deletedModal}
        label={t('profile:deleted_account_title')}
        description={t('profile:deleted_account_message')}
      >
        <Row center>
          <Button
            onPress={handleSignOut}
            variant="negative"
            title={t('profile:deleted_account_confirm')}
          />
        </Row>
      </Modal>
    </>
  )
}

export default Profile
