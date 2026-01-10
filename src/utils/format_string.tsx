import React from 'react'

import Typography from '@components/typography'

const formatString = (text: string): React.ReactElement => {
  const parts = text.split('\n').map((line, index) => {
    const formattedLine = line.split(/(%.*?%)/g).map((part, i) => {
      if (part.startsWith('%') && part.endsWith('%')) {
        return (
          <Typography
            key={`${index}-${i}`}
            onboardingAccent
          >
            {part.slice(1, -1)}
          </Typography>
        )
      }
      return (
        <Typography
          key={`${index}-${i}`}
          onboarding
        >
          {part}
        </Typography>
      )
    })

    return (
      <Typography
        key={index}
        onboarding
      >
        {formattedLine}
      </Typography>
    )
  })

  return <>{parts}</>
}

export default formatString
