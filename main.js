import React, { useState } from 'react';
import { Activity, Target, TrendingDown, TrendingUp, Calendar, Footprints, Dumbbell, ChevronDown, ChevronUp, Check, Trash2, Award, Zap, Timer, BarChart3 } from 'lucide-react';

const HealthPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [workouts, setWorkouts] = useState({});
  const [runningLog, setRunningLog] = useState([]);
  const [weightLog, setWeightLog] = useState([{ date: '2026-01-01', weight: 308 }]);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [newRunEntry, setNewRunEntry] = useState({ date: '', distance: '', type: 'walk', notes: '' });
  const [newWeightEntry, setNewWeightEntry] = useState({ date: '', weight: '' });
  const [exerciseLogs, setExerciseLogs] = useState({});
  
  // Stack System State
  const [stackLog, setStackLog] = useState([]);
  const [newStackEntry, setNewStackEntry] = useState({ 
    date: '', 
    maxSpeed: '', 
    avgSpeed: '',
    protocol: 'speed',
    swings: '',
    notes: '' 
  });

  // Program constants
  const startWeight = 308;
  const goalWeight = 250;
  const goalMiles = 100;
  const baselineSpeed = 105;
  const goalSpeed = 115;

  // Calculate progress
  const currentWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : startWeight;
  const weightLost = startWeight - currentWeight;
  const weightProgress = Math.min(100, (weightLost / (startWeight - goalWeight)) * 100);
  
  const totalMiles = runningLog.reduce((sum, entry) => sum + parseFloat(entry.distance || 0), 0);
  const milesProgress = Math.min(100, (totalMiles / goalMiles) * 100);

  // Stack Speed calculations
  const latestStackSpeed = stackLog.length > 0 ? parseFloat(stackLog[stackLog.length - 1].maxSpeed) : baselineSpeed;
  const speedGain = latestStackSpeed - baselineSpeed;
  const speedProgress = Math.min(100, (speedGain / (goalSpeed - baselineSpeed)) * 100);
  const estimatedCarry = Math.round(latestStackSpeed * 2.5);

  const stackProtocols = {
    speed: { name: "Speed Protocol", description: "Max effort swings for peak speed" },
    overspeed: { name: "Overspeed Protocol", description: "Light stick - train faster movement patterns" },
    superspeed: { name: "SuperSpeed Protocol", description: "Alternating light/medium/heavy sticks" }
  };

  // Simplified 16-week program with Stack on Monday & Thursday
  const weeklyProgram = {
    1: {
      phase: "Foundation & Habit Building",
      focus: "Establish movement patterns, introduce Stack System",
      workouts: [
        { day: "Monday", type: "Mobility, TPI & Stack", duration: "35-40 min", description: "TPI stretches + Stack introduction", hasStack: true, stackProtocol: "overspeed", stackSwings: "15-20",
          exercises: [
            { name: "90/90 Hip Stretch", sets: 2, reps: "60s each", notes: "Breathe deeply" },
            { name: "Thoracic Spine Rotation", sets: 2, reps: "10 each", notes: "Slow and controlled" },
            { name: "Cat-Cow", sets: 1, reps: "10 slow", notes: "" },
            { name: "Hip Flexor Stretch", sets: 2, reps: "60s each", notes: "" },
            { name: "Stack - Light Stick", sets: 3, reps: "5 swings", notes: "Focus on form" },
            { name: "Stack - Medium Stick", sets: 2, reps: "5 swings", notes: "Smooth acceleration" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "Listen to your body" }]
        },
        { day: "Wednesday", type: "Walk/Run Intervals", duration: "20 min", description: "Building running base",
          exercises: [
            { name: "Warm-up Walk", sets: 1, reps: "3 min", notes: "" },
            { name: "Walk/Jog Intervals", sets: 5, reps: "2 min walk, 30s jog", notes: "" },
            { name: "Cool-down Walk", sets: 1, reps: "4 min", notes: "" }
          ]
        },
        { day: "Thursday", type: "Stack Speed Training", duration: "20-25 min", description: "Dedicated speed session", hasStack: true, stackProtocol: "speed", stackSwings: "20-25",
          exercises: [
            { name: "Dynamic Warm-up", sets: 1, reps: "5 min", notes: "" },
            { name: "Stack - Light Stick", sets: 2, reps: "5 swings", notes: "" },
            { name: "Stack - Medium Stick", sets: 2, reps: "5 swings", notes: "" },
            { name: "Stack - Heavy Stick", sets: 2, reps: "5 swings", notes: "" },
            { name: "Stack - Driver Speed Test", sets: 1, reps: "3 swings", notes: "Record max!" }
          ]
        },
        { day: "Friday", type: "Strength - Full Body", duration: "30 min", description: "Foundation strength",
          exercises: [
            { name: "Leg Press", sets: 3, reps: "12", notes: "" },
            { name: "Seated Row", sets: 3, reps: "12", notes: "" },
            { name: "Chest Press", sets: 3, reps: "12", notes: "" },
            { name: "Plank", sets: 3, reps: "30s", notes: "" }
          ]
        }
      ]
    },
    2: {
      phase: "Foundation & Habit Building",
      focus: "Increase walking, establish Stack routine",
      workouts: [
        { day: "Monday", type: "Mobility, TPI & Stack", duration: "35-40 min", description: "TPI + foam rolling + Stack", hasStack: true, stackProtocol: "superspeed", stackSwings: "20-25",
          exercises: [
            { name: "Foam Roll - Full Body", sets: 1, reps: "5 min", notes: "" },
            { name: "TPI Stretches", sets: 1, reps: "10 min", notes: "" },
            { name: "Stack - SuperSpeed Protocol", sets: 2, reps: "5 each stick", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Cardio", duration: "35-40 min", description: "Speed + intervals", hasStack: true, stackProtocol: "speed", stackSwings: "25-30",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Walk/Jog Intervals", sets: 6, reps: "90s walk, 45s jog", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength - Full Body", duration: "30 min", description: "Full body patterns",
          exercises: [
            { name: "Goblet Squat", sets: 3, reps: "10", notes: "" },
            { name: "Push-ups", sets: 3, reps: "10", notes: "" },
            { name: "Dumbbell Row", sets: 3, reps: "10 each", notes: "" }
          ]
        }
      ]
    },
    3: {
      phase: "Building Endurance",
      focus: "Increasing intervals, progress Stack",
      workouts: [
        { day: "Monday", type: "TPI & Stack", duration: "40 min", description: "Golf mobility + Stack", hasStack: true, stackProtocol: "overspeed", stackSwings: "25-30",
          exercises: [
            { name: "Hip 90/90", sets: 2, reps: "60s each", notes: "" },
            { name: "Thoracic Rotations", sets: 2, reps: "12 each", notes: "" },
            { name: "Stack - Overspeed Focus", sets: 3, reps: "6 light stick", notes: "" },
            { name: "Stack - Transfer", sets: 2, reps: "5 medium/heavy", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run", duration: "40-45 min", description: "Speed + endurance", hasStack: true, stackProtocol: "speed", stackSwings: "30-35",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Max Effort", sets: 2, reps: "3 swings", notes: "" },
            { name: "Walk/Jog Intervals", sets: 6, reps: "1 min each", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength", duration: "35 min", description: "Progressive overload",
          exercises: [
            { name: "Leg Press", sets: 3, reps: "12", notes: "Increase weight" },
            { name: "Chest Press", sets: 3, reps: "12", notes: "" },
            { name: "Lat Pulldown", sets: 3, reps: "12", notes: "" }
          ]
        }
      ]
    },
    4: {
      phase: "Building Endurance",
      focus: "Running progression, Stack development",
      workouts: [
        { day: "Monday", type: "Mobility & Stack", duration: "40 min", description: "Core focus + speed", hasStack: true, stackProtocol: "superspeed", stackSwings: "30",
          exercises: [
            { name: "Foam Rolling", sets: 1, reps: "5 min", notes: "" },
            { name: "Bird Dog", sets: 3, reps: "10 each", notes: "" },
            { name: "Stack - SuperSpeed", sets: 2, reps: "5 each stick", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run", duration: "45 min", description: "More jogging + speed", hasStack: true, stackProtocol: "speed", stackSwings: "35",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Speed Test", sets: 1, reps: "5 max effort", notes: "" },
            { name: "Intervals", sets: 5, reps: "45s walk, 90s jog", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength", duration: "35 min", description: "Dumbbell focus",
          exercises: [
            { name: "Goblet Squat", sets: 3, reps: "12", notes: "" },
            { name: "Push-ups", sets: 3, reps: "12", notes: "" },
            { name: "RDL", sets: 3, reps: "12", notes: "" }
          ]
        }
      ]
    },
    5: {
      phase: "Progressive Loading",
      focus: "5 min continuous jog, Stack milestones",
      workouts: [
        { day: "Monday", type: "TPI Power & Stack", duration: "45 min", description: "Power + speed", hasStack: true, stackProtocol: "overspeed", stackSwings: "35-40",
          exercises: [
            { name: "Med Ball Rotations", sets: 3, reps: "8 each", notes: "" },
            { name: "Stack - Overspeed Heavy", sets: 4, reps: "5 light", notes: "" },
            { name: "Stack - Transfer", sets: 3, reps: "5 medium", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run Milestone", duration: "45 min", description: "5 min continuous!", hasStack: true, stackProtocol: "speed", stackSwings: "40",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Max Effort", sets: 2, reps: "5 swings", notes: "New PR!" },
            { name: "Continuous Jog", sets: 1, reps: "5 min", notes: "MILESTONE!" },
            { name: "Walk Recovery", sets: 1, reps: "3 min", notes: "" },
            { name: "Intervals", sets: 4, reps: "1 min walk, 2 min jog", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength - Upper", duration: "35 min", description: "Upper body for golf",
          exercises: [
            { name: "Bench Press", sets: 3, reps: "10", notes: "" },
            { name: "Bent Over Row", sets: 3, reps: "10", notes: "" },
            { name: "Shoulder Press", sets: 3, reps: "10", notes: "" }
          ]
        }
      ]
    },
    6: {
      phase: "Progressive Loading",
      focus: "Building continuous running, Stack progression",
      workouts: [
        { day: "Monday", type: "Mobility & Stack", duration: "40 min", description: "Recovery + speed", hasStack: true, stackProtocol: "superspeed", stackSwings: "35",
          exercises: [
            { name: "Foam Rolling", sets: 1, reps: "5 min", notes: "" },
            { name: "Dead Bug", sets: 3, reps: "10 each", notes: "" },
            { name: "Stack - SuperSpeed", sets: 2, reps: "5 each stick", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run", duration: "50 min", description: "Extended continuous", hasStack: true, stackProtocol: "speed", stackSwings: "40",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Continuous Jog", sets: 2, reps: "8 min each", notes: "2 min walk between" }
          ]
        },
        { day: "Saturday", type: "Strength - Lower", duration: "35 min", description: "Legs for golf",
          exercises: [
            { name: "Squat", sets: 4, reps: "8", notes: "" },
            { name: "RDL", sets: 3, reps: "10", notes: "" },
            { name: "Hip Thrust", sets: 3, reps: "12", notes: "" }
          ]
        }
      ]
    },
    7: {
      phase: "Peak Building",
      focus: "10 min continuous, increased Stack",
      workouts: [
        { day: "Monday", type: "TPI & Stack Power", duration: "45 min", description: "Rotational power + Stack", hasStack: true, stackProtocol: "speed", stackSwings: "40-45",
          exercises: [
            { name: "Med Ball Slam", sets: 3, reps: "10", notes: "" },
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Max Effort", sets: 3, reps: "5 swings", notes: "Push for new speeds!" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run Milestone", duration: "50 min", description: "10 min continuous!", hasStack: true, stackProtocol: "speed", stackSwings: "45",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Speed Test", sets: 2, reps: "5 max effort", notes: "" },
            { name: "Continuous Jog", sets: 2, reps: "10 min each", notes: "MILESTONE!" }
          ]
        },
        { day: "Saturday", type: "Strength - Full Body", duration: "40 min", description: "Compound focus",
          exercises: [
            { name: "Deadlift", sets: 4, reps: "6", notes: "" },
            { name: "Bench Press", sets: 4, reps: "8", notes: "" },
            { name: "Row", sets: 4, reps: "8", notes: "" }
          ]
        }
      ]
    },
    8: {
      phase: "Peak Building",
      focus: "Deload week - maintain Stack",
      workouts: [
        { day: "Monday", type: "Mobility & Light Stack", duration: "35 min", description: "Recovery + maintenance", hasStack: true, stackProtocol: "overspeed", stackSwings: "20",
          exercises: [
            { name: "Foam Rolling", sets: 1, reps: "10 min", notes: "" },
            { name: "TPI Full Routine", sets: 1, reps: "15 min", notes: "" },
            { name: "Stack - Light Maintenance", sets: 2, reps: "5 each stick", notes: "Easy effort" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Easy Stack & Run", duration: "35 min", description: "Recovery week", hasStack: true, stackProtocol: "overspeed", stackSwings: "20",
          exercises: [
            { name: "Stack - Easy Swings", sets: 2, reps: "5 each stick", notes: "70% effort" },
            { name: "Easy Walk/Jog", sets: 1, reps: "25 min", notes: "" }
          ]
        },
        { day: "Saturday", type: "Light Strength", duration: "25 min", description: "Reduced volume",
          exercises: [
            { name: "Goblet Squat", sets: 2, reps: "10", notes: "" },
            { name: "Push-ups", sets: 2, reps: "10", notes: "" },
            { name: "Row", sets: 2, reps: "10", notes: "" }
          ]
        }
      ]
    },
    9: {
      phase: "Performance Phase",
      focus: "Back to building, Stack speed push",
      workouts: [
        { day: "Monday", type: "TPI Power & Stack", duration: "45 min", description: "Speed and power", hasStack: true, stackProtocol: "speed", stackSwings: "40-45",
          exercises: [
            { name: "Jump Squats", sets: 3, reps: "8", notes: "" },
            { name: "KB Swings", sets: 3, reps: "12", notes: "" },
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Max Effort", sets: 3, reps: "5 swings", notes: "Go for PR!" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run", duration: "50 min", description: "Building back", hasStack: true, stackProtocol: "speed", stackSwings: "45",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Speed Test", sets: 2, reps: "5 max effort", notes: "" },
            { name: "Continuous Jog", sets: 2, reps: "12 min each", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength", duration: "40 min", description: "Upper body",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "8", notes: "" },
            { name: "Bent Over Row", sets: 4, reps: "8", notes: "" },
            { name: "Shoulder Press", sets: 3, reps: "10", notes: "" }
          ]
        }
      ]
    },
    10: {
      phase: "Performance Phase",
      focus: "15 min continuous, Stack goals",
      workouts: [
        { day: "Monday", type: "Mobility & Stack", duration: "45 min", description: "Core + speed", hasStack: true, stackProtocol: "superspeed", stackSwings: "40",
          exercises: [
            { name: "McGill Big 3", sets: 3, reps: "10 each", notes: "" },
            { name: "Stack - SuperSpeed", sets: 3, reps: "5 each stick", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run Milestone", duration: "55 min", description: "15 min continuous!", hasStack: true, stackProtocol: "speed", stackSwings: "45",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Max Effort", sets: 2, reps: "5 swings", notes: "" },
            { name: "Continuous Jog", sets: 1, reps: "15 min", notes: "MILESTONE!" },
            { name: "Walk", sets: 1, reps: "2 min", notes: "" },
            { name: "Continuous Jog", sets: 1, reps: "10 min", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength - Lower", duration: "40 min", description: "Leg strength",
          exercises: [
            { name: "Squat", sets: 4, reps: "6", notes: "" },
            { name: "RDL", sets: 4, reps: "8", notes: "" },
            { name: "Hip Thrust", sets: 3, reps: "12", notes: "" }
          ]
        }
      ]
    },
    11: {
      phase: "Performance Phase",
      focus: "Consistent training, peak Stack",
      workouts: [
        { day: "Monday", type: "TPI & Stack Power", duration: "45 min", description: "Golf conditioning + max speed", hasStack: true, stackProtocol: "speed", stackSwings: "45",
          exercises: [
            { name: "Rotational Med Ball", sets: 4, reps: "8 each", notes: "" },
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Stack - Max Effort", sets: 3, reps: "5 swings", notes: "Peak speed!" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run", duration: "55 min", description: "Endurance + speed", hasStack: true, stackProtocol: "speed", stackSwings: "45",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Continuous Jog", sets: 2, reps: "15 min each", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength - Full Body", duration: "45 min", description: "Compound strength",
          exercises: [
            { name: "Deadlift", sets: 4, reps: "5", notes: "" },
            { name: "Bench Press", sets: 4, reps: "8", notes: "" },
            { name: "Pull-ups/Lat Pulldown", sets: 4, reps: "8", notes: "" }
          ]
        }
      ]
    },
    12: {
      phase: "Performance Phase",
      focus: "20 min continuous! Maintain Stack",
      workouts: [
        { day: "Monday", type: "Mobility & Stack", duration: "40 min", description: "Recovery + maintain speed", hasStack: true, stackProtocol: "superspeed", stackSwings: "35",
          exercises: [
            { name: "Foam Roll", sets: 1, reps: "10 min", notes: "" },
            { name: "Stack - Maintenance", sets: 2, reps: "5 each stick", notes: "" },
            { name: "TPI Stretches", sets: 1, reps: "10 min", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Run Milestone", duration: "55 min", description: "20 min continuous!", hasStack: true, stackProtocol: "speed", stackSwings: "40",
          exercises: [
            { name: "Stack - Full Protocol", sets: 3, reps: "5 each stick", notes: "" },
            { name: "Continuous Jog", sets: 1, reps: "20 min", notes: "BIG MILESTONE!" },
            { name: "Easy Jog", sets: 1, reps: "8 min", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength - Golf Power", duration: "40 min", description: "Rotational power",
          exercises: [
            { name: "Trap Bar Deadlift", sets: 4, reps: "5", notes: "" },
            { name: "KB Swings", sets: 4, reps: "12", notes: "" },
            { name: "Cable Rotation", sets: 3, reps: "12 each", notes: "" }
          ]
        }
      ]
    },
    13: {
      phase: "Maintenance & Golf Prep",
      focus: "Maintain gains, golf season prep",
      workouts: [
        { day: "Monday", type: "TPI & Stack", duration: "40 min", description: "Golf-specific + speed", hasStack: true, stackProtocol: "speed", stackSwings: "35",
          exercises: [
            { name: "TPI Assessment", sets: 1, reps: "15 min", notes: "" },
            { name: "Stack - Maintenance", sets: 2, reps: "5 each stick", notes: "" },
            { name: "Golf Swing Prep", sets: 1, reps: "10 min", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Cardio", duration: "50 min", description: "Maintain fitness + speed", hasStack: true, stackProtocol: "speed", stackSwings: "35",
          exercises: [
            { name: "Stack - Full Protocol", sets: 2, reps: "5 each stick", notes: "" },
            { name: "Continuous Jog", sets: 1, reps: "25 min", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength - Maintenance", duration: "35 min", description: "Maintain strength",
          exercises: [
            { name: "Squat", sets: 3, reps: "8", notes: "" },
            { name: "Bench Press", sets: 3, reps: "8", notes: "" },
            { name: "Row", sets: 3, reps: "10", notes: "" }
          ]
        }
      ]
    },
    14: {
      phase: "Maintenance & Golf Prep",
      focus: "Consistent maintenance",
      workouts: [
        { day: "Monday", type: "Mobility & Stack", duration: "40 min", description: "Keep mobile + speed", hasStack: true, stackProtocol: "overspeed", stackSwings: "30",
          exercises: [
            { name: "Foam Rolling", sets: 1, reps: "10 min", notes: "" },
            { name: "TPI Full Routine", sets: 1, reps: "15 min", notes: "" },
            { name: "Stack - Light", sets: 2, reps: "5 each stick", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Cardio", duration: "50 min", description: "Steady state + speed", hasStack: true, stackProtocol: "speed", stackSwings: "30",
          exercises: [
            { name: "Stack - Maintenance", sets: 2, reps: "5 each stick", notes: "" },
            { name: "Continuous Jog", sets: 1, reps: "30 min", notes: "30 min milestone!" }
          ]
        },
        { day: "Saturday", type: "Strength", duration: "35 min", description: "Efficient full body",
          exercises: [
            { name: "Deadlift", sets: 3, reps: "5", notes: "" },
            { name: "Push-ups", sets: 3, reps: "10", notes: "" },
            { name: "Rows", sets: 3, reps: "10", notes: "" }
          ]
        }
      ]
    },
    15: {
      phase: "Golf Season Ready",
      focus: "Taper, maintain Stack",
      workouts: [
        { day: "Monday", type: "TPI & Stack", duration: "35 min", description: "Pre-season mobility + speed", hasStack: true, stackProtocol: "speed", stackSwings: "25",
          exercises: [
            { name: "Full TPI Routine", sets: 1, reps: "20 min", notes: "" },
            { name: "Stack - Performance", sets: 2, reps: "5 each stick", notes: "" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Easy Run", duration: "40 min", description: "Maintain base + speed", hasStack: true, stackProtocol: "speed", stackSwings: "25",
          exercises: [
            { name: "Stack - Maintenance", sets: 2, reps: "5 each stick", notes: "" },
            { name: "Easy Run", sets: 1, reps: "25-30 min", notes: "" }
          ]
        },
        { day: "Saturday", type: "Light Strength", duration: "30 min", description: "Maintain",
          exercises: [
            { name: "Goblet Squat", sets: 2, reps: "10", notes: "" },
            { name: "Push-ups", sets: 2, reps: "12", notes: "" },
            { name: "Rows", sets: 2, reps: "12", notes: "" }
          ]
        }
      ]
    },
    16: {
      phase: "Golf Season Ready",
      focus: "Ready for competition! Stack ready",
      workouts: [
        { day: "Monday", type: "TPI & Stack", duration: "30 min", description: "Keep mobile + speed ready", hasStack: true, stackProtocol: "speed", stackSwings: "20",
          exercises: [
            { name: "TPI Stretches", sets: 1, reps: "20 min", notes: "" },
            { name: "Stack - Pre-Season Check", sets: 2, reps: "5 each stick", notes: "Ready for course!" }
          ]
        },
        { day: "Tuesday", type: "Basketball", duration: "60-90 min", description: "Tuesday night basketball",
          exercises: [{ name: "Basketball Game", sets: 1, reps: "Full session", notes: "" }]
        },
        { day: "Thursday", type: "Stack & Cardio", duration: "40 min", description: "Maintain + speed ready", hasStack: true, stackProtocol: "speed", stackSwings: "20",
          exercises: [
            { name: "Stack - Quick Session", sets: 2, reps: "5 each stick", notes: "Keep speeds sharp!" },
            { name: "Easy Run", sets: 1, reps: "25-30 min", notes: "" }
          ]
        },
        { day: "Saturday", type: "Strength - Maintenance", duration: "30 min", description: "Prep for golf",
          exercises: [
            { name: "Full Body Circuit", sets: 2, reps: "8-10 each", notes: "" },
            { name: "Rotational Work", sets: 2, reps: "10 each", notes: "" }
          ]
        }
      ]
    }
  };

  const getWorkoutKey = (week, day, exercise) => `${week}-${day}-${exercise}`;

  const logExercise = (week, day, exerciseIndex, data) => {
    const key = getWorkoutKey(week, day, exerciseIndex);
    setExerciseLogs(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
  };

  const markWorkoutComplete = (week, day) => {
    const key = `${week}-${day}`;
    setWorkouts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addRunEntry = () => {
    if (newRunEntry.date && newRunEntry.distance) {
      setRunningLog(prev => [...prev, { ...newRunEntry, id: Date.now() }]);
      setNewRunEntry({ date: '', distance: '', type: 'walk', notes: '' });
    }
  };

  const addWeightEntry = () => {
    if (newWeightEntry.date && newWeightEntry.weight) {
      setWeightLog(prev => [...prev, { ...newWeightEntry, id: Date.now() }]);
      setNewWeightEntry({ date: '', weight: '' });
    }
  };

  const addStackEntry = () => {
    if (newStackEntry.date && newStackEntry.maxSpeed) {
      setStackLog(prev => [...prev, { ...newStackEntry, id: Date.now() }]);
      setNewStackEntry({ date: '', maxSpeed: '', avgSpeed: '', protocol: 'speed', swings: '', notes: '' });
    }
  };

  const deleteRunEntry = (id) => setRunningLog(prev => prev.filter(e => e.id !== id));
  const deleteWeightEntry = (id) => setWeightLog(prev => prev.filter(e => e.id !== id));
  const deleteStackEntry = (id) => setStackLog(prev => prev.filter(e => e.id !== id));

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStackSessionsThisWeek = () => {
    const weekWorkouts = weeklyProgram[currentWeek]?.workouts || [];
    return weekWorkouts.filter(w => w.hasStack).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-6">
        <h1 className="text-2xl font-bold tracking-tight">2026 Transformation Portal</h1>
        <p className="text-amber-100 text-sm mt-1">Offseason Weight Loss • Golf Prep • Speed Training</p>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">Weight</span>
            </div>
            <p className="text-xl font-bold mt-1">{currentWeight}</p>
            <p className="text-xs text-amber-100">{weightLost > 0 ? `-${weightLost} lbs` : 'Start'}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <Footprints className="w-4 h-4" />
              <span className="text-xs">Miles</span>
            </div>
            <p className="text-xl font-bold mt-1">{totalMiles.toFixed(1)}</p>
            <p className="text-xs text-amber-100">/{goalMiles} goal</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Speed</span>
            </div>
            <p className="text-xl font-bold mt-1">{latestStackSpeed}</p>
            <p className="text-xs text-amber-100">{speedGain > 0 ? `+${speedGain.toFixed(1)} mph` : 'Baseline'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b bg-white sticky top-0 z-10 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Home', icon: Activity },
          { id: 'workouts', label: 'Workouts', icon: Dumbbell },
          { id: 'stack', label: 'Stack', icon: Zap },
          { id: 'running', label: 'Running', icon: Footprints },
          { id: 'weight', label: 'Weight', icon: TrendingDown }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-medium flex flex-col items-center justify-center gap-1 min-w-[70px] ${
              activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Your 16-Week Program</h3>
              <div className="grid grid-cols-4 gap-2">
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(week => {
                  const weekData = weeklyProgram[week];
                  const isCurrentWeek = week === currentWeek;
                  const workoutsThisWeek = weekData?.workouts?.length || 0;
                  const completedThisWeek = weekData?.workouts?.filter(w => workouts[`${week}-${w.day}`]).length || 0;
                  
                  return (
                    <button
                      key={week}
                      onClick={() => { setCurrentWeek(week); setActiveTab('workouts'); }}
                      className={`p-2 rounded-lg text-center transition-all ${
                        isCurrentWeek 
                          ? 'bg-orange-500 text-white ring-2 ring-orange-300' 
                          : completedThisWeek === workoutsThisWeek && workoutsThisWeek > 0
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-xs font-medium">Wk {week}</div>
                      <div className="text-xs opacity-75">{completedThisWeek}/{workoutsThisWeek}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Week {currentWeek}</h3>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {weeklyProgram[currentWeek]?.phase}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{weeklyProgram[currentWeek]?.focus}</p>
              
              <div className="space-y-2">
                {weeklyProgram[currentWeek]?.workouts?.map((workout, idx) => {
                  const isComplete = workouts[`${currentWeek}-${workout.day}`];
                  return (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${isComplete ? 'bg-orange-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => markWorkoutComplete(currentWeek, workout.day)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isComplete ? 'bg-orange-500 text-white' : 'border-2 border-gray-300'
                          }`}
                        >
                          {isComplete && <Check className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{workout.day}</p>
                            {workout.hasStack && (
                              <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Stack
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{workout.type} • {workout.duration}</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('workouts')} className="text-orange-600 text-sm">View</button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Log</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setActiveTab('stack')} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">Log Speed</span>
                </button>
                <button onClick={() => setActiveTab('running')} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700">
                  <Footprints className="w-5 h-5" />
                  <span className="text-sm font-medium">Log Miles</span>
                </button>
                <button onClick={() => setActiveTab('weight')} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg text-purple-700">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-sm font-medium">Log Weight</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold">Stack Speed Training</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{latestStackSpeed} mph</p>
                  <p className="text-red-100 text-sm">Current Driver Speed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">~{estimatedCarry} yds</p>
                  <p className="text-red-100 text-sm">Est. Carry Distance</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress to {goalSpeed} mph</span>
                  <span>{speedGain > 0 ? `+${speedGain.toFixed(1)} mph` : 'Baseline'}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${Math.max(0, speedProgress)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Recovery-First Principles</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Movement is medicine - consistency over intensity</li>
                <li>• Rest days are growth days</li>
                <li>• Listen to your body, not just the plan</li>
                <li>• Progress isn't linear - trust the process</li>
              </ul>
            </div>
          </div>
        )}

        {/* Workouts Tab */}
        {activeTab === 'workouts' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(week => (
                <button
                  key={week}
                  onClick={() => setCurrentWeek(week)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    currentWeek === week ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Week {week}
                </button>
              ))}
            </div>

            <div className="bg-orange-50 rounded-lg p-3">
              <p className="font-medium text-orange-800">{weeklyProgram[currentWeek]?.phase}</p>
              <p className="text-sm text-orange-600">{weeklyProgram[currentWeek]?.focus}</p>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-600">{getStackSessionsThisWeek()} Stack sessions this week</span>
              </div>
            </div>

            {weeklyProgram[currentWeek]?.workouts?.map((workout, workoutIdx) => {
              const workoutKey = `${currentWeek}-${workout.day}`;
              const isComplete = workouts[workoutKey];
              const isExpanded = expandedWorkout === workoutKey;

              return (
                <div key={workoutIdx} className={`bg-white rounded-xl shadow-sm overflow-hidden ${isComplete ? 'ring-2 ring-orange-500' : ''}`}>
                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedWorkout(isExpanded ? null : workoutKey)}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); markWorkoutComplete(currentWeek, workout.day); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isComplete ? 'bg-orange-500 text-white' : 'border-2 border-gray-300 hover:border-orange-500'
                        }`}
                      >
                        {isComplete && <Check className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{workout.day}: {workout.type}</p>
                          {workout.hasStack && <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded flex items-center gap-1"><Zap className="w-3 h-3" /></span>}
                        </div>
                        <p className="text-sm text-gray-500">{workout.duration} • {workout.exercises.length} exercises</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>

                  {isExpanded && (
                    <div className="border-t px-4 py-3 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                      
                      {workout.hasStack && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-red-700 text-sm">Stack Training: {workout.stackSwings} swings</span>
                          </div>
                          <p className="text-xs text-red-600">Protocol: {stackProtocols[workout.stackProtocol]?.name}</p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {workout.exercises.map((exercise, exIdx) => {
                          const exKey = getWorkoutKey(currentWeek, workout.day, exIdx);
                          const exLog = exerciseLogs[exKey] || {};
                          const isStackExercise = exercise.name.toLowerCase().includes('stack');
                          
                          return (
                            <div key={exIdx} className={`bg-white p-3 rounded-lg ${isStackExercise ? 'border-l-4 border-red-400' : ''}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{exercise.name}</p>
                                    {isStackExercise && <Zap className="w-3 h-3 text-red-500" />}
                                  </div>
                                  <p className="text-xs text-gray-500">{exercise.sets} sets × {exercise.reps}{exercise.notes && ` • ${exercise.notes}`}</p>
                                </div>
                                <button
                                  onClick={() => logExercise(currentWeek, workout.day, exIdx, { completed: !exLog.completed })}
                                  className={`w-6 h-6 rounded flex items-center justify-center ${exLog.completed ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                                >
                                  {exLog.completed && <Check className="w-4 h-4" />}
                                </button>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <input
                                  type="text"
                                  placeholder={isStackExercise ? "Max speed (mph)" : "Weight used"}
                                  value={exLog.weight || ''}
                                  onChange={(e) => logExercise(currentWeek, workout.day, exIdx, { weight: e.target.value })}
                                  className="flex-1 text-xs p-2 border rounded"
                                />
                                <input
                                  type="text"
                                  placeholder="Notes"
                                  value={exLog.notes || ''}
                                  onChange={(e) => logExercise(currentWeek, workout.day, exIdx, { notes: e.target.value })}
                                  className="flex-1 text-xs p-2 border rounded"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stack Tab */}
        {activeTab === 'stack' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6" />
                <h3 className="font-bold text-lg">Stack Speed Training</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-4xl font-bold">{latestStackSpeed} mph</div>
                  <p className="text-red-100 text-sm">Max Driver Speed</p>
                </div>
                <div>
                  <div className="text-4xl font-bold">~{estimatedCarry}</div>
                  <p className="text-red-100 text-sm">Est. Carry (yards)</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Goal: {goalSpeed} mph</span>
                  <span>{speedGain > 0 ? `+${speedGain.toFixed(1)} mph gained` : 'Baseline'}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${Math.max(0, speedProgress)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                Distance Potential
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Baseline</p>
                  <p className="text-lg font-bold text-gray-700">{baselineSpeed} mph</p>
                  <p className="text-xs text-gray-400">~{Math.round(baselineSpeed * 2.5)} yds</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <p className="text-xs text-orange-600">Current</p>
                  <p className="text-lg font-bold text-orange-700">{latestStackSpeed} mph</p>
                  <p className="text-xs text-orange-500">~{estimatedCarry} yds</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Goal</p>
                  <p className="text-lg font-bold text-gray-700">{goalSpeed} mph</p>
                  <p className="text-xs text-gray-400">~{Math.round(goalSpeed * 2.5)} yds</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Based on ~2.5 yards carry per mph of club head speed</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Log Speed Session</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={newStackEntry.date} onChange={(e) => setNewStackEntry(prev => ({ ...prev, date: e.target.value }))} className="p-2 border rounded-lg text-sm" />
                <input type="number" step="0.1" placeholder="Max Speed (mph)" value={newStackEntry.maxSpeed} onChange={(e) => setNewStackEntry(prev => ({ ...prev, maxSpeed: e.target.value }))} className="p-2 border rounded-lg text-sm" />
                <input type="number" step="0.1" placeholder="Avg Speed (mph)" value={newStackEntry.avgSpeed} onChange={(e) => setNewStackEntry(prev => ({ ...prev, avgSpeed: e.target.value }))} className="p-2 border rounded-lg text-sm" />
                <select value={newStackEntry.protocol} onChange={(e) => setNewStackEntry(prev => ({ ...prev, protocol: e.target.value }))} className="p-2 border rounded-lg text-sm">
                  <option value="speed">Speed Protocol</option>
                  <option value="overspeed">Overspeed Protocol</option>
                  <option value="superspeed">SuperSpeed Protocol</option>
                </select>
                <input type="number" placeholder="Total Swings" value={newStackEntry.swings} onChange={(e) => setNewStackEntry(prev => ({ ...prev, swings: e.target.value }))} className="p-2 border rounded-lg text-sm" />
                <button onClick={addStackEntry} className="bg-red-500 text-white rounded-lg font-medium text-sm">Add</button>
              </div>
              <input type="text" placeholder="Notes (optional)" value={newStackEntry.notes} onChange={(e) => setNewStackEntry(prev => ({ ...prev, notes: e.target.value }))} className="w-full mt-3 p-2 border rounded-lg text-sm" />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Speed History</h3>
              {stackLog.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No sessions logged yet</p>
              ) : (
                <div className="space-y-2">
                  {[...stackLog].reverse().map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg text-red-600">{entry.maxSpeed} mph</p>
                          {entry.avgSpeed && <span className="text-xs text-gray-500">(avg: {entry.avgSpeed})</span>}
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(entry.date)} • {stackProtocols[entry.protocol]?.name || entry.protocol}{entry.swings && ` • ${entry.swings} swings`}</p>
                        {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                      </div>
                      <button onClick={() => deleteStackEntry(entry.id)} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">Speed Milestones</h3>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center gap-2 ${latestStackSpeed >= 107 ? 'text-red-600' : 'text-gray-500'}`}>
                  {latestStackSpeed >= 107 ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>107 mph - First gains! (+2 mph)</span>
                </div>
                <div className={`flex items-center gap-2 ${latestStackSpeed >= 110 ? 'text-red-600' : 'text-gray-500'}`}>
                  {latestStackSpeed >= 110 ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>110 mph - Solid progress! (+5 mph)</span>
                </div>
                <div className={`flex items-center gap-2 ${latestStackSpeed >= 112 ? 'text-red-600' : 'text-gray-500'}`}>
                  {latestStackSpeed >= 112 ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>112 mph - Breaking through! (+7 mph)</span>
                </div>
                <div className={`flex items-center gap-2 ${latestStackSpeed >= 115 ? 'text-red-600' : 'text-gray-500'}`}>
                  {latestStackSpeed >= 115 ? <Award className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span className="font-medium">115 mph - GOAL ACHIEVED! (+10 mph)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">Stack Training Tips</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Always warm up before speed work</li>
                <li>• Focus on form before max effort</li>
                <li>• Rest 45-60s between max swings</li>
                <li>• Track every session for progress</li>
                <li>• Speed gains transfer to the course!</li>
              </ul>
            </div>
          </div>
        )}

        {/* Running Tab */}
        {activeTab === 'running' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Footprints className="w-6 h-6" />
                <h3 className="font-bold text-lg">100 Mile Challenge</h3>
              </div>
              <div className="text-4xl font-bold">{totalMiles.toFixed(1)} mi</div>
              <p className="text-blue-100 text-sm">{(goalMiles - totalMiles).toFixed(1)} miles remaining</p>
              <div className="w-full bg-white/30 rounded-full h-3 mt-3">
                <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${milesProgress}%` }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Log Activity</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={newRunEntry.date} onChange={(e) => setNewRunEntry(prev => ({ ...prev, date: e.target.value }))} className="p-2 border rounded-lg text-sm" />
                <input type="number" step="0.1" placeholder="Miles" value={newRunEntry.distance} onChange={(e) => setNewRunEntry(prev => ({ ...prev, distance: e.target.value }))} className="p-2 border rounded-lg text-sm" />
                <select value={newRunEntry.type} onChange={(e) => setNewRunEntry(prev => ({ ...prev, type: e.target.value }))} className="p-2 border rounded-lg text-sm">
                  <option value="walk">Walk</option>
                  <option value="run">Run</option>
                  <option value="walk-run">Walk/Run</option>
                </select>
                <button onClick={addRunEntry} className="bg-blue-500 text-white rounded-lg font-medium text-sm">Add</button>
              </div>
              <input type="text" placeholder="Notes (optional)" value={newRunEntry.notes} onChange={(e) => setNewRunEntry(prev => ({ ...prev, notes: e.target.value }))} className="w-full mt-3 p-2 border rounded-lg text-sm" />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Activity Log</h3>
              {runningLog.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No activities logged yet</p>
              ) : (
                <div className="space-y-2">
                  {[...runningLog].reverse().map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{entry.distance} miles</p>
                        <p className="text-xs text-gray-500">{formatDate(entry.date)} • {entry.type}</p>
                        {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                      </div>
                      <button onClick={() => deleteRunEntry(entry.id)} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Running Milestones</h3>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center gap-2 ${totalMiles >= 10 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {totalMiles >= 10 ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>10 miles - Getting started!</span>
                </div>
                <div className={`flex items-center gap-2 ${totalMiles >= 25 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {totalMiles >= 25 ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>25 miles - Quarter way!</span>
                </div>
                <div className={`flex items-center gap-2 ${totalMiles >= 50 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {totalMiles >= 50 ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>50 miles - Halfway champion!</span>
                </div>
                <div className={`flex items-center gap-2 ${totalMiles >= 75 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {totalMiles >= 75 ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>75 miles - Home stretch!</span>
                </div>
                <div className={`flex items-center gap-2 ${totalMiles >= 100 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {totalMiles >= 100 ? <Award className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span className="font-medium">100 miles - GOAL ACHIEVED!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weight Tab */}
        {activeTab === 'weight' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-6 h-6" />
                <h3 className="font-bold text-lg">Weight Journey</h3>
              </div>
              <div className="text-4xl font-bold">{currentWeight} lbs</div>
              <p className="text-purple-100 text-sm">{weightLost > 0 ? `${weightLost} lbs lost • ` : ''}Goal: {goalWeight} lbs</p>
              <div className="w-full bg-white/30 rounded-full h-3 mt-3">
                <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${weightProgress}%` }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Log Weight</h3>
              <div className="flex gap-3">
                <input type="date" value={newWeightEntry.date} onChange={(e) => setNewWeightEntry(prev => ({ ...prev, date: e.target.value }))} className="flex-1 p-2 border rounded-lg text-sm" />
                <input type="number" step="0.1" placeholder="Weight (lbs)" value={newWeightEntry.weight} onChange={(e) => setNewWeightEntry(prev => ({ ...prev, weight: e.target.value }))} className="flex-1 p-2 border rounded-lg text-sm" />
                <button onClick={addWeightEntry} className="bg-purple-500 text-white px-4 rounded-lg font-medium text-sm">Add</button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Weight History</h3>
              <div className="space-y-2">
                {[...weightLog].reverse().map((entry, idx) => (
                  <div key={entry.id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{entry.weight} lbs</p>
                      <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                    </div>
                    {entry.id && <button onClick={() => deleteWeightEntry(entry.id)} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <h3 className="font-semibold text-rose-800 mb-2">Gentle Reminder</h3>
              <p className="text-sm text-rose-700">
                Weight fluctuates daily due to water, food, and many other factors. 
                The overall trend matters more than any single number. Be kind to yourself, 
                and trust the process you're working on with your care team.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 text-center text-xs text-gray-400">
        <p>Built with love for the 2026 golf season</p>
        <p>Three-peat incoming! 🏆🏆🏆</p>
      </div>
    </div>
  );
};

export default HealthPortal;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HealthPortal />);
