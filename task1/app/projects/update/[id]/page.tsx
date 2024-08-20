"use client";

import React from 'react';
import { useState, useEffect } from 'react';
// import './style.category.css';
// import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getParticularProject, updateProject } from '@/utils/api';
import axios from 'axios';
import { useSession } from "next-auth/react";
import Layout from '@/components/ui/Layout';

// import { Project } from '../../../../../backend/src/project/project.schema';


function UpdateProject() {
  const params = useParams();
  const id = params.id;

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state

  const router = useRouter();
  const {data:session} = useSession();
  const permissions = session?.user?.permissions.category;
  console.log(permissions);
  const token = session?.user.token;
  const headers = {
    Authorization: `Bearer ${token}`,
};



  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        try {
          if (!token) {
            throw new Error("Token not found");
          }
          const response = await axios.get(`http://localhost:3002/project/${id}`, {headers}); 
          const project = response.data;
          setName(project.name);
        } catch (error) {
          console.error('Error fetching project:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3002/project/${id}`, { name }, {headers});
      // await updateProject(id as string, {name});
      setName('')
      setTimeout(() => {
        setName('');
        toast.success('Project updated successfully!');
        router.push('/projects');
      }, 2000);
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };
  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }


  return (
    <Layout>
    <div>
      <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Edit Category</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
          Update Project
        </button>
      </form>
    </div>
    </div>
    </Layout>
  )
}

export default UpdateProject;












// <Link href={`/category/edit/${category._id}`}>
{/* <Button className="absolute top-0 right-100 mt-2 mr-2 bg-primary ">
<EditIcon sx={{ color: 'white' }} />
</Button>
</Link> */}