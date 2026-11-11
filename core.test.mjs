import {test} from "node:test";
import assert from "node:assert/strict";
import {planStudy,summarizeNotes,replyToMessage} from "./core.mjs";
test("study plans have consistent totals and no input mutation",()=>{
 const input={subject:"Network Security",days:7,minutes:50},before=JSON.stringify(input),p=planStudy(input);
 assert.equal(p.sessions.length,7);assert.equal(p.total_minutes,350);
 assert.equal(p.sessions[0].warmup_minutes+p.sessions[0].deep_work_minutes+p.sessions[0].review_minutes,50);
 assert.equal(JSON.stringify(input),before);
});
test("invalid parameters are rejected",()=>{
 for(const input of [null,{}, {subject:"x",days:0,minutes:40},{subject:"x",days:3,minutes:6}])assert.throws(()=>planStudy(input));
 assert.throws(()=>summarizeNotes(" "));
 assert.throws(()=>replyToMessage(""));
});
test("summarization and help are deterministic",()=>{
 const r=summarizeNotes("Security requires least privilege. Least privilege restricts access. Review access often. Extra final sentence.");
 assert.equal(r.sentences_detected,4);assert.ok(r.key_terms.includes("access"));
 assert.match(replyToMessage("I have an exam"),/focus session/);
});
