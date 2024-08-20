"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import SignInButton from './SignInButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Bell } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from "socket.io-client";
export default function Navbar() {
  const { data: session } = useSession();
  const userRole = session?.user.role;
  const Cpermissions = session?.user?.permissions.category;
  const Ppermissions = session?.user?.permissions.products;
  const Propermissions = session?.user?.permissions.projects;
  const Taskpermissions = session?.user?.permissions.tasks;
  const [unreadCount, setUnreadCount] = useState(0);


  const category = () => console.log("Category clicked");
  const products = () => console.log("Products clicked");
  const projects = () => console.log("Projects clicked");
  // const tasks = () => console.log("Tasks clicked");
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    show: false,
  });
  const showToast = (message, type) => {
    setToast({ message, type, show: true });
  };

  useEffect(() => {
    if (session?.user?.token) {
      fetchUnreadCount();
    }
  }, [session]);


  useEffect(() => {
    const socket = io("http://localhost:3002", {
      query: { userId: "yourUserId" } // Replace with the actual user ID
    });
  
    socket.on("connect", () => {
      console.log("Socket connected:", socket.connected); // Should log true
    });
  
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  
    socket.on("taskAssigned", (data) => {
      console.log("New task assigned:", data);
      showToast("New task assigned success", 'success');
    });
  
    socket.on("unreadCount", (count) => {
      console.log("Unread count:", count);
      // Update your state or UI with the new unread count
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  const fetchUnreadCount = useCallback(async () => {
    if (session?.user?.token) {
      try {
        const response = await axios.get('http://localhost:3002/notifications/unread-count', {
          headers: { Authorization: `Bearer ${session.user.token}` },
        });
        if (typeof response.data === 'number') {
          setUnreadCount(response.data);
        } else {
          console.error('Unexpected response format for unread count:', response.data);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    }
  }, [session]);
  // Add this to the Navbar component
  useEffect(() => {
    const handleRefreshUnreadCount = () => fetchUnreadCount();
    window.addEventListener('refreshUnreadCount', handleRefreshUnreadCount);
    return () => {
      window.removeEventListener('refreshUnreadCount', handleRefreshUnreadCount);
  };
}, [fetchUnreadCount]);

  return (
    <div className="fixed w-45 h-full bg-gray-100 flex flex-col">
      {/* Sidebar Section */}
      <aside className="w-[250px] fixed top-0 h-full bg-blue-950 text-white flex flex-col p-4">
        <div className="text-1xl text-blue-100 bg-blue-950 p-4 mb-5 border rounded-lg">
          Pre Dev Task
        </div>

        <div className="btn-class text-primary flex flex-col space-y-2 flex-grow">
        <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-white" >Home</Button>
            </Link>
          {Cpermissions?.READ && (
            <Link href="/category">
              <Button variant="ghost" className="w-full justify-start text-white" onClick={category}>Category</Button>
            </Link>
          )}
          {Ppermissions?.READ && (
            <Link href="/products">
              <Button variant="ghost" className="w-full justify-start text-white" onClick={products}>Products</Button>
            </Link>
          )}
          {Propermissions?.READ && (
            <Link href="/projects">
              <Button variant="ghost" className="w-full justify-start text-white" onClick={projects}>Projects</Button>
            </Link>
          )}
          {Taskpermissions?.READ && (
            <Link href="/tasks">
              <Button variant="ghost" className="w-full justify-start text-white" onClick={tasks}>Tasks</Button>
            </Link>
          )}
          {userRole === 'admin' && (
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start text-white">Users</Button>
            </Link>
          )}
        </div>
        <div className="flex flex-row justify-around ">
          <div className="div">

          <Link href="/notifications">
          <Button variant="ghost" className="p-2 relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </Button>
          </Link>
            </div>
                <div className="flex flex-row pt-1.5 p-1 rounded-md  hover:bg-white hover:text-blue-500 ">
          <SignInButton />
            </div>
        </div>
      </aside>
    </div>
  );
}


