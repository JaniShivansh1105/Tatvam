"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Play, Square, Settings2, Info } from "lucide-react";

export function PhysicsVectorVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mass, setMass] = useState(10);
  const [force, setForce] = useState(50);
  const [containerWidth, setContainerWidth] = useState(600);
  const controls = useAnimation();

  // Acceleration = Force / Mass
  const acceleration = force / mass;
  // Physically accurate time = sqrt(2 * distance / acceleration)
  // We use a base distance unit to scale the duration properly
  const distance = 40; // max distance marker
  const duration = Math.max(0.5, Math.sqrt((2 * distance) / (acceleration || 1)));

  useEffect(() => {
    // Update container width dynamically to prevent overlap
    const updateWidth = () => {
      const container = document.getElementById('physics-container');
      if (container) setContainerWidth(container.clientWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const objectWidth = Math.max(40, mass * 3);
    const maxTravel = containerWidth - objectWidth - 40; // 40 is initial left padding

    if (isPlaying) {
      controls.start({
        x: [0, maxTravel > 0 ? maxTravel : 300],
        // easeIn approximates constant acceleration (v = at)
        transition: { duration, ease: "easeIn" }
      });
    } else {
      controls.stop();
      controls.set({ x: 0 });
    }
  }, [isPlaying, controls, duration, containerWidth, mass]);

  const explanation = acceleration > 5 
    ? "High force on low mass results in rapid acceleration."
    : acceleration < 2 
    ? "High mass resists the force, resulting in sluggish movement (High Inertia)."
    : "Balanced push. The object accelerates steadily.";

  return (
    <div className="my-10 bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-[#F8F9FF] border-b border-[#E2E8F0] flex items-center justify-between">
        <h4 className="text-[14px] font-bold text-[#1B1D35]">Interactive Simulation: F = ma</h4>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#E2E8F0]">
          <button 
            onClick={() => setIsPlaying(true)}
            className={`p-1.5 rounded-md transition-colors ${isPlaying ? "bg-[#E5E1FF] text-[#6C5CE7]" : "text-[#A0AEC0] hover:text-[#4A5568]"}`}
            title="Play"
          >
            <Play className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsPlaying(false)}
            className={`p-1.5 rounded-md transition-colors ${!isPlaying ? "bg-[#FEE2E2] text-[#EF4444]" : "text-[#A0AEC0] hover:text-[#4A5568]"}`}
            title="Reset"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Simulation Area */}
      <div id="physics-container" className="h-[200px] bg-[#F7FAFC] relative overflow-hidden flex items-center border-b border-[#E2E8F0]">
        
        {/* Distance Markers */}
        <div className="absolute bottom-0 w-full flex justify-between px-10 text-[10px] text-[#A0AEC0] font-mono pb-2">
          <span>0m</span>
          <span>10m</span>
          <span>20m</span>
          <span>30m</span>
          <span>40m</span>
        </div>

        <motion.div 
          animate={controls}
          className="absolute left-10 flex flex-col items-center z-10"
        >
          {/* Force Vector */}
          {force > 0 && (
            <div className="relative mb-2">
              <div 
                className="h-1 bg-[#FC8181] rounded-full flex items-center origin-left transition-all"
                style={{ width: `${force}px` }}
              >
                <div className="absolute right-0 w-3 h-3 border-t-2 border-r-2 border-[#FC8181] rotate-45 translate-x-[1px]" />
              </div>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#FC8181]">
                F={force}N
              </span>
            </div>
          )}

          {/* Mass Object */}
          <div 
            className="bg-[#6C5CE7] rounded-xl flex items-center justify-center text-white font-bold transition-all shadow-md"
            style={{ 
              width: `${Math.max(40, mass * 3)}px`, 
              height: `${Math.max(40, mass * 3)}px`,
              opacity: isPlaying ? 0.9 : 1 
            }}
          >
            {mass}kg
          </div>
        </motion.div>
      </div>

      {/* Controls & Feedback */}
      <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#4A5568] flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#A0AEC0]" />
                Mass (Inertia)
              </label>
              <span className="text-[13px] font-mono font-bold text-[#6C5CE7]">{mass} kg</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={mass} 
              onChange={(e) => { setMass(Number(e.target.value)); setIsPlaying(false); }}
              className="w-full h-2 bg-[#EDF2F7] rounded-lg appearance-none cursor-pointer accent-[#6C5CE7]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#4A5568] flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#A0AEC0]" />
                Applied Force
              </label>
              <span className="text-[13px] font-mono font-bold text-[#FC8181]">{force} N</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="10"
              value={force} 
              onChange={(e) => { setForce(Number(e.target.value)); setIsPlaying(false); }}
              className="w-full h-2 bg-[#EDF2F7] rounded-lg appearance-none cursor-pointer accent-[#FC8181]"
            />
          </div>
        </div>

        <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#E2E8F0] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#6C5CE7]" />
            <h5 className="text-[13px] font-bold text-[#1B1D35] uppercase tracking-wider">Educational Insight</h5>
          </div>
          <p className="text-[14px] text-[#4A5568] leading-relaxed">
            {explanation}
          </p>
          <div className="mt-3 text-[12px] font-mono text-[#A0AEC0]">
            a = {force} / {mass} = {acceleration.toFixed(2)} m/s²
          </div>
        </div>
      </div>
    </div>
  );
}
