import axios from '@/lib/axios'
import { NextPageWithLayout } from '@/pages/_app'
import AdminLayout from '@/pages/_layout/Admin'
import { UnitType, UnitsHttpResponse } from '@/types/master-data/unit'
import Datatable from '@/views/units/Datatable'
import { Box, Button, Paper, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import parse from 'date-fns/parse';
import useSWR from 'swr'
import { useRouter } from 'next/router'
import FormDialog from '@/views/units/FormDialog'

type Props = {}

const fetcher = (...args):Promise<UnitsHttpResponse> => axios.get(...args)
  .then( response => response.data)
  .then( data => {
    const response: UnitsHttpResponse = {
      per_page: data.per_page,
      current_page: data.current_page,
      total: data.total,
      data: data.data.map(( unit: any ): UnitType => {
        return {
          id: unit.id,
          name: unit.name,
          created_at: parse(unit.created_at, 'yyyy-MM-dd', new Date()),
          updated_at: unit.updated_at == null ? parse(unit.created_at, 'yyyy-MM-dd', new Date()) : parse(unit.updated_at, 'yyyy-MM-dd', new Date())
        }
      })
    }

    return response;
  });


const MasterDataUnitIndex: NextPageWithLayout = (props: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [activeUnit, setActiveUnit] = useState<UnitType|undefined>(undefined)

  const { data, mutate, error } = useSWR('/api/units?per_page=20', url => {
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

  const clickDeleteHandler = async (e: React.MouseEvent, unit: UnitType) => {
    const c = confirm("Apakah anda ingin menghapus data unit?");
    if(c){
      await axios.delete(`/api/units/${unit.id}`);
      mutate();
    }
  }

  const clickEditHanlder = (e: React.MouseEvent, unit: UnitType) => {
    // alert(unit.id)
    setActiveUnit(unit);
    setOpenModal(true);
  }

  const closeFormDialogHandler = (unit?: UnitType) => {
    setActiveUnit(undefined);
    setOpenModal(false);

    if(unit){
      mutate();
    }
  }

  return (
    <Paper sx={{
      padding: theme.spacing(2)
    }}>
      <Button onClick={e => setOpenModal(true)} variant='outlined'>Add Unit</Button>
      <Box sx={{
        marginY: theme.spacing(3)
      }}>
        <Datatable clickDeleteHandler={clickDeleteHandler} clickEditHanlder={clickEditHanlder} 
          units={datatableProps.data} 
          page={datatableProps.page} 
          pageSize={datatableProps.pageSize} total={datatableProps.total} />
      </Box>

      <FormDialog open={openModal} defaultValue={activeUnit} onClose={closeFormDialogHandler} key={(activeUnit || {name: "undefined-unit"}).name} />
    </Paper>
  )
}

MasterDataUnitIndex.getLayout = (page) => <AdminLayout pageTitle='Unit'>{page}</AdminLayout>

export default MasterDataUnitIndex