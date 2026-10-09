'use strict';
// Real Chromium interactions with the desktop renderer; output is review evidence, not fixtures.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
let playwright;try{playwright=require('playwright');}catch{playwright=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'','playwright'));}
const {chromium}=playwright;
const root=path.resolve(__dirname,'..'),out=path.join(root,'smoke-previews/workspace');
let server,browser;
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,bytes)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(bytes);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,...(process.env.ELDI_CHROMIUM_PATH?{executablePath:process.env.ELDI_CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/renderer/index.html`);
 await page.waitForFunction(()=>window.__eldiReady);assert.deepEqual(errors,[]);


 const helpers=`const ensure=(c,m)=>{if(!c)throw Error(m);};const $=id=>document.getElementById(id);const wait=ms=>new Promise(r=>setTimeout(r,ms));const fill=(e,v)=>{ensure(e,'Missing input');e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};`;

 await page.setViewportSize({width:1008,height:655});
 const desktopSource=fs.readFileSync(path.join(root,'desktop/main.cjs'),'utf8'),marker="await stage('Blockly runtime, challenge and drawing', `",start=desktopSource.indexOf(marker)+marker.length,legacyStage=desktopSource.slice(start,desktopSource.indexOf('\n  `);',start));
 await page.evaluate('(async()=>{'+helpers+legacyStage+'})()').catch(async error=>{console.log(await page.evaluate(()=>[...document.querySelectorAll('#blocklyDiv,.bp-tools,.block-toolbar,.block-studio-header,.block-tabs,#block-challenge-panel')].map(e=>({tag:e.className||e.id,rect:e.getBoundingClientRect().toJSON()}))));await page.screenshot({path:path.join(out,'FAILED-blocks-windows-1008.png'),fullPage:true});throw error;});await page.screenshot({path:path.join(out,'blocks-windows-1008.png'),fullPage:true});
 await page.setViewportSize({width:1366,height:768});
 const report=await require('../desktop/lab-smoke.cjs').runLabSmoke({stage:async(name,code)=>{console.log(name);return page.evaluate('(async()=>{'+helpers+code+'})()');},capture:async name=>{await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}});
 for(const size of [{width:1366,height:768},{width:1093,height:614},{width:911,height:512}]){await page.setViewportSize(size);for(const dest of ['blocks','laboratory']){await page.evaluate(d=>go(d),dest);const dims=await page.evaluate(()=>({w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}));assert(dims.s<=dims.w+2,JSON.stringify({dest,size,dims}));}}
 await page.evaluate(()=>ELDIStorage.flush());await page.reload();await page.waitForFunction(()=>window.__eldiReady);assert.equal(await page.evaluate(()=>state().studioWork.reports[0].manualGrade),'3');assert.equal(await page.evaluate(()=>state().labWork.solid.angle),110);
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'lab-result.json'),JSON.stringify({...report,passed:true},null,2));console.log('NEW UI OK');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});
