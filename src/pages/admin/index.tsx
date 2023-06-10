import { useSession } from 'next-auth/react'
import React from 'react'
import { NextPageWithLayout } from '../_app';
import AdminLayout from '../_layout/Admin';

type Props = {}

const IndexAdmin: NextPageWithLayout = (props: Props) => {
  const {data: session, status} = useSession();

  // if( status !== 'authenticated') {
  //   alert("Djancoeg!");
  // }

  console.log(session, status);
  return (
    <div>IndexAdmin</div>
  )
}

IndexAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default IndexAdmin