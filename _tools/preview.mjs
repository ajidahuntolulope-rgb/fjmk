import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.woff2':'font/woff2','.txt':'text/plain','.xml':'application/xml'};
http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
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
