import 'server-only';
import { cookies } from 'next/headers';
import { createHash, createHmac, timingSafeEqual, scryptSync } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { limit } from './db';
const cookieName='greenbuild_admin';
export class HttpError extends Error {constructor(public status:number,message:string){super(message);}}
export function configured(){return !!process.env.ADMIN_PASSWORD_HASH && !!process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length>=32;}
export function checkPassword(password:string){try{const [salt,hash]=process.env.ADMIN_PASSWORD_HASH!.split(':');const expected=Buffer.from(hash,'hex');const actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual);}catch{return false;}}
function sign(value:string){return createHmac('sha256',process.env.ADMIN_SESSION_SECRET!).update(value).digest('hex');}
export function createSession(){const value=String(Date.now()+8*60*60*1000);return `${value}.${sign(value)}`;}
export async function isAdmin(){if(!configured())return false;const token=(await cookies()).get(cookieName)?.value;if(!token)return false;const [expires,signature]=token.split('.');if(!expires||!signature||Number(expires)<=Date.now())return false;const expected=Buffer.from(sign(expires));const actual=Buffer.from(signature);return actual.length===expected.length&&timingSafeEqual(actual,expected);}
export async function requireAdmin(){if(!await isAdmin())throw new HttpError(401,'Connectez-vous à l’administration.');}
export function checkOrigin(request:NextRequest){const expected=process.env.SITE_URL?new URL(process.env.SITE_URL).origin:request.nextUrl.origin;if(request.headers.get('origin')!==expected)throw new HttpError(403,'Origine de la demande invalide.');}
export function throttle(request:NextRequest,scope:string,max=8){const identity=createHash('sha256').update(request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown').digest('hex');if(!limit(`${scope}:${identity}`,max,15*60*1000)||!limit(`${scope}:global`,Math.max(30,max*20),15*60*1000))throw new HttpError(429,'Trop de demandes. Réessayez dans quinze minutes.');}
export function text(value:unknown,label:string,max=5000,required=false){if(typeof value!=='string')value='';const result=(value as string).trim();if(required&&!result)throw new HttpError(400,`${label} est obligatoire.`);if(result.length>max)throw new HttpError(400,`${label} est trop long.`);return result;}
export function email(value:unknown){const result=text(value,'L’e-mail',254,true);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result))throw new HttpError(400,'Adresse e-mail invalide.');return result;}
export function safeUrl(value:unknown){const result=text(value,'Le lien',2000);if(!result)return '';if(result.startsWith('/')&&!result.startsWith('//')&&!result.includes('\\'))return result;if(result.startsWith('#'))return result;try{if(new URL(result).protocol==='https:')return result;}catch{}throw new HttpError(400,'Utilisez une URL HTTPS ou un chemin du site.');}
export function errorResponse(error:unknown){if(error instanceof HttpError)return Response.json({error:error.message},{status:error.status});console.error('GreenBuild request failed',error instanceof Error?error.message:'Unknown error');return Response.json({error:'La demande n’a pas pu être enregistrée. Réessayez.'},{status:500});}
export async function limitedBody(request:NextRequest,max:number){const reader=request.body?.getReader();if(!reader)return new Uint8Array();const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new HttpError(413,'Demande trop volumineuse.');}chunks.push(value);}const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;}
export async function jsonBody(request:NextRequest,max=30000){try{const raw=new TextDecoder().decode(await limitedBody(request,max));const data=JSON.parse(raw);if(!data||typeof data!=='object'||Array.isArray(data))throw new Error();return data;}catch(error){if(error instanceof HttpError)throw error;throw new HttpError(400,'Données invalides.');}}

export const sessionCookie={name:cookieName,httpOnly:true,sameSite:'strict' as const,secure:process.env.NODE_ENV==='production',path:'/',maxAge:8*60*60};
