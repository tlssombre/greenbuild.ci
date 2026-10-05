import { NextRequest } from 'next/server';
import { db,listInbox,dataDirectory } from '@/lib/db';
import { checkOrigin,requireAdmin,errorResponse,HttpError,jsonBody,text } from '@/lib/security';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
export const runtime='nodejs';
type Context={params:Promise<{kind:string}>};
async function inboxKind(context:Context){const {kind}=await context.params;if(!['messages','applications'].includes(kind))throw new HttpError(404,'Rubrique inconnue.');return kind;}
export async function GET(_request:NextRequest,context:Context){try{await requireAdmin();return Response.json(listInbox(await inboxKind(context)),{headers:{'Cache-Control':'no-store'}});}catch(error){return errorResponse(error);}}
export async function POST(request:NextRequest,context:Context){try{checkOrigin(request);await requireAdmin();const kind=await inboxKind(context);const data=await jsonBody(request,1000);if(!['new','reviewed','shortlisted','archived'].includes(data.status))throw new HttpError(400,'Statut invalide.');const record=listInbox(kind).find(x=>x.id===data.id);if(!record)throw new HttpError(404,'Demande introuvable.');record.status=data.status;db().prepare('UPDATE inbox SET document=? WHERE id=? AND kind=?').run(JSON.stringify(record),record.id,kind);return Response.json(record);}catch(error){return errorResponse(error);}}
export async function DELETE(request:NextRequest,context:Context){try{checkOrigin(request);await requireAdmin();const kind=await inboxKind(context);const data=await jsonBody(request,1000);const id=text(data.id,'Identifiant',80,true);const record=db().prepare('SELECT resume_file FROM inbox WHERE id=? AND kind=?').get(id,kind) as {resume_file:string|null}|undefined;db().prepare('DELETE FROM inbox WHERE id=? AND kind=?').run(id,kind);if(record?.resume_file)await unlink(path.join(dataDirectory(),'resumes',path.basename(record.resume_file))).catch(()=>{});return Response.json({ok:true});}catch(error){return errorResponse(error);}}
