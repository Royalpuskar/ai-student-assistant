import {createServer as httpServer} from "node:http";
import {readFile} from "node:fs/promises";
import {planStudy,summarizeNotes,replyToMessage} from "../core.mjs";

const assets={
  "/":"index.html",
  "/index.html":"index.html",
  "/style.css":"style.css",
  "/app.mjs":"app.mjs",
  "/core.mjs":"core.mjs"
};
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".mjs":"text/javascript; charset=utf-8"};
function send(res,status,payload){
  res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});
  res.end(JSON.stringify(payload));
}
async function parse(req){
  let size=0;const parts=[];
  for await(const part of req){
    size+=part.length;if(size>24000){const e=Error("Request too large");e.status=413;throw e}parts.push(part);
  }
  try{return JSON.parse(Buffer.concat(parts).toString("utf8"))}catch{const e=Error("Invalid JSON");e.status=400;throw e}
}
export function createStudyServer(){
  return httpServer(async(req,res)=>{
    res.setHeader("X-Content-Type-Options","nosniff");
    const url=new URL(req.url||"/","http://localhost");
    if(req.method==="GET"&&url.pathname==="/health")return send(res,200,{ok:true,mode:"deterministic-offline-tools"});
    if(req.method==="GET"&&Object.hasOwn(assets,url.pathname)){
      const name=assets[url.pathname];
      try{
        const bytes=await readFile(new URL("../"+name,import.meta.url));
        const ext=name.slice(name.lastIndexOf("."));
        res.writeHead(200,{"Content-Type":types[ext],"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});return res.end(bytes);
      }catch{return send(res,500,{error:"Asset unavailable"})}
    }
    if(req.method!=="POST"||!["/chat","/api/plan","/api/notes"].includes(url.pathname))return send(res,404,{error:"Not found"});
    const origin=req.headers.origin;
    if(origin&&origin!=="http://"+req.headers.host&&origin!=="https://"+req.headers.host)return send(res,403,{error:"Origin not allowed"});
    if(!String(req.headers["content-type"]||"").startsWith("application/json"))return send(res,415,{error:"JSON required"});
    try{
      const body=await parse(req);
      if(url.pathname==="/chat")return send(res,200,{reply:replyToMessage(body.message)});
      if(url.pathname==="/api/plan")return send(res,200,planStudy(body));
      return send(res,200,summarizeNotes(body.notes));
    }catch(error){return send(res,error.status||400,{error:error.message})}
  });
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href){
  const host=process.env.HOST||"127.0.0.1",port=Number(process.env.PORT||3000);
  createStudyServer().listen(port,host,()=>console.log("StudyNest running at http://"+host+":"+port));
}
