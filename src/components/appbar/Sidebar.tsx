import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import React from 'react'
import PeopleIcon from '@mui/icons-material/People';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Link from 'next/link';

type Props = {}

const routes = [
  {
    label: 'Dashboard',
  }
];

const Sidebar = (props: Props) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <aside>
      <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <Link href="/admin">Dashboard</Link>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        {/* <ListItemText primary="User" /> */}
        <Link href="/admin/karyawan">Karyawan</Link>
      </ListItemButton>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <FolderSpecialIcon />
        </ListItemIcon>
        <ListItemText primary="Master Data" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <Link href="/admin/master-data/unit">Unit</Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <Link href="/admin/master-data/jabatan">Jabatan</Link>
          </ListItemButton>
        </List>
      </Collapse>
    </List>
    </aside>
  )
}

export default Sidebar