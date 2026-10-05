import { NextRequest } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { db,dataDirectory } from '@/lib/db';
import { requireAdmin,errorResponse,HttpError } from '@/lib/security';
export const runtime='nodejs';
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){try{await requireAdmin();const {id}=await params;const row=db().prepare("SELECT resume_file FROM inbox WHERE id=? AND kind='applications'").get(id) as {resume_file:string}|undefined;if(!row?.resume_file)throw new HttpError(404,'CV introuvable.');const bytes=await readFile(path.join(dataDirectory(),'resumes',path.basename(row.resume_file)));return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="CV-${id}.pdf"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox"}});}catch(error){return errorResponse(error);}}
