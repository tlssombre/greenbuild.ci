import type { Metadata } from 'next';
import { configured,isAdmin } from '@/lib/security';
import Admin from '@/components/admin';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const metadata:Metadata={title:'Administration — GreenBuild',robots:{index:false,follow:false}};
export default async function Page(){return <Admin authenticated={await isAdmin()} configured={configured()}/>;}
