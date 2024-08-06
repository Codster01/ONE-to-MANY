"use client"
// pages/products/index.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import './style.category.css'
import { Button } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../../../backend/src/category/category.schema';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/datatabble';


const CategoryPage = () => {
  const [products, setProducts] = useState<Category[]>([]);
  const router = useRouter()
  const add = () => {

    console.log('Add Product');
  }

  // Fetch products from the backend
  const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/product/api/'); // Adjust the endpoint as per your backend route
        setProducts(response.data);
        
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    useEffect(() => {

    fetchProducts();
  }, []);

  const deleteit = async (id:any) =>{
    console.log(id)
    try {

      await axios.delete(`http://localhost:3001/product/api/delete/${id}`);
      fetchProducts();
      toast.success('Product deleted successfully')
    } catch (error) {
      console.log(error);
      toast.error('Error deleting product')
    }
    console.log('Delete product');
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'imageUrl',
      header: () => (
        <div className='font-bold text-lg'>
          Image
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center w-16 h-16">
          <img src={`http://localhost:3001/${row.original.bannerImage}`} alt={row.original.category} className="w-full h-full object-cover rounded-md" />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: () => (
        <div className='font-bold text-lg'>
          Product
        </div>
      ),
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'category',
      header: () => (
        <div className='font-bold text-lg'>
          Category
        </div>
      ),
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'description',
      header: () => (
        <div className='font-bold text-lg'>
          Description
        </div>
      ),
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'actions',
      header: () => (
        <div className='font-bold text-lg'>
          Actions
        </div>
      ),
      cell: ({ row }) => (
        <div>
          <Button onClick={() => deleteit(row.original._id)}>
            <DeleteIcon sx={{ color: 'red' }} />
          </Button>
        </div>
      ),
    }
  ];
  
  return (


      <div className='m-6'>
        <div className='flex justify-between items-center mt-3 mb-10'>
          <h1 className='text-2xl text-center text-primary font-bold '>Products</h1>
          <Link href="/products/add"><Button className='btn-add text-xs bg-primary text-white border rounded-lg' onClick={add}>+ Add Product</Button></Link>
        </div>
        <DataTable columns={columns} data={products} />
      </div>

  );
};

export default CategoryPage;
