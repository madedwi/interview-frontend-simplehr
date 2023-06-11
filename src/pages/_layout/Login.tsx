import { ThemeProvider } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { Theme } from './AdminTheme'

type Props = PropsWithChildren

const LoginLayout = ({children}: Props) => {
  return (
    <ThemeProvider theme={Theme}>
      <main className='grow' style={{
        height: 'calc(100vh)'
      }}>
        {children}
      </main>
    </ThemeProvider>
  )
}

export default LoginLayout