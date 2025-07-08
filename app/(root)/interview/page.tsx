import Agent from '@/app/components/Agent'
import React from 'react'

const page = () => {
  return (
    <>
        <h3>Interview Genreration</h3>

        <Agent userName="You" userId="user1" type="generate"/>
    </>
  )
}

export default page