import { ConvexProvider, ConvexReactClient } from 'convex/react'

import { ThemeProvider } from '@providers/theme'
import Router from '@router'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

export default function App(): React.ReactElement {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </ConvexProvider>
  )
}
