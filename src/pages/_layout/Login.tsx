import React, { PropsWithChildren } from 'react'

type Props = PropsWithChildren

const LoginLayout = ({children}: Props) => {
  return (
    <>
    {children}
    </>
  )
}

export default LoginLayout