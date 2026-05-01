import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
  return (
    <div className='flex justify-between items-center p-4 shadow bg-[#07111f] border-b border-slate-800'>
      <SidebarTrigger/>
      <UserButton/>
      </div>
  )
}

export default AppHeader