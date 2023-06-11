import { ButtonGroup, IconButton, Tooltip } from '@mui/material'
import { DataGrid, GridColDef, GridPaginationModel, GridRowsProp } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ClearIcon from '@mui/icons-material/Clear';
import { UnitType } from '@/types/master-data/unit';
import { useRouter } from 'next/router';

type Props = {
  clickEditHanlder: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, unit: UnitType) => void;
  clickDeleteHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, unit: UnitType) => void;
  pageSize: number;
  page: number;
  total: number;
  units: UnitType[]
}

const tableColumnsDef: GridColDef[] = [
  { field: 'name', headerName: 'Nama Unit', flex:1 },
  { field: 'updated_at', headerName: 'Last Modified At', flex:1 }
]
const Datatable = ({clickEditHanlder, clickDeleteHandler, pageSize, page, total=0, units = []}: Props) => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: page
  })
  
  const tableColumns = useMemo(() => {
    const actionColumn: GridColDef = { field: 'id', headerName: 'Action', flex:1, renderCell(params) {
      const buttons = [
        <Tooltip title="Edit nama unit" key={`edit-btn-${params.row.id}`} >
          <IconButton color='info' onClick={e => clickEditHanlder(e, params.row)}>
            <ModeEditIcon />
          </IconButton>
        </Tooltip>,
        <Tooltip title="Hapus unit" key={`block-btn-${params.row.id}`} >
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
    return units.map((unit: UnitType) => {
      return {
        name: unit.name,
        id: unit.id,
        updated_at: unit.updated_at == null ? unit.created_at : unit.updated_at
      }
    } ) as unknown as GridRowsProp;
  }, [units])

  const paginationModelChangeHandler = (model: GridPaginationModel) => {
    const searchParams = new URLSearchParams();
    console.log(model);
    
    searchParams.append('page', model.page.toString());
    searchParams.append('page-size', model.pageSize.toString());
    // setPaginationModel({});
    router.push(`/admin/master-data/units?`+searchParams.toString());
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