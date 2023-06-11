"use client";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Input, InputLabel, OutlinedInput, Snackbar, TextField, styled, useTheme } from '@mui/material'
import React, { useEffect, useState} from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import DisplayError from '@/components/form/ErrorField';
import { KaryawanHttpResponse, KaryawanType } from '@/types/karyawan';
import { StyledFormControl } from '@/components/form/FormControl';
import axios from '@/lib/axios';
import { UnitType } from '@/types/master-data/unit';
import { JabatanType } from '@/types/master-data/jabatan';
import { format } from 'date-fns';


export type OnCloseCategoryFormHandler = ( data? : KaryawanType) => void;

type Props = {
  open: boolean;
  defaultValue?: KaryawanType;
  onClose: OnCloseCategoryFormHandler;
  units: UnitType[],
  jabatans: JabatanType[],
}

const schema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().nullable(),
  join_date: yup.string().required(),
  unit_id: yup.number().nullable(),
  unit: yup.object().shape({
    id: yup.number().nullable(),
    name: yup.string().required()
  }),
  jabatan: yup.array().of(
    yup.object().shape({
      id: yup.number().nullable(),
      name: yup.string().required()
    })
  )
}).required();
type FormData = yup.InferType<typeof schema>;

const FormDialog = ({open, defaultValue, units, jabatans, onClose}: Props) => {
  const theme = useTheme();
  const {control, handleSubmit, setValue, getValues, reset, formState: { errors, isSubmitting }} = useForm<FormData>({
    defaultValues: {
      name: defaultValue == undefined? '' : defaultValue.name
    },
    resolver: yupResolver(schema)
  });

  const [selectedUnit, setSelectedUnit] = useState({
    id: defaultValue == undefined ? 0 : (defaultValue.unit == undefined ? 0 : defaultValue.unit?.id),
    label: defaultValue == undefined ? '' : (defaultValue.unit == undefined ? '' : defaultValue.unit.name)
  })
  const [selectedJabatans, setSelectedJabatans] = useState<Array<{id: number| undefined| null; label: string; }>>([])
  const [unitOptions, setUnitOptions] = useState([...units])
  const [jabatanOptions, setJabatanOptions] = useState([...jabatans])

  const [snackbarOpt, setSnackbarOpt] = useState({
    open: false,
    message: '',
  })

  useEffect(() => {
    if(defaultValue != undefined){
      let values: FormData = {
        name: defaultValue.name,
        email: defaultValue.email,
        join_date: format(defaultValue.join_date, 'yyyy-MM-dd'),
        unit: { id: 0, name: ''}
      };
      
      if(defaultValue.unit){
        values.unit = {
          id: defaultValue.unit?.id,
          name: defaultValue.unit?.name
        };
        
        setSelectedUnit({
          id: defaultValue.unit?.id,
          label: defaultValue.unit?.name
        })
      }

      if(defaultValue.jabatan){
        values.jabatan = [
          ...defaultValue.jabatan.map( j => ({
            id: j.id,
            name: j.name
          }))
        ];

        setSelectedJabatans([
          ...defaultValue.jabatan.map( j => ({
            id: j.id,
            label: j.name
          }))
        ])
      }

      reset(values);
      
    }
  }, [defaultValue, setValue])

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
    console.log(formData);
    

    if(formData.unit.id == undefined || formData.unit.id == 0){
      const resUnit = await axios.post('/api/units', {
        data: [
          {name: formData.unit.name }
        ]
      })

      const unitData = await resUnit.data;
      const newUnit = unitData.data[0];
      
      formData.unit = newUnit;
    }

    if(formData.jabatan){
      for(let i in formData.jabatan){
        const jbt = formData.jabatan[i];
        if(jbt.id == undefined || jbt.id == 0){
          const resjbt = await axios.post('/api/jabatan', {
            data: [
              {name: jbt.name}
            ]
          })
          const jbtData = await resjbt.data;
          formData.jabatan[i] = {
            id: jbtData.data[0].id,
            name: jbtData.data[0].name
          }
        }
      }
    }

    const dataKaryawan = {
      name: formData.name,
      password: formData.password,
      email: formData.email,
      join_date: formData.join_date,
      unit_id: formData.unit.id,
      jabatan: formData.jabatan
    };
    let res = null
    if(defaultValue && defaultValue.id){
      res = await axios.put(`/api/pegawai/${defaultValue.id}`, {
        data: [
          {...dataKaryawan}
        ]
      });

    } else {
      res = await axios.post('/api/pegawai', {
        data: [
          {...dataKaryawan}
        ]
      })
    }

    const data: KaryawanHttpResponse = await res.data;
    setSnackbarOpt({
      open: true,
      message: 'Data karyawan berhasil disimpan'
    })
    onClose(data.data[0]);

   
  }

  const handleInputUnitChange = (e: React.SyntheticEvent, value: string) => {
    const unit = units.find( u => u.name.indexOf(value) >= 0);
    if(!unit){
      setUnitOptions([
        ...units,
        {
          name: value,
          id: 0
        }
      ])
    } 
  }

  const handleInputJabatanChange = (e: React.SyntheticEvent, value: string) => {
    const jabatan = jabatans.find( u => u.name.indexOf(value) >= 0);
    if(!jabatan){
      setJabatanOptions([
        ...jabatans,
        {
          id: 0,
          name: value
        }
      ])
    } 
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
      <DialogTitle>Form Karyawan</DialogTitle>
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
        <StyledFormControl size='small' error={errors.name != undefined} >
          <InputLabel htmlFor="name">Alamat email (Username)</InputLabel>
          <Controller 
            name='email' 
            control={control}
            render={({ field }) => <OutlinedInput type='email' label="Alamat email (Username)" id='email' {...field} />}/>
          <DisplayError error={errors.email} />
        </StyledFormControl>
        <StyledFormControl size='small' error={errors.name != undefined} >
          <InputLabel htmlFor="name">Password</InputLabel>
          <Controller 
            name='password' 
            control={control}
            render={({ field }) => <OutlinedInput type="password" label="Password" id='password' {...field} />}/>
          <DisplayError error={errors.password} />
        </StyledFormControl>
        <StyledFormControl size='small' error={errors.name != undefined} >
          <InputLabel htmlFor="name" shrink>Tgl Bergabung</InputLabel>
          <Controller 
            name='join_date' 
            control={control}
            render={({ field }) => <OutlinedInput type="date" notched label="Tgl Bergabung" id='join_date' {...field} />}/>
          <DisplayError error={errors.join_date} />
        </StyledFormControl>

        <StyledFormControl>
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={unitOptions.map((unit: UnitType) => {
              return {
                label: unit.name,
                id: unit.id,
              }
            })}
            sx={{ width: 300 }}
            size='small'
            value={selectedUnit}
            renderInput={(params) => <TextField {...params} label="Unit" size='small' />}
            onInputChange={handleInputUnitChange}
            onChange={(event, value) => {
              if(value != null){
                setValue('unit', {
                  id: value?.id,
                  name: value.label
                })

                setSelectedUnit(value);
              }
            }}
            isOptionEqualToValue={(option, value) => {
              return option.label === value.label;
            }}
          />
          </StyledFormControl>

          <StyledFormControl>
            <Autocomplete
              key={`jabatan-of-${defaultValue?.name}`}
              multiple
              fullWidth
              options={jabatanOptions.map((jabatan: JabatanType) => {
                return {
                  id: jabatan.id,
                  label: jabatan.name,
                }
              })}
              sx={{ width: 300 }}
              size='small'
              value={selectedJabatans}
              renderInput={(params) => <TextField {...params} label="Jabatan" size='small' />}
              onInputChange={handleInputJabatanChange}
              onChange={(event, value) => {
                console.log(value);
                setValue('jabatan', value.map( v => {
                  return {
                    id: v.id,
                    name: v.label
                  }
                }))
                setSelectedJabatans(value);
                
                // if(value != null){
                //   setValue('jabatan', [{
                //     id: value?.id,
                //     name: value.label
                //   }])
                //   
                // }
              }}
              isOptionEqualToValue={(option, value) => {
                return option.label === value.label;
              }}
            />
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