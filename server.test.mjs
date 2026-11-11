import {test} from "node:test";
import assert from "node:assert/strict";
import {createStudyServer} from "./backend/server.js";
test("static server and structured tools work without installed packages",async()=>{
 const server=createStudyServer();
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const url="http://127.0.0.1:"+server.address().port;
 try{
   let r=await fetch(url);assert.equal(r.status,200);assert.match(await r.text(),/StudyNest/);
   r=await fetch(url+"/core.mjs");assert.equal(r.status,200);
   r=await fetch(url+"/api/plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject:"Algebra",days:2,minutes:25})});
   assert.equal(r.status,200);assert.equal((await r.json()).sessions.length,2);
   r=await fetch(url+"/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:"hello"})});
   assert.equal(r.status,200);assert.match((await r.json()).reply,/Hello/);
   r=await fetch(url+"/.env");assert.equal(r.status,404);
   r=await fetch(url+"/api/notes",{method:"POST",headers:{"Content-Type":"application/json",Origin:"https://evil.invalid"},body:"{}"});
   assert.equal(r.status,403);
 }finally{await new Promise(resolve=>server.close(resolve))}
});
