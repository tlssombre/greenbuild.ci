import Home from '@/components/home';
import { getPublicContent } from '@/lib/db';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export default function Page(){return <Home content={getPublicContent()}/>;}
