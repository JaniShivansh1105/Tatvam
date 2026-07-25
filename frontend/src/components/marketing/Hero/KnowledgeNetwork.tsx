"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export function KnowledgeNetwork() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 20;
      const y = (e.clientY - top - height / 2) / 20;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const nodes = [
    { id: 0, cx: 50, cy: 50, r: 8, label: "Physics", color: "#6C5CE7" },
    { id: 1, cx: 150, cy: 80, r: 12, label: "Quantum", color: "#8B7CF6" },
    { id: 2, cx: 250, cy: 40, r: 6, label: "Math", color: "#A0AEC0" },
    { id: 3, cx: 100, cy: 180, r: 10, label: "Calculus", color: "#48BB78" },
    { id: 4, cx: 220, cy: 160, r: 14, label: "AI Core", color: "#ED8936" },
    { id: 5, cx: 320, cy: 120, r: 8, label: "Logic", color: "#FC8181" },
    { id: 6, cx: 180, cy: 250, r: 7, label: "Biology", color: "#3182CE" },
  ];

  const edges = [
    [0, 1], [1, 2], [1, 3], [1, 4], [3, 4], [4, 5], [4, 6]
  ];

  const isConnected = (n1: number, n2: number) => {
    return edges.some(([start, end]) => (start === n1 && end === n2) || (start === n2 && end === n1));
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg aspect-square mx-auto hidden lg:flex items-center justify-center">
      <motion.svg
        viewBox="0 0 400 300"
        className="w-full h-full overflow-visible drop-shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: mousePos.x,
          y: mousePos.y
        }}
        transition={{ duration: 1, type: "spring", stiffness: 50 }}
      >
        {/* Sweeping AI Scan Line */}
        <motion.line
          x1="0" y1="-50" x2="400" y2="-50"
          stroke="url(#scanGradient)"
          strokeWidth="100"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, 400, 0], opacity: [0, 0.15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ mixBlendMode: 'overlay' }}
        />

        {/* Draw Edges */}
        {edges.map(([start, end], i) => {
          const isHighlighted = hoveredNode !== null && (hoveredNode === start || hoveredNode === end);
          const strokeColor = isHighlighted ? "#6C5CE7" : "url(#edgeGradient)";
          const strokeOpacity = hoveredNode === null ? 0.3 : (isHighlighted ? 0.8 : 0.1);

          return (
            <g key={`edge-group-${i}`}>
              <motion.line
                x1={nodes[start].cx}
                y1={nodes[start].cy}
                x2={nodes[end].cx}
                y2={nodes[end].cy}
                stroke={strokeColor}
                strokeWidth="2"
                strokeOpacity={strokeOpacity}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
              />
              {/* Pulsing data transfer along edge */}
              <motion.circle
                r="2"
                fill="#6C5CE7"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%", opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: "linear" }}
                style={{
                  offsetPath: `path('M ${nodes[start].cx} ${nodes[start].cy} L ${nodes[end].cx} ${nodes[end].cy}')`
                } as React.CSSProperties}
              />
            </g>
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const isHighlighted = hoveredNode === null || hoveredNode === node.id || isConnected(hoveredNode, node.id);
          return (
            <g 
              key={`node-${node.id}`} 
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill={node.color}
                opacity={isHighlighted ? 1 : 0.2}
                initial={{ scale: 0 }}
                animate={{ scale: isHighlighted && hoveredNode === node.id ? 1.3 : 1 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="drop-shadow-md"
              />
              {/* Glowing ring for AI Core or hovered node */}
              {(node.id === 4 || hoveredNode === node.id) && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r + (hoveredNode === node.id ? 8 : 6)}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="2"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <motion.text
                x={node.cx}
                y={node.cy + node.r + 14}
                fontSize="11"
                fontWeight="700"
                fill={isHighlighted ? "#1B1D35" : "#A0AEC0"}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHighlighted ? 1 : 0.3 }}
                transition={{ delay: 0.1 }}
                style={{ pointerEvents: "none" }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C5CE7" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B7CF6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="50%" stopColor="#6C5CE7" stopOpacity="1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
