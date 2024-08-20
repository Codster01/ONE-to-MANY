"use client";

import React from "react";
import { useState, useEffect } from "react";
import { deleteTask, getTasks, updateTask } from "@/utils/api";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TableClassKey,
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteProject } from "../../utils/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/datatabble";
import { useSession } from "next-auth/react";
import Layout from "@/components/ui/Layout";
import io from "socket.io-client";
import Toast from "@/components/ui/Toast";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    show: false,
  });

  const router = useRouter();
  const { data: session } = useSession();
  const permissions = session?.user?.permissions.tasks;
  console.log(permissions);
  const token = session?.user.token;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:3002/tasks", {
        headers,
      });
      setTasks(data);
      console.log(tasks);
    } catch (error) {
      console.error("Error Fetching Tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [token]);

  const showToast = (message, type) => {
    setToast({ message, type, show: true });
  };

  useEffect(() => {
    const socket = io("http://localhost:3002"); // Replace with your server URL
    socket.on("taskAssigned", (newTask) => {
      console.log('This is the new task assigned');
      setTasks((prevTasks) => [...prevTasks, newTask]);
      showToast(`New task assigned: ${newTask.title}`, "success");
    });

    // socket.on('taskUpdated', (updatedTask) => {
    //   setTasks((prevTasks) =>
    //     prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    //   );
    //   showToast(`Task updated: ${updatedTask.title}`, 'info');
    // });

    // socket.on('taskDeleted', (deletedTaskId) => {
    //   setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTaskId));
    //   showToast('Task deleted', 'warning');
    // });



    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`http://localhost:3002/tasks/${id}`, { headers });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewDetails = async (id: any) => {
    router.push(`/tasks/view/${id}`);
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Task title",
      cell: ({ row }) => (
        <div>
          <a
            onClick={() => handleViewDetails(row.original._id)}
            style={{ cursor: "pointer" }}
          >
            {row.original.title}
          </a>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {permissions?.DELETE && (
            <Button onClick={() => handleDelete(row.original._id)}>
              <DeleteIcon sx={{ color: "red" }} />
            </Button>
          )}
          {permissions?.UPDATE && (
            <Link href={`/tasks/update/${row.original._id}`}>
              <Button>
                <EditIcon sx={{ color: "blue" }} />
              </Button>
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="m-6">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-primary">Tasks</h1>
          {permissions?.CREATE && (
            <Link href={`/tasks/create`}>
              <Button className="btn-add text-xs bg-primary text-blue-100 hover:text-black py-2 px-2">
                + Add new Tasks
              </Button>
            </Link>
          )}

          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          )}
        </div>
        <DataTable columns={columns} data={tasks} />
      </div>
    </Layout>
  );
}

export default TaskList;
