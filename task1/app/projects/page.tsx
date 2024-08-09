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
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/datatabble";

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
  
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey:'name',
      header:'Project name',
      cell : info => info.getValue()
    },
    {
      id:'delete',
      header:'Delete',
      cell: ({row}) => (
        <div>
          <Button onClick={() => handleDelete(row.original._id)}>
                <DeleteIcon sx={{ color: 'red' }} />
              </Button>
        </div>
      )
    }
  ] 
  return (

    <div className="m-6">
    <div className="flex justify-between items-center h-16 mb-5">
          <h1 className="text-2xl font-bold text-primary">PROJECTS</h1>
          <Link href="/projects/create">
            <Button className="btn-add text-xs bg-primary text-blue-100">+ Add new PROJECTS</Button>
          </Link>
        </div>
        <DataTable columns={columns}  data={projects} />
    </div>
  );
};

export default ProjectList;

