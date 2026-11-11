import {planStudy,summarizeNotes,replyToMessage} from "./core.mjs";
const el=id=>document.getElementById(id);
const make=(tag,text,className)=>{const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n};
const panels=["planner","notes","helper"];
for(const btn of document.querySelectorAll("[data-view]"))btn.addEventListener("click",()=>{
  const target=btn.dataset.view;
  if(!panels.includes(target))return;
  for(const p of panels)el(p+"-view").classList.toggle("hidden",p!==target);
  for(const b of document.querySelectorAll("[data-view]"))b.classList.toggle("active",b.dataset.view===target);
});
el("plan-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const result=planStudy({subject:el("subject").value,days:Number(el("days").value),minutes:Number(el("minutes").value)});
    el("plan-summary").textContent=result.subject+" · "+result.days+" days · "+result.total_minutes+" total minutes · locally generated";
    el("plan-results").replaceChildren();
    for(const session of result.sessions){
      const card=make("article","","session");
      card.append(make("small","DAY "+String(session.day).padStart(2,"0")),make("h3",session.focus),make("p",session.warmup_minutes+" min warmup · "+session.deep_work_minutes+" min focus · "+session.review_minutes+" min review"));
      el("plan-results").append(card);
    }
  }catch(error){el("plan-summary").textContent=error.message;el("plan-results").replaceChildren();}
});
el("notes-form").addEventListener("submit",event=>{
  event.preventDefault();
  const out=el("notes-result");out.replaceChildren();
  try{
    const r=summarizeNotes(el("notes").value);
    out.append(make("strong","Extractive preview:"),make("p",r.excerpt));
    out.append(make("strong","Frequent key terms:"));
    const terms=make("div","","keywords");
    for(const term of r.key_terms)terms.append(make("span",term,"keyword"));
    out.append(terms,make("p",r.method));
  }catch(error){out.append(make("p",error.message));}
});
el("sample-notes").addEventListener("click",()=>{
  el("notes").value="Cybersecurity protects systems, networks, and data from unauthorized access. Good security uses strong authentication, least privilege, updates, and secure backups. Access controls help keep sensitive information limited to authorized users. Teams should practice incident response and regularly review their access permissions.";
  el("notes-form").requestSubmit();
});
el("chat-form").addEventListener("submit",event=>{
  event.preventDefault();
  const input=el("chat-input");const message=input.value.trim();if(!message)return;
  el("chat-log").append(make("div",message,"bubble user"));
  try{el("chat-log").append(make("div",replyToMessage(message),"bubble bot"));}
  catch(error){el("chat-log").append(make("div",error.message,"bubble bot"));}
  input.value="";el("chat-log").scrollTop=el("chat-log").scrollHeight;input.focus();
});
el("plan-form").requestSubmit();
