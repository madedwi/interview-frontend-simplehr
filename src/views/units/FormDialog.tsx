"use client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Input, InputLabel, OutlinedInput, Snackbar, styled, useTheme } from '@mui/material'
import React, { useEffect, useState} from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import DisplayError from '@/components/form/ErrorField';
import { UnitHttpResponse, UnitType } from '@/types/master-data/unit';
import { StyledFormControl } from '@/components/form/FormControl';
import axios from '@/lib/axios';


export type OnCloseCategoryFormHandler = ( data? : UnitType) => void;

type Props = {
  open: boolean;
  defaultValue?: UnitType;
  onClose: OnCloseCategoryFormHandler;
}

const schema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required(),
}).required();
type FormData = yup.InferType<typeof schema>;

const FormDialog = ({open, defaultValue, onClose}: Props) => {
  const theme = useTheme();
  const {control, handleSubmit, setValue, getValues, formState: { errors, isSubmitting }} = useForm<FormData>({
    defaultValues: {
      name: defaultValue == undefined? '' : defaultValue.name
    },
    resolver: yupResolver(schema)
  });

  const [snackbarOpt, setSnackbarOpt] = useState({
    open: false,
    message: '',
  })

  const onCloseHandler = () => {
    onClose();
  }

  const snackbarCloseHandler = () => {
    setSnackbarOpt({
      open: false,
      message: ''
    });
  }

  const onSubmitHandler: SubmitHandler<FormData> = async (formData) => {
    let res = null
    if(defaultValue && defaultValue.id){
      res = await axios.put(`/api/units/${defaultValue.id}`, {
        data: [
          {name: formData.name }
        ]
      });

    } else {
      res = await axios.post('/api/units', {
        data: [
          {name: formData.name }
        ]
      })
    }

    const data: UnitHttpResponse = await res.data;
    setSnackbarOpt({
      open: true,
      message: 'Data unit berhasil disimpan'
    })
    onClose(data.data[0]);

   
  }

  return (
    <>
    <Snackbar
      autoHideDuration={3000}
      onClose={snackbarCloseHandler}
      {...snackbarOpt}
    />
    <Dialog open={open} onClose={onCloseHandler} fullWidth>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
      <DialogTitle>Form Unit</DialogTitle>
      <DialogContent style={{
        paddingTop: theme.spacing(2)
      }}>
        <StyledFormControl size='small' error={errors.name != undefined} >
          <InputLabel htmlFor="name">Nama</InputLabel>
          <Controller 
            name='name' 
            control={control}
            render={({ field }) => <OutlinedInput label="Nama" id='name' {...field} />}/>
          <DisplayError error={errors.name} />
        </StyledFormControl>
      </DialogContent>
      <DialogActions>
        <Button type='reset' variant='contained' color='secondary' onClick={onCloseHandler}>Batal</Button>
        <Button type='submit' variant='contained' color='primary'>Simpan</Button>
      </DialogActions>
      </form>
    </Dialog>
    </>
  )
}

export default FormDialog