"use client";

import React from "react";
import { useState, useEffect } from "react";
import { getProjects } from "@/utils/api";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import { Project } from "../../../backend/src/project/project.schema";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteProject } from "../../utils/api";

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  const handleDelete = async(id: any) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter(project => project._id !== id))

    }catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div>

    {projects.length !== 0 ? (
      <div className="mt-10 container mx-auto p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 ease-in-out">
        <div className="flex justify-between items-center h-16 m-4">
          <h1 className="text-3xl font-bold text-primary">PROJECTS</h1>
          <Link href="/projects/create">
            <Button className="btn-add p-3 bg-primary text-blue-100">+ Add new PROJECTS</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
          {projects.map((project) => (
            <div key={project.id} className="m-3 relative card bg-slate-100 shadow-md rounded-lg p-4 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <Button className="absolute top-0 right-0 mt-3 mr-3 ">
                <DeleteIcon sx={{ color: 'red' }} />
              </Button>
              <h2 className="font-semibold text-blue-500 text-2xl p-6">{project.name}</h2>
              {/* <p className= " absolute bottom-0 left-0 mb-2 ml-2 text-blue-900 bg-blue-300 w-2/6 border rounded-lg p-1">Ongoing</p> */}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="mt-10 container mx-auto p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 ease-in-out">
          <h1 font-semibold text-blue-500 text-2xl p-6>No Projects added in the database!</h1>
      </div>
    )}
  </div>
  );
};

export default ProjectList;

