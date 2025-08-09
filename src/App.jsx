import React from 'react'
import verses from './data/verses.json'

export default function App() {
  const load = (k, v) => { try { return JSON.parse(localStorage.getItem(k)) ?? v; } catch { return v; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const dayIndex = (() => {
    const d = new Date();
    const n = d.getFullYear()*1000 + (d.getMonth()+1)*50 + d.getDate();
    return n % verses.length;
  })();

  const [streak, setStreak] = React.useState(load('cm_streak', 0));
  const [lastDay, setLastDay] = React.useState(load('cm_lastDay', ''));
  const [habits, setHabits] = React.useState(load('cm_habits', {
    prayer:false, scripture:false, service:false, sobriety:false, creation:false
  }));
  const [journal, setJournal] = React.useState(load('cm_journal', ''));
  const [gratitude, setGratitude] = React.useState(load('cm_grat', ['', '', '']));
  const [sosOpen, setSosOpen] = React.useState(false);
  const [sosTimer, setSosTimer] = React.useState(0);
  const [urgeLog, setUrgeLog] = React.useState(load('cm_urges', []));
  const [goals, setGoals] = React.useState(load('cm_goals', ['Write 150 words','10 minutes prayer','Read 1 chapter']));

  React.useEffect(()=>{ save('cm_habits', habits); },[habits]);
  React.useEffect(()=>{ save('cm_journal', journal); },[journal]);
  React.useEffect(()=>{ save('cm_grat', gratitude); },[gratitude]);
  React.useEffect(()=>{ save('cm_urges', urgeLog); },[urgeLog]);
  React.useEffect(()=>{ save('cm_goals', goals); },[goals]);

  React.useEffect(()=>{
    const today = new Date().toDateString();
    if (lastDay !== today) {
      const yesterday = new Date(Date.now()-86400000).toDateString();
      const newStreak = (lastDay === yesterday) ? streak : 0;
      setStreak(newStreak);
      setLastDay(today);
      save('cm_lastDay', today);
      save('cm_streak', newStreak);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const completeDay = () => {
    const done = Object.values(habits).every(Boolean);
    if (!done) return alert('Finish all daily practices first.');
    const s = streak + 1;
    setStreak(s); save('cm_streak', s); save('cm_lastDay', new Date().toDateString());
  };

  const Card = ({children}) => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow p-4 md:p-6">{children}</div>
  );
  const SectionTitle = ({children, right}) => (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg md:text-xl font-semibold">{children}</h2>
      {right}
    </div>
  );
  const Toggle = ({label, checked, onChange, hint}) => (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} className="mt-1 h-5 w-5"/>
      <div>
        <div className="font-medium">{label}</div>
        {hint && <div className="text-sm text-zinc-500">{hint}</div>}
      </div>
    </label>
  );

  React.useEffect(()=>{
    if (!sosOpen || sosTimer<=0) return;
    const id = setInterval(()=> setSosTimer(t=> t-1), 1000);
    return ()=> clearInterval(id);
  },[sosOpen, sosTimer]);

  const startSOS = () => {
    setSosOpen(true);
    setSosTimer(90);
    const entry = { ts: Date.now(), note: hints()[0] };
    setUrgeLog([entry, ...urgeLog].slice(0, 100));
  };

  const hints = () => [
    "Breathe: 4-4-6 x6 cycles. Pray the Jesus Prayer or the Lord's Prayer slowly.",
    "Move: 20 pushups or a 2-minute wall sit. Change state → change desire.",
    "Open Scripture: read today's verse aloud three times.",
    "Call/message an accountability partner.",
    "Create: write one sentence for your story."
  ];

  const todayVerse = verses[dayIndex];

  const addGoal = () => {
    const g = prompt('New goal (kept as checklist item)');
    if (g) setGoals([...goals, g]);
  };

  const removeGoal = (i) => setGoals(goals.filter((_,k)=>k!==i));

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid gap-4 md:gap-6 md:grid-cols-3">
        <div className="md:col-span-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">Christian Motivation • Daily Rule of Life</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm">Streak</span>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-semibold">{streak} days</span>
            </div>
          </div>
        </div>

        <Card>
          <SectionTitle right={<span className="text-sm text-zinc-500">{todayVerse.ref}</span>}>Verse of the Day</SectionTitle>
          <p className="text-xl leading-relaxed">“{todayVerse.text}”</p>
          <div className="mt-3 text-sm text-zinc-500">Meditate: What single action would align me with this today?</div>
        </Card>

        <Card>
          <SectionTitle>Daily Practices</SectionTitle>
          <div className="space-y-3">
            <Toggle label="Prayer (5–10 min)" checked={habits.prayer} onChange={v=>setHabits({...habits, prayer:v})} hint="Silence + petition + gratitude"/>
            <Toggle label="Scripture (1 chapter or 10 min)" checked={habits.scripture} onChange={v=>setHabits({...habits, scripture:v})} hint="Read aloud if distracted"/>
            <Toggle label="Service (1 small act)" checked={habits.service} onChange={v=>setHabits({...habits, service:v})} hint="Bless one person tangibly"/>
            <Toggle label="Sobriety (no porn/NSFW)" checked={habits.sobriety} onChange={v=>setHabits({...habits, sobriety:v})} hint="Choose the narrow path today"/>
            <Toggle label="Creation (publish or progress)" checked={habits.creation} onChange={v=>setHabits({...habits, creation:v})} hint="Move your God-given craft forward"/>
          </div>
          <button onClick={completeDay} className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2">Mark Day Complete</button>
        </Card>

        <Card>
          <SectionTitle>Gratitude (3)</SectionTitle>
          <div className="grid grid-cols-1 gap-2">
            {gratitude.map((g,i)=>(
              <input key={i} value={g} onChange={e=>setGratitude(gratitude.map((x,k)=>k===i?e.target.value:x))} className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-2" placeholder={`Grateful for #${i+1}`} />
            ))}
          </div>
          <div className="mt-4">
            <div className="text-sm mb-1">Reflection / Prayer Journal</div>
            <textarea value={journal} onChange={e=>setJournal(e.target.value)} rows={6} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-2" placeholder="Speak honestly with God. What happened today? Where did you notice grace?"/>
          </div>
        </Card>

        <Card>
          <SectionTitle>Temptation SOS</SectionTitle>
          {!sosOpen ? (
            <button onClick={startSOS} className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3">Start 90-second Shield</button>
          ) : (
            <div>
              <div className="text-2xl font-bold mb-2">{sosTimer}s</div>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                {hints().map((h,i)=> <li key={i}>{h}</li>)}
              </ul>
              <div className="mt-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <div className="text-sm uppercase tracking-wide text-zinc-500">Speak aloud</div>
                <div className="text-lg">“{todayVerse.text}” — <span className="text-sm text-zinc-500">{todayVerse.ref}</span></div>
              </div>
              <button onClick={()=>setSosOpen(false)} className="mt-3 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 py-2">Done</button>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle right={<button onClick={addGoal} className="text-sm underline">Add</button>}>Rule of Life – Checklist</SectionTitle>
          <div className="space-y-2">
            {goals.map((g,i)=> (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="h-5 w-5" onChange={(e)=>{ if(e.target.checked){ setGoals(goals.filter((_,k)=>k!==i)); } }} />
                  <span>{g}</span>
                </div>
                <button onClick={()=>removeGoal(i)} className="text-xs px-2 py-1 rounded-lg border">remove</button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Urge Log</SectionTitle>
          {urgeLog.length===0 ? (
            <div className="text-sm text-zinc-500">No entries yet. When you feel an urge, hit SOS and ride the wave.</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-auto pr-2">
              {urgeLog.map((u,i)=>(
                <div key={i} className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-zinc-500">{new Date(u.ts).toLocaleString()}</div>
                  <div className="text-sm">{u.note}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="md:col-span-3 text-center text-xs text-zinc-500 mt-2">
          Built for quiet faith, daily discipline, and creating more than you consume.
        </div>
      </div>
    </div>
  );
}
