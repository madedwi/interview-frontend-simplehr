import { ButtonGroup, IconButton, Tooltip } from '@mui/material'
import { DataGrid, GridColDef, GridPaginationModel, GridRowsProp } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ClearIcon from '@mui/icons-material/Clear';
import { KaryawanType } from '@/types/karyawan';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

type Props = {
  clickEditHanlder: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, karyawan: KaryawanType) => void;
  clickDeleteHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, karyawan: KaryawanType) => void;
  pageSize: number;
  page: number;
  total: number;
  karyawans: KaryawanType[]
}

const tableColumnsDef: GridColDef[] = [
  { field: 'name', headerName: 'Nama Karyawan', flex:1 },
  { field: 'email', headerName: 'Alamat Email', flex:1 },
  { field: 'join_date', headerName: 'Tanggal Bergabung', flex:1, renderCell: (params) => {
    try {
      return format(params.row.join_date, 'yyyy-MM-dd');
    } catch (error) {
      return null
    }
  } },
  { field: 'unit_name', headerName: 'Unit', flex:1},
  { field: 'updated_at', headerName: 'Last Modified At', flex:1, renderCell: (params) => {
    return format(params.row.updated_at, 'yyyy-MM-dd hh:mm:ss');
  } }
]
const Datatable = ({clickEditHanlder, clickDeleteHandler, pageSize, page, total=0, karyawans = []}: Props) => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: page
  })
  
  const tableColumns = useMemo(() => {
    const actionColumn: GridColDef = { field: 'id', headerName: 'Action', flex:1, renderCell(params) {
      const buttons = [
        <Tooltip title="Edit nama karyawan" key={`edit-btn-${params.row.id}`} >
          <IconButton color='info' onClick={e => clickEditHanlder(e, params.row)}>
            <ModeEditIcon />
          </IconButton>
        </Tooltip>,
        <Tooltip title="Hapus karyawan" key={`block-btn-${params.row.id}`} >
          <IconButton color='warning' onClick={e => clickDeleteHandler(e, params.row)}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      ];
      return <ButtonGroup>
        {buttons}
      </ButtonGroup>
    }};
    return [...tableColumnsDef, actionColumn];
  }, [clickEditHanlder, clickDeleteHandler]);

  const tableRows = useMemo(() => {
    return karyawans.map((karyawan: KaryawanType) => {
      console.log(karyawan);
      
      return {
        name: karyawan.name,
        email: karyawan.email,
        unit_name: karyawan.unit?.name,
        id: karyawan.id,
        join_date: karyawan.join_date,
        updated_at: karyawan.updated_at == null ? karyawan.created_at : karyawan.updated_at
      }
    } ) as unknown as GridRowsProp;
  }, [karyawans])

  const paginationModelChangeHandler = (model: GridPaginationModel) => {
    const searchParams = new URLSearchParams();
    console.log(model);
    
    searchParams.append('page', model.page.toString());
    searchParams.append('page-size', model.pageSize.toString());
    // setPaginationModel({});
    router.push(`/admin/master-data/karyawans?`+searchParams.toString());
  }

  useEffect(() => {
    console.log('pagination_model', paginationModel);
    
  }, [paginationModel])

  return (
    <DataGrid 
      rowCount={total}
      rows={tableRows} 
      columns={tableColumns}
      pageSizeOptions={[20]}
      paginationModel={paginationModel}
      paginationMode='server'
      onPaginationModelChange={paginationModelChangeHandler} />
  )
}

export default Datatable