// Transparent deterministic study tools: no third-party API or hidden AI model.
const stopwords = new Set(["that","this","from","with","have","there","their","about","which","where","would","could","should","what","when","your","they","them","into","then","because","will","were","been","also","more","than","some","each","such","while","using","under","over","very","just","these","those","here","only","other","between","after","before"]);
export function planStudy(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw Error("Provide a study plan request");
  const subject = String(input.subject || "").trim();
  const days = Number(input.days), minutes = Number(input.minutes);
  if (!subject || subject.length > 80) throw Error("Subject must contain 1–80 characters");
  if (!Number.isInteger(days) || days < 1 || days > 14) throw Error("Choose 1–14 days");
  if (!Number.isInteger(minutes) || minutes < 15 || minutes > 240) throw Error("Choose 15–240 minutes each day");
  const phases = ["Identify learning goals and review prerequisites","Learn one focused concept and make short notes","Practice with worked examples and original exercises","Self-test without notes and review mistakes","Revisit weak areas using spaced recall"];
  const sessions = Array.from({length:days},(_,i)=>({
    day:i+1, minutes, focus:phases[i%phases.length],
    warmup_minutes:Math.round(minutes*.2),
    deep_work_minutes:Math.round(minutes*.6),
    review_minutes:minutes-Math.round(minutes*.2)-Math.round(minutes*.6)
  }));
  return {subject,days,minutes_per_day:minutes,total_minutes:days*minutes,sessions,method:"Demonstration schedule; adapt to actual coursework and deadlines"};
}
export function summarizeNotes(value) {
  if (typeof value !== "string" || !value.trim()) throw Error("Paste notes to summarize");
  if (value.length>8000) throw Error("Notes are limited to 8,000 characters");
  const normalized=value.trim().replace(/\s+/g," ");
  const sentences=normalized.split(/(?<=[.!?])\s+/u).filter(Boolean);
  const excerpt=sentences.slice(0,Math.min(3,sentences.length)).join(" ").slice(0,900);
  const counts=new Map();
  for(const word of (normalized.toLowerCase().match(/[a-z]{4,}/g)||[])) if(!stopwords.has(word))counts.set(word,(counts.get(word)||0)+1);
  const key_terms=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,6).map(([word])=>word);
  return {excerpt,key_terms,sentences_detected:sentences.length,method:"Extractive first-three-sentence preview; not AI fact checking"};
}
export function replyToMessage(message) {
  if(typeof message!=="string"||!message.trim()||message.length>3000)throw Error("Write a message under 3,000 characters");
  const normalized=message.toLowerCase();
  if(/\b(hi|hello|hey)\b/.test(normalized))return "Hello! Use Study Planner for a day-by-day schedule or Notes Studio to extract key terms.";
  if(/\b(exam|test|study|revision)\b/.test(normalized))return "Try a 25-minute focus session, 5-minute break, then active recall. Make a plan in the Study Planner tab.";
  if(/\b(notes|summary|summarize)\b/.test(normalized))return "Paste your own notes into Notes Studio. The preview extracts the first three sentences and frequent key terms.";
  return "I am a rules-based demonstration assistant, not a live language model. For a study schedule use the planner; for notes use the summarizer.";
}
