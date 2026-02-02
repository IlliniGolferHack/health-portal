// 1. Setup the "JSX" translator for the browser
import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(window.React.createElement);

const { useState, useEffect } = window.React;
const { 
  Activity, Target, TrendingDown, TrendingUp, Calendar, 
  Footprints, Dumbbell, ChevronDown, ChevronUp, Check, 
  Trash2, Award, Zap, Timer, BarChart3 
} = window.lucide;

function HealthPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weightLog, setWeightLog] = useState(() => {
    const saved = localStorage.getItem('hp_weight');
    return saved ? JSON.parse(saved) : [{ date: '2026-01-01', weight: 308 }];
  });

  const currentWeight = weightLog[weightLog.length - 1].weight;

  // This replaces standard JSX <div /> with html`<div />`
  return html`
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-black italic tracking-tighter">PORTAL 2026</h1>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl min-w-[100px]">
            <p className="text-xs uppercase font-bold opacity-70 text-orange-100">Weight</p>
            <p className="text-2xl font-black">${currentWeight}</p>
          </div>
        </div>
      </div>

      <div className="flex bg-white border-b sticky top-0 z-50">
        ${['dashboard', 'weight', 'running'].map(t => html`
          <button 
            onClick=${() => setActiveTab(t)}
            className=${`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === t ? 'text-orange-600 border-b-4 border-orange-600' : 'text-slate-400'}`}
          >
            ${t}
          </button>
        `)}
      </div>

      <div className="p-4 max-w-md mx-auto">
        ${activeTab === 'dashboard' && html`
          <div className="text-center py-10">
            <h2 className="text-xl font-bold">Welcome to 2026</h2>
            <p className="text-slate-500 mt-2">Your data is stored in your browser's local storage.</p>
          </div>
        `}
        
        ${activeTab === 'weight' && html`
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold mb-4">Weight History</h3>
              ${weightLog.map(log => html`
                <div className="flex justify-between py-2 border-b last:border-0">
                  <span className="font-bold">${log.weight} lbs</span>
                  <span className="text-slate-400">${log.date}</span>
                </div>
              `)}
           </div>
        `}
      </div>
    </div>
  `;
}

// 2. Mount the app
const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(window.React.createElement(HealthPortal));
