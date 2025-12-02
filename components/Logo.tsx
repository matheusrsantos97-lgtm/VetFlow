import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Base Shape: Heart/Shield representing care */}
    {/* Left Side: Cat (Pointy Ear) */}
    {/* Right Side: Dog (Floppy Ear) */}
    <path 
      d="M50 25 
         C 45 25 40 15 30 15 
         L 25 5 
         L 20 15 
         C 10 15 5 25 5 40 
         C 5 65 30 80 50 95 
         C 70 80 95 65 95 40 
         C 95 25 90 15 80 15 
         C 70 15 65 20 60 25 
         L 50 25 Z" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinejoin="round"
    />
    
    {/* Veterinary Cross (Negative Space) */}
    <path 
      d="M50 35 V 65 M 35 50 H 65" 
      stroke="var(--vet-bg, #0D0F16)" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
  </svg>
);