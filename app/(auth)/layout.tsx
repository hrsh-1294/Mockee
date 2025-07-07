import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const Authlayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated(); // Replace with actual authentication logic
  // If the user is authenticated, redirect to the home page
  // This is a server-side check, so it will run before rendering the page
  if (isUserAuthenticated) redirect('/');
  return (
    <div className="auth-layout">{children}</div>
  )
}

export default Authlayout