// Grab everything from the global window object
const { useState, useEffect } = window.React;
const ReactDOM = window.ReactDOM;

// Safety check for icons
const icons = window.lucide || {};
const { 
  Activity, Target, TrendingDown, TrendingUp, Calendar, 
  Footprints, Dumbbell, ChevronDown, ChevronUp, Check, 
  Trash2, Award, Zap, Timer, BarChart3 
} = icons;

const HealthPortal = () => {
  // --- STORAGE LOGIC ---
  const [weightLog, setWeightLog] = useState(() => {
    const saved = localStorage.getItem('hp_weight');
    return saved ? JSON.parse(saved) : [{ date: '2026-01-01', weight: 308 }];
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('hp_weight', JSON.stringify(weightLog));
  }, [weightLog]);

  // --- RENDER ---
  return (
    <div className="min-h-screen p-6">
      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-xl">
        <h1 className="text-2xl font-black">HEALTH PORTAL 2026</h1>
        <p className="opacity-80">Current Weight: {weightLog[weightLog.length - 1].weight} lbs</p>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-slate-500">If you see this, Vercel is working!</p>
        <button 
          onClick={() => alert('React is active!')}
          className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-full"
        >
          Test Interaction
        </button>
      </div>
    </div>
  );
};

// --- MOUNTING ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(HealthPortal));
