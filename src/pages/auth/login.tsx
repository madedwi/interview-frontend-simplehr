import { Box, Button, Card, CardContent, FormGroup, InputLabel, OutlinedInput, Paper, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { NextPageWithLayout } from '../_app'
import LoginLayout from '../_layout/Login'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { StyledFormControl } from '@/components/form/FormControl'
import DisplayError from '@/components/form/ErrorField'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

type Props = {}

const schema = yup.object({
    username: yup.string().email().required(),
    password: yup.string().required(),
  }).required();

type FormData = yup.InferType<typeof schema>;

const Login: NextPageWithLayout = (props: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
      defaultValues: {
        username: '',
        password: ''
      },
      resolver: yupResolver(schema)
    });

  const submitHandler = async (data: FormData) => {
    const response = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if(response?.status == 200){
      router.replace('/admin');
    }
    
  }

  return (
      <Paper sx={{
        width: 600,
        padding: theme.spacing(5),
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'calc((100vh / 2) - 250px)'
      }}>
        <Typography variant='h2'>Login</Typography>
        <Box sx={{
          marginTop: theme.spacing(3)
        }}>
          <form method="post" onSubmit={handleSubmit(submitHandler)}>
            <StyledFormControl error={errors.username != undefined}  size='small'>
              <InputLabel htmlFor="username" shrink>Username/email</InputLabel>
              <Controller
                  name='username'
                  control={control}
                  render={({ field }) => <OutlinedInput type='email' notched id='username' placeholder='user@domain.com' size='small' label='Username/email' {...field} /> }
                />
              <DisplayError error={errors.username} />
            </StyledFormControl>

            <StyledFormControl error={errors.password != undefined}  size='small'>
              <InputLabel htmlFor="password" shrink>Password</InputLabel>
              <Controller
                  name='password'
                  control={control}
                  render={({ field }) => <OutlinedInput notched type='password' id='password' label='password' size='small' {...field} /> }
                />
              <DisplayError error={errors.password} />
            </StyledFormControl>

            <FormGroup>
              <Button fullWidth variant='contained' color='primary' type='submit'>Login</Button>
            </FormGroup>

          </form>
        </Box>
      </Paper>
  )
}

Login.getLayout = page => <LoginLayout>{page}</LoginLayout>

export default Login