import { NextRequest, NextResponse } from 'next/server';
import { checkOrigin, checkPassword, configured, createSession, errorResponse, HttpError, jsonBody, sessionCookie, throttle, text } from '@/lib/security';
export const runtime='nodejs';
export async function POST(request:NextRequest){try{checkOrigin(request);if(!configured())throw new HttpError(503,'L’accès administrateur doit être configuré sur le serveur.');throttle(request,'login',5);const data=await jsonBody(request,2000);const password=text(data.password,'Le mot de passe',500,true);if(!checkPassword(password))throw new HttpError(401,'Identifiants incorrects.');const response=NextResponse.json({ok:true});response.cookies.set({...sessionCookie,value:createSession()});return response;}catch(error){return errorResponse(error);}}
