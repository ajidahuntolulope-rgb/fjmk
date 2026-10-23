import fs from 'node:fs';import path from 'node:path';
const pages=['index','portfolio','services','about','blog','contact','resources','research','tools'];let count=0,errors=[];
for(const page of pages){const html=fs.readFileSync(`dist/${page}.html`,'utf8');for(const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)){const u=m[1].split('#')[0].split('?')[0];if(!u)continue;const p=path.join('dist',u);if(![p,p+'.html',path.join(p,'index.html')].some(x=>fs.existsSync(x)&&fs.statSync(x).isFile()))errors.push({page,url:u});count++;}}
console.log(JSON.stringify({references:count,errors}));
