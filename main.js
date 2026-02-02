// 1. Setup Lucide Icons for CodePen
const { 
  Activity, Target, TrendingDown, TrendingUp, Calendar, 
  Footprints, Dumbbell, ChevronDown, ChevronUp, Check, 
  Trash2, Award, Zap, Timer, BarChart3 
} = window.lucide ? window.lucide : {};

const { useState, useEffect } = React;

const HealthPortal = () => {
  // --- LOCAL STORAGE HELPERS ---
  const getSaved = (key, fallback) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  };

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentWeek, setCurrentWeek] = useState(() => getSaved('hp_week', 1));
  const [weightLog, setWeightLog] = useState(() => getSaved('hp_weight', [{ date: '2026-01-01', weight: 308 }]));
  const [runningLog, setRunningLog] = useState(() => getSaved('hp_runs', []));
  const [stackLog, setStackLog] = useState(() => getSaved('hp_stack', []));
  const [workouts, setWorkouts] = useState(() => getSaved('hp_done', {}));

  // Auto-Save to Browser
  useEffect(() => {
    localStorage.setItem('hp_week', JSON.stringify(currentWeek));
    localStorage.setItem('hp_weight', JSON.stringify(weightLog));
    localStorage.setItem('hp_runs', JSON.stringify(runningLog));
    localStorage.setItem('hp_stack', JSON.stringify(stackLog));
    localStorage.setItem('hp_done', JSON.stringify(workouts));
  }, [currentWeek, weightLog, runningLog, stackLog, workouts]);

  // --- CALCULATIONS ---
  const startWeight = 308;
  const currentWeight = weightLog[weightLog.length - 1].weight;
  const totalMiles = runningLog.reduce((sum, r) => sum + parseFloat(r.distance || 0), 0);
  const latestSpeed = stackLog.length > 0 ? stackLog[stackLog.length - 1].maxSpeed : 105;

  // --- LOGGING FUNCTIONS ---
  const [newWeight, setNewWeight] = useState({ date: '', weight: '' });
  
  const addWeight = () => {
    if (!newWeight.weight) return;
    setWeightLog([...weightLog, { ...newWeight, id: Date.now() }]);
    setNewWeight({ date: '', weight: '' });
  };

  const Icon = ({ name: IconComp, ...props }) => {
    return IconComp ? <IconComp {...props} /> : <div className="w-4 h-4 bg-gray-200" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-black italic tracking-tighter">PORTAL 2026</h1>
        <div className="flex gap-4 mt-4 overflow-x-auto">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl min-w-[100px]">
            <p className="text-xs uppercase font-bold opacity-70 text-orange-100">Weight</p>
            <p className="text-2xl font-black">{currentWeight}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl min-w-[100px]">
            <p className="text-xs uppercase font-bold opacity-70 text-orange-100">Miles</p>
            <p className="text-2xl font-black">{totalMiles.toFixed(1)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl min-w-[100px]">
            <p className="text-xs uppercase font-bold opacity-70 text-orange-100">Speed</p>
            <p className="text-2xl font-black">{latestSpeed}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex bg-white border-b sticky top-0 z-50 shadow-sm">
        {['dashboard', 'weight', 'running', 'stack'].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === t ? 'text-orange-600 border-b-4 border-orange-600' : 'text-slate-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-w-md mx-auto space-y-4">
        {activeTab === 'weight' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon name={TrendingDown} className="w-5 h-5 text-orange-500" /> Log Weight
              </h3>
              <div className="space-y-3">
                <input 
                  type="date" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-orange-500" 
                  value={newWeight.date} 
                  onChange={e => setNewWeight({...newWeight, date: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="Weight in lbs" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-orange-500" 
                  value={newWeight.weight} 
                  onChange={e => setNewWeight({...newWeight, weight: e.target.value})}
                />
                <button 
                  onClick={addWeight}
                  className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  Save Entry
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">History</h4>
              {weightLog.slice().reverse().map((log, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                  <span className="font-black text-slate-700">{log.weight} <span className="text-[10px] font-normal text-slate-400 uppercase">lbs</span></span>
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{log.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="text-center py-10 space-y-4">
            <Icon name={Activity} className="w-12 h-12 text-orange-200 mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 px-10">Data is saved automatically to this browser. Ready for 2026?</p>
            <button onClick={() => setActiveTab('weight')} className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200">Start Logging</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Mount the App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<HealthPortal />);
}
