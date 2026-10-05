import { NextRequest, NextResponse } from 'next/server';
import { checkOrigin,errorResponse,sessionCookie } from '@/lib/security';
export async function POST(request:NextRequest){try{checkOrigin(request);const response=NextResponse.json({ok:true});response.cookies.set({...sessionCookie,value:'',maxAge:0});return response;}catch(error){return errorResponse(error);}}
