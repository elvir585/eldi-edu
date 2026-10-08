'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const profiles=require('../renderer/profile.js');
const MAX_BYTES=120*1024*1024;
const BACKUP=/^ELDI-backup-\d{8}T\d{9}Z-[a-f0-9]{8}\.json$/;
function normalizeStore(value){
  if(!value||typeof value!=='object'||!Array.isArray(value.profiles)||!value.profiles.length||value.profiles.length>200)throw Error('Sigurnosna kopija mora imati 1–200 profila.');
  if(Buffer.byteLength(JSON.stringify(value),'utf8')>MAX_BYTES)throw Error('Sigurnosna kopija smije imati do 120 MB.');
  const ids=new Set();
  const cleaned=value.profiles.map(profile=>{
    if(typeof profile.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(profile.id)||ids.has(profile.id))throw Error('Oznake profila nisu ispravne ili su ponovljene.');
    ids.add(profile.id);return {...profiles.validateProfile(profile),id:profile.id};
  });
  return {profiles:cleaned,active:ids.has(value.active)?value.active:cleaned[0].id};
}
function compareVersion(a,b){
  const parse=value=>{const match=/^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(value));return match?match.slice(1).map(Number):null;};
  const x=parse(a),y=parse(b);if(!x||!y)return null;
  for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;return 0;
}
function releaseURL(value){try{const url=new URL(value);return url.protocol==='https:'&&url.hostname==='github.com'&&!url.username&&!url.password&&/^\/elvir585\/eldi-edu\/releases\/(?:tag\/v\d+\.\d+\.\d+|download\/v\d+\.\d+\.\d+\/[A-Za-z0-9_.-]+)$/.test(url.pathname)&&!url.search&&!url.hash?url.href:null;}catch{return null;}}
function createMaintenance({directory,version,fetchImpl=globalThis.fetch,now=()=>new Date()}){
  let queue=Promise.resolve(),lastHash=null;
  async function list(){await fs.mkdir(directory,{recursive:true});const names=(await fs.readdir(directory)).filter(name=>BACKUP.test(name)).sort().reverse();return Promise.all(names.map(async name=>{const stat=await fs.stat(path.join(directory,name));return {id:name,createdAt:stat.mtime.toISOString(),bytes:stat.size};}));}
  function backup(value,{force=false}={}){
    const cleaned=normalizeStore(value),data=JSON.stringify({app:'ELDI EDU',kind:'local-backup',schema:1,version,createdAt:now().toISOString(),store:cleaned});
    const hash=crypto.createHash('sha256').update(JSON.stringify(cleaned)).digest('hex');
    queue=queue.catch(()=>{}).then(async()=>{
      if(!force&&hash===lastHash)return {saved:false,unchanged:true};
      await fs.mkdir(directory,{recursive:true});
      const date=now().toISOString().replace(/[-:.]/g,'');
      const id='ELDI-backup-'+date+'-'+crypto.randomBytes(4).toString('hex')+'.json',target=path.join(directory,id),temporary=target+'.tmp';
      try{await fs.writeFile(temporary,data,{encoding:'utf8',mode:0o600});await fs.rename(temporary,target);}catch(error){await fs.rm(temporary,{force:true}).catch(()=>{});throw error;}
      lastHash=hash;
      const rows=await list();for(const old of rows.slice(5))await fs.unlink(path.join(directory,old.id));
      return {saved:true,id,profiles:cleaned.profiles.length};
    });return queue;
  }
  async function read(id){if(typeof id!=='string'||!BACKUP.test(id))throw Error('Nepoznata sigurnosna kopija.');const filename=path.join(directory,id),stat=await fs.stat(filename);if(stat.size>MAX_BYTES)throw Error('Sigurnosna kopija je prevelika.');const wrapper=JSON.parse(await fs.readFile(filename,'utf8'));if(wrapper.app!=='ELDI EDU'||wrapper.kind!=='local-backup'||wrapper.schema!==1)throw Error('Format sigurnosne kopije nije podržan.');return normalizeStore(wrapper.store);}
  async function updates(){
    const response=await fetchImpl('https://api.github.com/repos/elvir585/eldi-edu/releases/latest',{headers:{Accept:'application/vnd.github+json','User-Agent':'ELDI-EDU/'+version},signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error('GitHub trenutno nije dostupan (HTTP '+response.status+').');
    const text=await response.text();if(Buffer.byteLength(text)>1024*1024)throw Error('Odgovor o izdanju je prevelik.');
    const data=JSON.parse(text),comparison=compareVersion(data.tag_name,version),url=releaseURL(data.html_url);
    if(comparison===null||!url||data.draft||data.prerelease)throw Error('GitHub izdanje nije odgovarajuće stabilno izdanje.');
    return {current:version,latest:String(data.tag_name).replace(/^v/,''),available:comparison>0,url,publishedAt:typeof data.published_at==='string'?data.published_at:null,assets:(Array.isArray(data.assets)?data.assets:[]).filter(asset=>releaseURL(asset.browser_download_url)).map(asset=>({name:String(asset.name).slice(0,200),bytes:asset.size,url:releaseURL(asset.browser_download_url)}))};
  }
  return {backup,list,read,updates,flush:()=>queue};
}
module.exports={normalizeStore,compareVersion,releaseURL,createMaintenance,MAX_BYTES};
