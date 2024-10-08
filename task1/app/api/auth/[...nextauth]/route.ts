import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await axios.post('http://localhost:3002/user/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const { userId, name, userRole, token, permissions } = res.data;
                    return { userId, name, role: userRole, token, permissions };
                } catch (error) {
                    console.error('Login failed:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.userId;
                token.name = user.name;
                token.role = user.role;
                token.accessToken = user.token;
                token.permissions = user.permissions;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.userId,
                name: token.name,
                role: token.role,
                token: token.accessToken,
                permissions: token.permissions
            } as any; // Type assertion to avoid TypeScript errors
            session.accessToken = token.accessToken as string;
            return session;
        }
    },
    secret: 'SAHIL2102',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };