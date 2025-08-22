import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

import { StringsProvider } from '@providers/strings'
import { ThemeProvider } from '@providers/theme'
import Router from '@router/router'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

export default function App(): React.ReactElement {
  return (
    <StringsProvider>
      <KeyboardProvider>
        <ConvexProvider client={convex}>
          <ThemeProvider>
            <SafeAreaProvider>
              <Router />
            </SafeAreaProvider>
          </ThemeProvider>
        </ConvexProvider>
      </KeyboardProvider>
    </StringsProvider>
  )
}
