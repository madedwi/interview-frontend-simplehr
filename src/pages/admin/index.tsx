import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { NextPageWithLayout } from '../_app';
import AdminLayout from '../_layout/Admin';
import { Box, Button, OutlinedInput, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';
import axios from '@/lib/axios';
import { format } from 'date-fns';

type Props = {}


const getSummary = async (date_start: string, date_end: string) => {
  const resSumUser = await axios.get('/api/summary/user', {
    params: {
      date_start,
      date_end
    }
  });
  const dataSumUser = await resSumUser.data;
  const totalUser: number = dataSumUser.data.total;

  const resSumUnit = await axios.get('/api/summary/unit');
  const dataSumUnit = await resSumUnit.data;
  const totalUnit: number = dataSumUnit.data.total;

  const resSumJabatan = await axios.get('/api/summary/jabatan');
  const dataSumJabatan = await resSumJabatan.data;
  const totalJabatan: number = dataSumJabatan.data.total;

  const resSumLogin = await axios.get('/api/summary/user-login',{
    params: {
      date_start,
      date_end
    }
  });
  const dataSumLogin = await resSumLogin.data;
  const totalLogin: number = dataSumLogin.data.total;

  const resTopLogin = await axios.get('/api/summary/user-top-login',{
    params: {
      date_start,
      date_end
    }
  });
  const dataTopLogin = await resTopLogin.data;
  const topLogin: any[] = dataTopLogin.data;

  console.log(topLogin);
  

  return {
    totalUser,
    totalUnit,
    totalJabatan,
    totalLogin,
    topLogin
  }
}


const IndexAdmin: NextPageWithLayout = (props: Props) => {
  const theme = useTheme()
  const [countUser, setCountUser] = useState(0)
  const [countJabatan, setCountJabatan] = useState(0)
  const [countUnit, setCountUnit] = useState(0)
  const [countLogin, setCountLogin] = useState(0)
  const [topLogin, setTopLogin] = useState([])
  const [filterDate, setFilterDate] = useState<{start: string; end: string;}>({
    start: '',
    end: ''
  })

  useEffect(() => {
    getSummary('', '')
      .then(({
        totalUser,
        totalUnit,
        totalJabatan,
        totalLogin,
        topLogin
      }) => {
        setCountUser(totalUser);
        setCountJabatan(totalJabatan);
        setCountUnit(totalUnit);
        setCountLogin(totalLogin);
        setTopLogin(topLogin);
      })
  }, [])

  const clickFilterHandler = () => {


    getSummary(filterDate.start, filterDate.end)
      .then(({
        totalUser,
        totalUnit,
        totalJabatan,
        totalLogin,
        topLogin
      }) => {
        setCountUser(totalUser);
        setCountJabatan(totalJabatan);
        setCountUnit(totalUnit);
        setCountLogin(totalLogin);
        setTopLogin(topLogin);
      })
  }


  return (
    <>
      <Paper sx={{
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2)
      }}>
        <Typography variant='h3'>Filter Data</Typography>
        <Box sx={{
          display: 'flex',
          marginTop: theme.spacing(2)
        }}>
          <Box sx={{
            width: 200
          }}>
            <TextField type='date' label='Tgl Mulai' variant='outlined' size='small' 
              InputProps={{ notched: true}} InputLabelProps={{ shrink: true }}
              value={filterDate.start}
              onChange={e => {
                setFilterDate({...filterDate, start: e.target.value})
              }} />
          </Box>
          <Box sx={{
            width: 200
          }}>
            <TextField type='date' label='Tgl Selesai' variant='outlined' size='small' 
              InputProps={{ notched: true}} InputLabelProps={{ shrink: true }} 
              value={filterDate.end}
              onChange={e => {
                setFilterDate({...filterDate, end: e.target.value})
              }} />
          </Box>
          <Box sx={{
            width: 200
          }}>
            <Button variant='contained' color='info' onClick={clickFilterHandler}>Cari</Button>
          </Box>
        </Box>

      </Paper>

      <Box sx={{
        width: '100%',
        display: 'flex'
      }}>
        <Box sx={{
          width: ((3/12) * 100) + '%',
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2) 
        }}>
          <Paper sx={{
            padding: theme.spacing(2),
          }}>
            <Typography variant='h3'>Jumlah Karyawan</Typography>
            
            <Typography variant='body1' sx={{
              fontSize: 30,
              fontWeight: 800
            }}>{ countUser }</Typography>
          </Paper>
        </Box>

        <Box sx={{
          width: ((3/12) * 100) + '%',
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2) 
        }}>
          <Paper sx={{
            padding: theme.spacing(2),
            }}>
              <Typography variant='h3'>Jumlah Login</Typography>
            
              <Typography variant='body1' sx={{
                fontSize: 30,
                fontWeight: 800
              }}>{ countLogin }</Typography>
          </Paper>
        </Box>

        <Box sx={{
          width: ((3/12) * 100) + '%',
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2) 
        }}>
          <Paper sx={{
            padding: theme.spacing(2),
          }}>
            <Typography variant='h3'>Jumlah Unit</Typography>
            
            <Typography variant='body1' sx={{
              fontSize: 30,
              fontWeight: 800
            }}>{ countUnit }</Typography>
          </Paper>
        </Box>

        <Box sx={{
          width: ((3/12) * 100) + '%',
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2) 
        }}>
          <Paper sx={{
            padding: theme.spacing(2),
          }}>
            <Typography variant='h3'>Jumlah Jabatan</Typography>
            
            <Typography variant='body1' sx={{
              fontSize: 30,
              fontWeight: 800
            }}>{ countJabatan }</Typography>
          </Paper>
        </Box>
      </Box>

      <Box sx={{
        marginTop: theme.spacing(3)
      }}>
        <Paper sx={{
            padding: theme.spacing(2),
          }}>
          <Box sx={{
            marginBottom: theme.spacing(2)
          }}>
            <Typography variant='h3'>Top 10 Karyawan</Typography>

            <Table sx={{ marginTop: theme.spacing(2)}}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Jumlah Login</TableCell>
                  <TableCell>Terakhir Login</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { topLogin.map( (tl, idx) => {
                  return <TableRow key={`row-idx-${idx}`}>
                    <TableCell>{ (idx + 1) }</TableCell>
                    <TableCell>{ tl.user.name }</TableCell>
                    <TableCell>{ tl.login_count }</TableCell>
                    <TableCell>{ format(new Date(tl.last_login_time), 'yyyy-MM-dd hh:mm:ss') }</TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

IndexAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default IndexAdmin