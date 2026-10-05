import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ContentKind, ContentRecord, InboxRecord, PublicContent } from './types';
export const dataDirectory = () => path.resolve(process.env.GREENBUILD_DATA_DIR || './data');
let connection: DatabaseSync | undefined;
export function db() {
 if(connection) return connection;
 mkdirSync(dataDirectory(),{recursive:true});
 connection=new DatabaseSync(path.join(dataDirectory(),'greenbuild.sqlite'));
 connection.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS content (id TEXT PRIMARY KEY, kind TEXT NOT NULL, document TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS inbox (id TEXT PRIMARY KEY, kind TEXT NOT NULL, document TEXT NOT NULL, resume_file TEXT);
 CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
 const insert=connection.prepare('INSERT OR IGNORE INTO content (id,kind,document) VALUES (?,?,?)');
 for(const item of [
 {id:'invest-main',kind:'invest',title:'Investir dans un campus. Croire en une génération.',subtitle:'CONSTRUISONS LA SUITE ENSEMBLE',body:'Investisseurs, institutions, banques, collectivités et partenaires : prenons part à une nouvelle vision du logement étudiant en Afrique.',link:'#contact'},
 {id:'contact-main',kind:'contact',title:'Votre prochaine idée peut tout construire.',subtitle:'Présentez-nous votre intérêt pour GreenBuild.',body:'',location:'Côte d’Ivoire'},
 ] as Partial<ContentRecord>[]){const doc={subtitle:'',body:'',image:'',link:'',location:'',contract:'',email:'',phone:'',published:true,sort:0,updatedAt:new Date().toISOString(),...item};insert.run(doc.id!,doc.kind!,JSON.stringify(doc));}
 return connection;
}
export function listContent(kind:ContentKind, publicOnly=false):ContentRecord[]{
 const rows=db().prepare('SELECT document FROM content WHERE kind=?').all(kind) as {document:string}[];
 return rows.map(row=>JSON.parse(row.document) as ContentRecord).filter(row=>!publicOnly||row.published).sort((a,b)=>a.sort-b.sort||b.updatedAt.localeCompare(a.updatedAt));
}
export function getPublicContent():PublicContent{return Object.fromEntries(['invest','news','team','contact','jobs'].map(kind=>[kind,listContent(kind as ContentKind,true)])) as PublicContent;}
export function saveContent(kind:ContentKind, document:ContentRecord){db().prepare('INSERT INTO content (id,kind,document) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET document=excluded.document WHERE content.kind=excluded.kind').run(document.id,kind,JSON.stringify(document));}
export function deleteContent(kind:ContentKind,id:string){db().prepare('DELETE FROM content WHERE kind=? AND id=?').run(kind,id);}
export function listInbox(kind:string):InboxRecord[]{return (db().prepare('SELECT document FROM inbox WHERE kind=?').all(kind) as {document:string}[]).map(row=>JSON.parse(row.document)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function addInbox(data:Omit<InboxRecord,'id'|'createdAt'|'status'>,resumeFile:string|null=null){const entry={...data,id:randomUUID(),createdAt:new Date().toISOString(),status:'new'};db().prepare('INSERT INTO inbox (id,kind,document,resume_file) VALUES (?,?,?,?)').run(entry.id,entry.kind,JSON.stringify(entry),resumeFile);return entry;}
export function limit(key:string,max:number,windowMs:number){const now=Date.now();db().prepare('DELETE FROM rate_limits WHERE expires < ?').run(now);const row=db().prepare('INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').get(key,now+windowMs) as {count:number};return row.count<=max;}
