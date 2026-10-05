import { createInterface } from 'node:readline/promises';
import { randomBytes,scryptSync } from 'node:crypto';
import { existsSync,readFileSync,writeFileSync } from 'node:fs';
import { Writable } from 'node:stream';
const secretOutput=new Writable({write(_chunk,_encoding,callback){callback();}});
const readline=createInterface({input:process.stdin,output:secretOutput,terminal:true});
process.stdout.write('Mot de passe admin (12 caractères minimum, saisie masquée) : ');
const password=await readline.question('');process.stdout.write('\n');readline.close();
if(password.length<12){console.error('Choisissez au moins 12 caractères.');process.exit(1);}
const salt=randomBytes(16).toString('hex');const hash=scryptSync(password,salt,64).toString('hex');
const existing=existsSync('.env.local')?readFileSync('.env.local','utf8'):'';
const retained=existing.split('\n').filter(line=>!line.startsWith('ADMIN_PASSWORD_HASH=')&&!line.startsWith('ADMIN_SESSION_SECRET=')).join('\n');
writeFileSync('.env.local',`${retained}\nADMIN_PASSWORD_HASH=${salt}:${hash}\nADMIN_SESSION_SECRET=${randomBytes(48).toString('hex')}\n`,{mode:0o600});
console.log('Accès configuré dans .env.local. Redémarrez le serveur. Les sessions précédentes sont invalidées.');
