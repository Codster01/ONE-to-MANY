"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './style.category.css';
import { Button } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Category } from '../../../backend/src/category/category.schema';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/datatabble';

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const add = () => {
    console.log('Add category');
  };

  const deleteit = async (id: any) => {
    try {
      await axios.delete(`http://localhost:3001/category/api/delete/${id}`);
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
    console.log('Delete category');
  };

  const editit = async (id: any) => {
    console.log('Edit category');
  };

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/category/api/'); // Adjust the endpoint as per your backend route
      setCategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: info => info.getValue(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button onClick={() => deleteit(row.original._id)}>
            <DeleteIcon sx={{ color: 'red' }} />
          </Button>
          <Link href={`/category/edit/${row.original._id}`}>
            <Button>
              <EditIcon sx={{ color: 'blue' }} />
            </Button>
          </Link>
        </div>
      ),
    },
  ];


  return (
    <div className='m-6'>
      <div className='flex justify-between items-center h-16 m-4'>
        <h1 className='text-3xl font-bold text-primary'>Categories</h1>
        <Link href="/category/add">
          <Button className='btn-add text-xs' onClick={add}>+ Add new categories</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={categories} />
    </div>
  );
};

export default CategoryPage;
