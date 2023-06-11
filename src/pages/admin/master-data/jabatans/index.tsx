import axios from '@/lib/axios'
import { NextPageWithLayout } from '@/pages/_app'
import AdminLayout from '@/pages/_layout/Admin'
import { JabatanType, JabatansHttpResponse } from '@/types/master-data/jabatan'
import Datatable from '@/views/jabatan/Datatable'
import { Box, Button, Paper, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import parse from 'date-fns/parse';
import useSWR from 'swr'
import { useRouter } from 'next/router'
import FormDialog from '@/views/jabatan/FormDialog'

type Props = {}

const fetcher = (...args):Promise<JabatansHttpResponse> => axios.get(...args)
  .then( response => response.data)
  .then( data => {
    const response: JabatansHttpResponse = {
      per_page: data.per_page,
      current_page: data.current_page,
      total: data.total,
      data: data.data.map(( jabatan: any ): JabatanType => {
        console.log(jabatan);
        
        return {
          id: jabatan.id,
          name: jabatan.name,
          created_at: new Date(jabatan.created_at), //parse(jabatan.created_at, 'yyyy-MM-dd', new Date()),
          updated_at: jabatan.updated_at == null ? new Date(jabatan.created_at) : new Date(jabatan.updated_at)
        }
      })
    }

    return response;
  });


const MasterDataUnitIndex: NextPageWithLayout = (props: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [activeJabatan, setActiveJabatan] = useState<JabatanType|undefined>(undefined)

  const { data, mutate, error } = useSWR('/api/jabatan?per_page=20', url => {
    return fetcher(url)
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

  const clickDeleteHandler = async (e: React.MouseEvent, jabatan: JabatanType) => {
    const c = confirm("Apakah anda ingin menghapus data jabatan?");
    if(c){
      await axios.delete(`/api/jabatan/${jabatan.id}`);
      mutate();
    }
  }

  const clickEditHanlder = (e: React.MouseEvent, jabatan: JabatanType) => {
    // alert(unit.id)
    setActiveJabatan(jabatan);
    setOpenModal(true);
  }

  const closeFormDialogHandler = (jabatan?: JabatanType) => {
    setActiveJabatan(undefined);
    setOpenModal(false);

    if(jabatan){
      mutate();
    }
  }

  return (
    <Paper sx={{
      padding: theme.spacing(2)
    }}>
      <Button onClick={e => setOpenModal(true)} variant='outlined'>Tambah Jabatan</Button>
      <Box sx={{
        marginY: theme.spacing(3)
      }}>
        <Datatable clickDeleteHandler={clickDeleteHandler} clickEditHanlder={clickEditHanlder} 
          jabatans={datatableProps.data} 
          page={datatableProps.page} 
          pageSize={datatableProps.pageSize} total={datatableProps.total} />
      </Box>

      <FormDialog open={openModal} defaultValue={activeJabatan} onClose={closeFormDialogHandler} key={(activeJabatan || {name: "undefined-jabatan"}).name} />
    </Paper>
  )
}

MasterDataUnitIndex.getLayout = (page) => <AdminLayout pageTitle='Jabatan'>{page}</AdminLayout>

export default MasterDataUnitIndex