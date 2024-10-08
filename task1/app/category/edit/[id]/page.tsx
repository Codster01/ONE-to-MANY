"use client";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Layout from '@/components/ui/Layout';



const EditCategory = () => {
  const params = useParams();
  const id = params.id;
  const {data:session} = useSession();
  const permissions = session?.user?.permissions.category;
  console.log(permissions);
  const token = session?.user.token;
  const headers = {
    Authorization: `Bearer ${token}`,
};
  

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:3002/category/api/${id}`, {headers});
          const category = response.data;
          setName(category.name);
          setDescription(category.description);
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/category/api/update/${id}`, {
        name,
        description,
      } , {headers});
      window.location.href = '/category'
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <Layout>
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
        <div className="form-group mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
          Update Category
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default EditCategory;
