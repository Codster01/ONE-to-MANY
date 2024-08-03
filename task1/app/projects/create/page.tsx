
"use client";
import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react'
import {createProject} from "../../../utils/api";
import { redirect } from 'next/navigation'
// import {useNavigate} from "react-router-dom";
function CreateProject() {

    const [name, setName] = useState('');

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        await createProject({name});
        setName('')
        setTimeout(()=>{
            redirect('/projects')
        }, 2000);
    }


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
        <TextField 
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
        />
        

        <Button type='submit' variant="contained" color="primary" sx={{mt: 2}}>
            Create Project
        </Button>
    </Box>
  )
}

export default CreateProject;
