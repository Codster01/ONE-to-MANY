"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios';
import { useSession } from "next-auth/react";


const editProductPage = () => {
    const params = useParams();
    const id = params.id;
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [actualPrice, setActualPrice] = useState('');
    const [tags, setTags] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const { data: session } = useSession();
    const permissions = session?.user?.permissions;
    const token = session?.user.token;
    const headers = {
            Authorization: `Bearer ${token}`,
    };


    const fetchSingleProduct = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3002/product/api/get/${id}`, {headers});
            const product = response.data;
            console.log(product)
            setName(product.name);
            setCategory(product.category);
            setDescription(product.description);
            setSellingPrice(product.sellingPrice);
            setActualPrice(product.actualPrice);
            setTags(product.tags);
            setBannerImage(product.bannerImage);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchSingleProduct(id);
    }, [])

    const updateData = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('sellingPrice', sellingPrice);
        formData.append('actualPrice', actualPrice);
        formData.append('tags', tags);
        formData.append('bannerImage', bannerImage);
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:3002/product/api/update/${id}`, formData, {headers});
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    console.log(params);


    return (
        <div className='container mx-auto p-6'>
            <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
            <form className="space-y-4">
                <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        id="category"
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">Selling Price</label>
                    <input type="text" id="sellingPrice" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="actualPrice" className="block text-sm font-medium text-gray-700">Actual Price</label>
                    <input type="text" id="actualPrice" value={actualPrice} onChange={(e) => setActualPrice(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700">Banner Image</label>
                    <input type="file" id="bannerImage" onChange={(e) => setBannerImage(e.target.files[0])}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <button type="submit" onClick={updateData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Submit</button>
            </form>
        </div>
    )
}

export default editProductPage;