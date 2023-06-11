import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin');
  }, [])
  

  return (
    <main style={{ height: 'calc(100vh)'}}>
    Redirecting...
    </main>
  )
}
