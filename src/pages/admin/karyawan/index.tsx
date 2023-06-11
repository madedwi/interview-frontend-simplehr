import axios from '@/lib/axios'
import { NextPageWithLayout } from '@/pages/_app'
import AdminLayout from '@/pages/_layout/Admin'
import { KaryawanType, KaryawansHttpResponse } from '@/types/karyawan'
import Datatable from '@/views/karyawan/Datatable'
import { Box, Button, Paper, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import parse from 'date-fns/parse';
import useSWR from 'swr'
import { useRouter } from 'next/router'
import FormDialog from '@/views/karyawan/FormDialog'
import { UnitType, UnitsHttpResponse } from '@/types/master-data/unit'
import { JabatanType, JabatansHttpResponse } from '@/types/master-data/jabatan'

type Props = {}

const fetcher = (...args):Promise<KaryawansHttpResponse> => axios.get(...args)
  .then( response => response.data)
  .then( data => {
    const response: KaryawansHttpResponse = {
      per_page: data.per_page,
      current_page: data.current_page,
      total: data.total,
      data: data.data.map(( karyawan: any ): KaryawanType => {

        let unit: UnitType|undefined;
        
        if(karyawan.unit){
          unit = {
            name: karyawan.unit.name,
            id: karyawan.unit.id
          }
        }

        let jabatan: JabatanType[]|undefined;
        if(karyawan.jabatan){
          jabatan = karyawan.jabatan.map((jbt: any) => {
            return {
              name: jbt.name,
              id: jbt.id,
            }
          })
        }
        
        return {
          id: karyawan.id,
          name: karyawan.name,
          email: karyawan.email,
          join_date: new Date(karyawan.join_date),
          unit_id: karyawan.unit_id,
          unit,
          jabatan,
          created_at: new Date(karyawan.created_at), //parse(karyawan.created_at, 'yyyy-MM-dd', new Date()),
          updated_at: karyawan.updated_at == null ? new Date(karyawan.created_at) : new Date(karyawan.updated_at)
        }
      })
    }

    return response;
  });


const unitFetcher = (...args):Promise<UnitsHttpResponse> => axios.get(...args)
  .then( res => res.data)
  .then((data: any) =>{
    return {
      total: data.total,
      per_page: data.per_page,
      current_page: data.current_page,
      data: data.data.map(( unit: any ) => {
        return {
          id: unit.id,
          name: unit.name
        }
      })
    }
  })
const jabatanFetcher = (...args):Promise<JabatansHttpResponse> => axios.get(...args)
  .then( res => res.data)
  .then((data: any) =>{
    return {
      total: data.total,
      per_page: data.per_page,
      current_page: data.current_page,
      data: data.data.map(( unit: any ) => {
        return {
          id: unit.id,
          name: unit.name
        }
      })
    }
  })


const MasterDataKaryawanIndex: NextPageWithLayout = (props: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [activeKaryawan, setActiveKaryawan] = useState<KaryawanType|undefined>(undefined)

  const { data, mutate, error } = useSWR('/api/pegawai?per_page=20', url => {
    return fetcher(url)
  })

  const { data: units } = useSWR('/api/units?show-all=1', url => {
    return unitFetcher(url)
  })

  const { data: jabatans } = useSWR('/api/jabatan?show-all=1', url => {
    return jabatanFetcher(url)
  })

  const datatableProps = useMemo(() => {
    if(!data) return {
      data: [],
      pageSize: 20,
      total: 0,
      page: 0
    }

    console.log(data);
    

    return {
      data: data.data,
      pageSize: data.per_page,
      page: data.current_page - 1,
      total: data.total
    }
  }, [data])

  const clickDeleteHandler = async (e: React.MouseEvent, karyawan: KaryawanType) => {
    const c = confirm("Apakah anda ingin menghapus data karyawan?");
    if(c){
      await axios.delete(`/api/karyawan/${karyawan.id}`);
      mutate();
    }
  }

  const clickEditHanlder = (e: React.MouseEvent, karyawan: KaryawanType) => {
    // alert(unit.id)
    setActiveKaryawan(karyawan);
    setOpenModal(true);
  }

  const closeFormDialogHandler = (karyawan?: KaryawanType) => {
    setActiveKaryawan(undefined);
    setOpenModal(false);

    if(karyawan){
      mutate();
    }
  }

  return (
    <Paper sx={{
      padding: theme.spacing(2)
    }}>
      <Button onClick={e => setOpenModal(true)} variant='outlined'>Tambah Karyawan</Button>
      <Box sx={{
        marginY: theme.spacing(3)
      }}>
        <Datatable clickDeleteHandler={clickDeleteHandler} clickEditHanlder={clickEditHanlder} 
          karyawans={datatableProps.data} 
          page={datatableProps.page} 
          pageSize={datatableProps.pageSize} total={datatableProps.total} />
      </Box>

      <FormDialog open={openModal} 
        defaultValue={activeKaryawan} 
        onClose={closeFormDialogHandler}  
        units={units ? units.data : []}
        jabatans={jabatans ? jabatans.data : []}
        key={(activeKaryawan || {name: "undefined-karyawan"}).name + `${units?.data.length}-----${jabatans?.data.length}`}/>
    </Paper>
  )
}

MasterDataKaryawanIndex.getLayout = (page) => <AdminLayout pageTitle='Karyawan'>{page}</AdminLayout>

export default MasterDataKaryawanIndex