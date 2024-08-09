import axios from 'axios';
import {NextAuthOptions} from 'next-auth'
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from "next-auth/jwt";

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "email", placeholder: "xyz@abc.com" },
                password: {  label: "Password", type: "password" }
              },


            async authorize(credentials,req){
                if(!credentials?.email||!credentials?.password) return null;
                const {email,password} = credentials;
            
                const res = await axios.post('http://localhost:3001/user/login',credentials);
                    
            
                if(res.status==401){
                    console.log(res.statusText)
                    return null; // Return null when credentials are invalid
                }
                const user = res
                return user
                
            }
           
        })
    ],

}
const handler = NextAuth(authOptions);
export {handler as GET , handler as POST};