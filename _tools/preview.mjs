import http from 'node:http';
import { Readable } from 'node:stream';
import { handleClinicAuditRequest, handleClinicPageSpeedRequest } from './clinic-audit-core.mjs';
import fs from 'node:fs';
import path from 'node:path';
const localVars = path.resolve('.dev.vars');
if (fs.existsSync(localVars)) {
  for (const line of fs.readFileSync(localVars, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
  }
}
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.woff2':'font/woff2','.txt':'text/plain','.xml':'application/xml'};
http.createServer(async(req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (pathname === '/api/audit' || pathname === '/api/pagespeed') {
    try {
      const init = { method: req.method, headers: { 'content-type': req.headers['content-type'] || '', origin: req.headers.origin || '' } };
      if (req.method !== 'GET' && req.method !== 'HEAD') { init.body = Readable.toWeb(req); init.duplex = 'half'; }
      const request = new Request('http://localhost' + pathname, init);
      const handler = pathname === '/api/pagespeed' ? handleClinicPageSpeedRequest : handleClinicAuditRequest;
      const response = await handler(request, { pageSpeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY });
      const body = Buffer.from(await response.arrayBuffer());
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      res.end(body);
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: 'The local scanner could not complete the request.' }));
    }
    return;
  }
  const redirectFile=path.join(root,'_redirects');
  const redirect=fs.existsSync(redirectFile)?fs.readFileSync(redirectFile,'utf8').split(/\r?\n/).filter(line=>line.trim()&&!line.startsWith('#')).map(line=>line.trim().split(/\s+/)).find(rule=>rule[0]===pathname):null;
  if(redirect){res.writeHead(Number(redirect[2])||302,{Location:redirect[1]});return res.end();}
  const target = path.resolve(root, '.' + pathname);
  if (target !== root && !target.startsWith(root + path.sep)) {res.writeHead(403); return res.end();}
  let file = [target,target+'.html',path.join(target,'index.html')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
  const status=file?200:404; file ||= path.join(root,'404.html');
  const size=fs.statSync(file).size;
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
  const match=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(match){const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),size-1):size-1;if(start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else {res.writeHead(status,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);}
}).listen(3220,'127.0.0.1',()=>console.log('FJMK preview http://127.0.0.1:3220'));
