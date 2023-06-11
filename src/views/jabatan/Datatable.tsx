import { ButtonGroup, IconButton, Tooltip } from '@mui/material'
import { DataGrid, GridColDef, GridPaginationModel, GridRowsProp } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ClearIcon from '@mui/icons-material/Clear';
import { JabatanType } from '@/types/master-data/jabatan';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

type Props = {
  clickEditHanlder: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, jabatan: JabatanType) => void;
  clickDeleteHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, jabatan: JabatanType) => void;
  pageSize: number;
  page: number;
  total: number;
  jabatans: JabatanType[]
}

const tableColumnsDef: GridColDef[] = [
  { field: 'name', headerName: 'Nama Jabatan', flex:1 },
  { field: 'updated_at', headerName: 'Last Modified At', flex:1, renderCell: (params) => {
    return format(params.row.updated_at, 'yyyy-MM-dd hh:mm:ss');
  } }
]
const Datatable = ({clickEditHanlder, clickDeleteHandler, pageSize, page, total=0, jabatans = []}: Props) => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: page
  })
  
  const tableColumns = useMemo(() => {
    const actionColumn: GridColDef = { field: 'id', headerName: 'Action', flex:1, renderCell(params) {
      const buttons = [
        <Tooltip title="Edit nama jabatan" key={`edit-btn-${params.row.id}`} >
          <IconButton color='info' onClick={e => clickEditHanlder(e, params.row)}>
            <ModeEditIcon />
          </IconButton>
        </Tooltip>,
        <Tooltip title="Hapus jabatan" key={`block-btn-${params.row.id}`} >
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
    return jabatans.map((jabatan: JabatanType) => {
      return {
        name: jabatan.name,
        id: jabatan.id,
        updated_at: jabatan.updated_at == null ? jabatan.created_at : jabatan.updated_at
      }
    } ) as unknown as GridRowsProp;
  }, [jabatans])

  const paginationModelChangeHandler = (model: GridPaginationModel) => {
    const searchParams = new URLSearchParams();
    console.log(model);
    
    searchParams.append('page', model.page.toString());
    searchParams.append('page-size', model.pageSize.toString());
    // setPaginationModel({});
    router.push(`/admin/master-data/jabatans?`+searchParams.toString());
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