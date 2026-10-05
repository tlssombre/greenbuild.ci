// Integration test against the production server and an isolated temporary database.
import assert from 'node:assert/strict';
import { mkdtemp,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes,scryptSync } from 'node:crypto';
const directory=await mkdtemp(path.join(tmpdir(),'greenbuild-test-'));
const password=randomBytes(24).toString('hex'),salt=randomBytes(16).toString('hex');
const base='http://127.0.0.1:3197';let child;let logs='';let cookie='';
async function start(){child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3197','-H','127.0.0.1'],{env:{...process.env,GREENBUILD_DATA_DIR:directory,SITE_URL:base,ADMIN_PASSWORD_HASH:`${salt}:${scryptSync(password,salt,64).toString('hex')}`,ADMIN_SESSION_SECRET:randomBytes(48).toString('hex')},stdio:['ignore','pipe','pipe']});child.stdout.on('data',chunk=>{logs+=chunk;});child.stderr.on('data',chunk=>{logs+=chunk;});for(let i=0;i<100;i++){try{if((await fetch(base+'/admin')).ok)return;}catch{}if(child.exitCode!==null)throw new Error(logs);await new Promise(resolve=>setTimeout(resolve,100));}throw new Error('Server did not start');}
async function stop(){if(child&&child.exitCode===null){const exited=new Promise(resolve=>child.once('exit',resolve));child.kill('SIGTERM');await exited;}}
async function json(route,method='GET',data,auth=false,origin=base){return fetch(base+route,{method,headers:{Origin:origin,...(data?{'Content-Type':'application/json'}:{}),...(auth?{Cookie:cookie}:{})},body:data?JSON.stringify(data):undefined});}
try{
 await start();
 assert.equal((await json('/api/admin/content/jobs')).status,401,'unauthorized content must be rejected');
 assert.equal((await json('/api/admin/login','POST',{password},false,'https://wrong.example')).status,403,'cross-origin login must fail');
 assert.equal((await json('/api/admin/login','POST',{password:'incorrect'})).status,401);
 const login=await json('/api/admin/login','POST',{password});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];
 const draftResponse=await json('/api/admin/content/jobs','POST',{title:'Draft role',body:'Hidden',published:false},true);assert.equal(draftResponse.status,200);const draft=await draftResponse.json();
 const jobResponse=await json('/api/admin/content/jobs','POST',{title:'Test campus coordinator',body:'Support the campus project.',location:'Man',contract:'CDD',published:true},true);assert.equal(jobResponse.status,200);const job=await jobResponse.json();
 const page=await (await fetch(base)).text();assert(page.includes(job.title));assert(!page.includes(draft.title));assert(page.includes('Maquette exploratoire'));assert(!page.includes('Préparer mon message'));
 for(const [kind,title]of [['news','Project update'],['team','Test colleague'],['invest','Invest test'],['contact','Contact test']]){const response=await json(`/api/admin/content/${kind}`,'POST',{title,body:'Verified content',published:true},true);assert.equal(response.status,200,kind);}
 const contact=await json('/api/contact','POST',{name:'Test Visitor',email:'test@example.com',interest:'partenaire',message:'Hello GreenBuild',consent:true});assert.equal(contact.status,201);
 const missingConsent=await json('/api/contact','POST',{name:'Test',email:'test@example.com',message:'Hello'});assert.equal(missingConsent.status,400);
 const pdf=new TextEncoder().encode('%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\n%%EOF');
 function application(jobId=job.id,file=pdf,filename='cv.pdf'){const data=new FormData();for(const [key,value]of Object.entries({name:'Candidate Test',email:'candidate@example.com',phone:'0102030405',message:'My motivation',jobId,consent:'on'}))data.set(key,value);data.set('cv',new File([file],filename,{type:'application/pdf'}));return data;}
 assert.equal((await fetch(base+'/api/applications',{method:'POST',headers:{Origin:base},body:application(draft.id)})).status,404);
 assert.equal((await fetch(base+'/api/applications',{method:'POST',headers:{Origin:base},body:application(job.id,new TextEncoder().encode('not a pdf'))})).status,400);
 const submitted=await fetch(base+'/api/applications',{method:'POST',headers:{Origin:base},body:application()});assert.equal(submitted.status,201,await submitted.text());
 const applications=await (await json('/api/admin/inbox/applications','GET',undefined,true)).json();assert.equal(applications.length,1);const id=applications[0].id;
 assert.equal((await fetch(base+`/api/admin/resumes/${id}`)).status,401);
 const cv=await fetch(base+`/api/admin/resumes/${id}`,{headers:{Cookie:cookie}});assert.equal(cv.status,200);assert(cv.headers.get('content-disposition').startsWith('attachment'));assert.deepEqual(new Uint8Array(await cv.arrayBuffer()),pdf);
 const updated=await json('/api/admin/inbox/applications','POST',{id,status:'shortlisted'},true);assert.equal(updated.status,200);
 assert.equal((await json('/api/admin/content/jobs','DELETE',{id:job.id},true,'https://wrong.example')).status,403);
 await stop();await start();
 const relogin=await json('/api/admin/login','POST',{password});cookie=relogin.headers.get('set-cookie').split(';')[0];
 const persisted=await (await json('/api/admin/inbox/applications','GET',undefined,true)).json();assert.equal(persisted[0].status,'shortlisted','application survives restart');
 assert.equal((await (await json('/api/admin/inbox/messages','GET',undefined,true)).json()).length,1);
 assert.equal((await json('/api/admin/content/jobs','DELETE',{id:job.id},true)).status,200);
 assert.equal((await json('/api/admin/inbox/applications','DELETE',{id},true)).status,200);
 assert.equal((await fetch(base+`/api/admin/resumes/${id}`,{headers:{Cookie:cookie}})).status,404);
 assert.equal((await json('/api/admin/logout','POST',{},true)).status,200);
 console.log('PASS: auth, origin checks, content CRUD, draft visibility, contact, PDF validation, private download, application status, restart persistence and deletion.');
}catch(error){console.error(error);console.error(logs.slice(-3000));process.exitCode=1;}finally{await stop();await rm(directory,{recursive:true,force:true});}
