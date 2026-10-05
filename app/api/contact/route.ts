import { NextRequest } from 'next/server';
import { addInbox } from '@/lib/db';
import { checkOrigin,errorResponse,HttpError,jsonBody,text,email,throttle } from '@/lib/security';
export const runtime='nodejs';
export async function POST(request:NextRequest){try{checkOrigin(request);throttle(request,'contact',5);const data=await jsonBody(request,12000);if(data.website)throw new HttpError(400,'Demande invalide.');if(data.consent!==true)throw new HttpError(400,'Votre accord est nécessaire pour traiter la demande.');addInbox({kind:'messages',name:text(data.name,'Le nom',120,true),email:email(data.email),phone:text(data.phone,'Le téléphone',80),message:text(data.message,'Le message',5000,true),interest:text(data.interest,'Le profil',100,true),jobId:'',jobTitle:'',resumeName:''});return Response.json({ok:true,message:'Votre message a bien été enregistré. Merci pour votre intérêt.'},{status:201});}catch(error){return errorResponse(error);}}
