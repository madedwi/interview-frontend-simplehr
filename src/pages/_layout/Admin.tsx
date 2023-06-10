import React, { Component, PropsWithChildren, ReactElement, useContext, useState } from 'react'
import AdminAppBar from '@/components/appbar/Index'
import Sidebar from '@/components/appbar/Sidebar'
import { Box, Breadcrumbs, ThemeProvider, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link'
import { Theme } from './AdminTheme'

type breadcrumb = {
  label: string,
  path?: string
}

type Props = {
  pageTitle ?: string,
  breadcrumbs ?: Element[] | ReactElement[]
} & PropsWithChildren

const AdminLayout = ({pageTitle = 'Dashboard', breadcrumbs=[], children}: Props) => {
  const [showSideBar, setShowSideBar] = useState<boolean>(true)
  // const [mainClassContainer, setMainClassContainer] = useState(``)

  const AppBar = () => {
    return <AdminAppBar 
      pageTitle={pageTitle}
      onSidebarToggleClicked={() => {
        setShowSideBar(!showSideBar);
      }} />
  }

  const PageHeader = () => {
      return <Box sx={{
        width: '100%',
        margin: '0 -24px 25px',
        padding: '15px 24px',
        backgroundColor: '#5d9fe0',
        color: '#fff',
        display: 'flex',
        gap: 2
      }}>
        <Typography variant='h2' component='div' sx={{
          borderRight: '1px solid #fff',
          paddingTop: 1,
          paddingBottom: 1,
          paddingRight: 2,
          marginTop: -1,
          marginBottom: -1
        }}>{pageTitle}</Typography> 
        <Breadcrumbs className='breadcrumb-container' separator={<NavigateNextIcon fontSize="small" />} sx={{
          fontSize: '0.9rem',
          color: '#fff'
        }}>
          {breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : ''}
        </Breadcrumbs>

      </Box>
  }

  return (
        <ThemeProvider theme={Theme}>
          <AppBar />
          <div className={`flex flex-row ${showSideBar ? '' : 'sidebar-collapsed'}`} id='main'>
            <Sidebar />
            <main className='grow'>
              <PageHeader />

              {children}
            </main>
          </div>
        </ThemeProvider>
  )
}

export default AdminLayout