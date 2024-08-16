
"use client";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useSession } from 'next-auth/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Link from 'next/link';
import SignInButton from './SignInButton';

export default function ButtonAppBar() {
  
  const {data:session} = useSession();
  const userRole = session?.user.role;
  const Cpermissions = session?.user?.permissions.category;
  const Ppermissions = session?.user?.permissions.products;
  const Propermissions = session?.user?.permissions.projects;
  const Taskpermissions = session?.user?.permissions.tasks;
  const category = () => {
    console.log("Hello");
  };
  const products = () => {
    console.log("Products clicked");
  };
  const projects = () => {
    console.log("Projects clicked");
  };
  const tasks = () => {
    console.log("Tasks clicked");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Sheet>
            <SheetTrigger asChild>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className='text-3xl text-blue-100 bg-blue-950 p-4 mb-5 border rounded-lg'>Features</SheetTitle>
                <SheetDescription>
                  <div className="btn-class text-primary">
                    {Cpermissions?.READ&&
                    <SheetClose asChild>
                      <Link href="/category">
                        <Button className='mt-3 mb-1 ml-5 text-blue-950 font-semibold text-lg' onClick={category}>Category</Button>
                      </Link>
                    </SheetClose>
                    }
                    {Ppermissions?.READ&&

                      <SheetClose asChild>
                      <Link href="/products">
                        <Button className='mb-1 ml-5 text-blue-950 font-semibold text-lg' onClick={products}>Products</Button>
                      </Link>
                    </SheetClose>
                    }
                    {Propermissions?.READ&&
                    <SheetClose asChild>
                      <Link href="/projects">
                        <Button className='mb-1 ml-5 text-blue-950 font-semibold text-lg' onClick={projects}>Projects</Button>
                      </Link>
                    </SheetClose>
}
              {Taskpermissions?.READ&&
                    <SheetClose asChild>
                      <Link href="/tasks">
                        <Button className='mb-1 text-blue-950 font-semibold text-lg' onClick={tasks}>Tasks</Button>
                      </Link>
                    </SheetClose>
}
                   
            {userRole==='admin'&&(
                      <SheetClose asChild>
                      <Link href="/admin">
                        <Button className='mb-1 text-blue-950 font-semibold text-lg' onClick={tasks}>Users</Button>
                      </Link>
                    </SheetClose>
                      )}
            
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              Practise Project Application
            </Link>
          </Typography>
          <SignInButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
