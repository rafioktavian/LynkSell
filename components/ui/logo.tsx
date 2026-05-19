import React from 'react';

export function Logo({ className, fill, ...props }: React.SVGProps<SVGSVGElement> & { fill?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className || "text-indigo-600"}
      {...props}
    >
      <mask id="hole-cutout">
        <rect width="64" height="64" fill="white" />
        <circle cx="23" cy="28" r="3.5" fill="black" />
      </mask>
      
      {/* Background */}
      <rect width="64" height="64" rx="32" fill={fill || "currentColor"} />
      
      {/* White Square */}
      <rect x="13" y="18" width="18" height="18" rx="4.5" fill="white" />
      
      {/* Light Purple Square (overlapping) */}
      <rect 
        x="23" 
        y="28" 
        width="18" 
        height="18" 
        rx="4.5" 
        className="fill-indigo-300/80" 
        mask="url(#hole-cutout)" 
      />
      
      {/* Arrow */}
      <g stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="45" y1="18" x2="45" y2="42" />
        <path d="M38 25 L45 18 L52 25" />
      </g>
    </svg>
  );
}
