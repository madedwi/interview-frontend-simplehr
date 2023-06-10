import { Button, Card, CardContent, FormGroup, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { NextPageWithLayout } from '../_app'
import LoginLayout from '../_layout/Login'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { StyledFormControl } from '@/components/form/FormControl'
import DisplayError from '@/components/form/ErrorField'
import { signIn } from 'next-auth/react'

type Props = {}

const schema = yup.object({
    username: yup.string().email().required(),
    password: yup.string().required(),
  }).required();

type FormData = yup.InferType<typeof schema>;

const Login: NextPageWithLayout = (props: Props) => {
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

    console.log(response);
    
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}>
        <Paper className='w-[400px] p-5'>
          <Typography variant='h4'>Login</Typography>
          <div className="mt-5">
            <form method="post" onSubmit={handleSubmit(submitHandler)}>
              <StyledFormControl error={errors.username != undefined}  size='small'>
                <InputLabel htmlFor="username">Username/email</InputLabel>
                <Controller
                    name='username'
                    control={control}
                    render={({ field }) => <OutlinedInput type='email' id='username' placeholder='user@domain.com' size='small' label='Username/email' {...field} /> }
                  />
                <DisplayError error={errors.username} />
              </StyledFormControl>

              <StyledFormControl error={errors.password != undefined}  size='small'>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Controller
                    name='password'
                    control={control}
                    render={({ field }) => <OutlinedInput type='password' id='password' label='password' size='small' {...field} /> }
                  />
                <DisplayError error={errors.password} />
              </StyledFormControl>

              <FormGroup>
                <Button fullWidth variant='contained' color='primary' type='submit'>Login</Button>
              </FormGroup>

            </form>
          </div>
        </Paper>
    </main>
  )
}

Login.getLayout = page => <LoginLayout>{page}</LoginLayout>

export default Login