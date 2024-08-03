"use client";
import React from 'react'
import { useEffect, useState } from 'react';
import { getProjects } from "../../utils/api";
import { List, ListItem, ListItemText } from '@mui/material';
import { Project } from "../../../backend/src/project/project.shcema";

const ProjectList = () => {

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(()=> {
    const fetchProjects = async() => {
      const data = await getProjects();
      setProjects(data);
    }

    fetchProjects();
  }, []);
  return (
    <div>
      {projects.length === 0?
      <h1>No Projects Added Yet</h1> : 
      <List>
      {projects.map((project) => (
        <ListItem>
          <ListItemText primary={project.name} />
        </ListItem>
      ))}
    </List>
      }
    </div>
  )
}

export default ProjectList;
