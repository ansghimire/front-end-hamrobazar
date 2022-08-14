import React, { useState, useEffect } from 'react'
import { Typography, Stack, Paper, Button } from '@mui/material'
import axios from 'axios'
import {Link } from 'react-router-dom'


const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000//users/')
      .then(response => {
        console.log(response.data)
        setUsers(response.data)

      }).catch(error => {
        console.log(error.message)
      })

  }, [])

  if (!users) return "Loading...."



  return (
    <div>
      <Typography variant="h3"> List of all users</Typography>

      <Stack spacing={4} sx={{mt:3}}>
      {
        users.map((item, index) => (
          <Paper key={index} sx={{padding: " 1rem .7rem"}}>
            <div className="flex space-x-10">
  
            <Typography variant="h5" color="primary">Name:{item.profile.name}</Typography>   
            <Typography variant="h5" color="primary">Email:{item.profile.email}</Typography>
            <Typography variant="h5" color="primary">Mobile:{item.profile.mobile?item.profile.mobile : 'Not given'}</Typography>

            <Link to={`../users/${item.profile.id}`}>
            <Button variant="contained">Show Product</Button>
            </Link>  
          
            </div>   
          </Paper>
         
        ))

      }
     </Stack>

    </div>
  )
}

export default Users