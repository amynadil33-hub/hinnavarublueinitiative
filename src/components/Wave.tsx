export function Wave({ className = '', color = '#ffffff', flip = false }: { className?: string; color?: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      style={flip ? { transform: 'rotate(180deg)' } : undefined}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L0,120Z"
      />
    </svg>
  );
}
