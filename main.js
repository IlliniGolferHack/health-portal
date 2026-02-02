import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(window.React.createElement);
const { useState, useEffect } = window.React;

// Setup Icons from Global window
const { 
  Activity, Target, TrendingDown, TrendingUp, Calendar, 
  Footprints, Dumbbell, ChevronDown, ChevronUp, Check, 
  Trash2, Award, Zap, Timer, BarChart3 
} = window.lucide;

function HealthPortal() {
  // --- STORAGE HELPERS ---
  const getSaved = (key, fallback) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  };

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weightLog, setWeightLog] = useState(() => getSaved('hp_weight', [{ date: '2026-01-01', weight: 308 }]));
  const [runningLog, setRunningLog] = useState(() => getSaved('hp_runs', []));
  const [stackLog, setStackLog] = useState(() => getSaved('hp_stack', []));
  const [newWeight, setNewWeight] = useState({ date: '', weight: '' });

  // Auto-Save to Browser whenever logs change
  useEffect(() => {
    localStorage.setItem('hp_weight', JSON.stringify(weightLog));
    localStorage.setItem('hp_runs', JSON.stringify(runningLog));
    localStorage.setItem('hp_stack', JSON.stringify(stackLog));
  }, [weightLog, runningLog, stackLog]);

  // --- CALCULATIONS ---
  const currentWeight = weightLog[weightLog.length - 1].weight;
  const weightLost = 308 - currentWeight;
  const totalMiles = runningLog.reduce((sum, r) => sum + parseFloat(r.distance || 0), 0);
  const latestSpeed = stackLog.length > 0 ? stackLog[stackLog.length - 1].maxSpeed : 105;

  // --- ACTIONS ---
  const addWeight = () => {
    if (!newWeight.weight || !newWeight.date) return;
    setWeightLog([...weightLog, { ...newWeight, id: Date.now() }]);
    setNewWeight({ date: '', weight: '' });
  };

  // Helper to render icons properly in HTM
  const Icon = (iconObj, className = "w-5 h-5") => {
    // This creates a placeholder because Lucide needs a manual 'create' in some CDN setups
    // But for simplicity in this portal, we will use a basic SVG/Text indicator if necessary.
    return html`<span className="inline-block ${className}">⚡</span>`;
  };

  return html`
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Portal 2026</h1>
        <div className="flex gap-4 mt-4 overflow-x-auto">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[120px] border border-white/20">
            <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Weight</p>
            <p className="text-3xl font-black">${currentWeight}</p>
            <p className="text-[10px] opacity-70">-${weightLost} lbs lost</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[120px] border border-white/20">
            <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Miles</p>
            <p className="text-3xl font-black">${totalMiles.toFixed(1)}</p>
            <p className="text-[10px] opacity-70">of 100 goal</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[120px] border border-white/20">
            <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Speed</p>
            <p className="text-3xl font-black">${latestSpeed}</p>
            <p className="text-[10px] opacity-70">mph current</p>
          </div>
        </div>
      </div>

      <div className="flex bg-white border-b sticky top-0 z-50 shadow-sm">
        ${['dashboard', 'weight', 'running', 'stack'].map(t => html`
          <button 
            onClick=${() => setActiveTab(t)}
            className=${`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-orange-600 border-b-4 border-orange-600' : 'text-slate-400'}`}
          >
            ${t}
          </button>
        `)}
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        ${activeTab === 'weight' && html`
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Add Entry</h3>
              <div className="space-y-3">
                <input type="date" className="w-full p-4 bg-slate-50 border rounded-xl" value=${newWeight.date} onChange=${e => setNewWeight({...newWeight, date: e.target.value})} />
                <input type="number" placeholder="Lbs" className="w-full p-4 bg-slate-50 border rounded-xl text-lg font-bold" value=${newWeight.weight} onChange=${e => setNewWeight({...newWeight, weight: e.target.value})} />
                <button onClick=${addWeight} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold">Save Weight</button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">History</h4>
              ${weightLog.slice().reverse().map(log => html`
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-black text-slate-700">${log.weight} lbs</span>
                  <span className="text-xs font-bold text-slate-300">${log.date}</span>
                </div>
              `)}
            </div>
          </div>
        `}

        ${activeTab === 'dashboard' && html`
          <div className="py-10 text-center space-y-6">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">26</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Ready for the course?</h2>
              <p className="text-sm text-slate-500 max-w-[240px] mx-auto">Track your weight loss, running miles, and stack speeds for the 2026 season.</p>
            </div>
            <button onClick=${() => setActiveTab('weight')} className="bg-orange-500 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-200">Get Started</button>
          </div>
        `}
      </div>
    </div>
  `;
}

// Render to DOM
const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(window.React.createElement(HealthPortal));
