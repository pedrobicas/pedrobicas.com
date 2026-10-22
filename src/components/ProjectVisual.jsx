import { toBits } from '../utils/text.js';
import ProjectMedia from './ProjectMedia.jsx';

function WireVisual({ project, uid }) {
  const text = 'PEDRO BICAS ';
  const bitWidth = 12;
  const top = 214;
  const bottom = 262;
  const bits = [];

  for (const char of text) {
    bits.push({ value: 0, char });
    for (const bit of toBits(char)) bits.push({ value: Number(bit) });
    bits.push({ value: 1 }, { value: 1 });
  }

  let x = 0;
  let path = `M 0 ${top}`;
  const labels = [];
  bits.forEach((bit, index) => {
    const y = bit.value ? top : bottom;
    path += ` L ${x} ${y} L ${x + bitWidth} ${y}`;
    if (bit.char && bit.char !== ' ') labels.push({ char: bit.char, x: x + 3, key: index });
    x += bitWidth;
  });

  const fadeId = `wvfade-${uid}`;
  const clipId = `wvclip-${uid}`;
  const strip = (key) => (
    <>
      <path className="wv-line" d={path} key={`${key}-path`} />
      {labels.map((label) => (
        <text className="wv-ch" x={label.x} y={top - 16} key={`${key}-${label.key}`}>
          {label.char}
        </text>
      ))}
    </>
  );

  return (
    <svg viewBox="0 0 640 480" data-project-visual={project.slug}>
      <defs>
        <linearGradient id={fadeId} x1="0" x2="1">
          <stop offset="0" stopColor="#050913" />
          <stop offset=".3" stopColor="#050913" stopOpacity="0" />
          <stop offset=".86" stopColor="#050913" stopOpacity="0" />
          <stop offset="1" stopColor="#050913" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="640" height="480" />
        </clipPath>
      </defs>
      <text className="vz-label" x="40" y="52">
        pedrobicas.com
      </text>
      <text className="vz-label vz-accent" x="600" y="52" textAnchor="end">
        transmitindo
      </text>
      <g clipPath={`url(#${clipId})`}>
        <g className="wv-track">
          {strip('first')}
          <g transform={`translate(${x} 0)`}>{strip('second')}</g>
        </g>
      </g>
      <rect y="160" width="640" height="150" fill={`url(#${fadeId})`} />
      <line className="wv-probe" x1="520" x2="520" y1="150" y2="300" />
      <text className="wv-big" x="40" y="400">
        01010000
      </text>
      <text className="vz-label" x="40" y="430">
        P, o primeiro byte
      </text>
    </svg>
  );
}

export function ProjectVisualContent({ project, uid = project.slug }) {
  if (project.media) return <ProjectMedia project={project} />;
  return <WireVisual project={project} uid={uid} />;
}

export default function ProjectVisual({ project, uid, className = 'viz', ariaHidden = true }) {
  return (
    <div className={className} aria-hidden={ariaHidden ? 'true' : undefined}>
      <ProjectVisualContent project={project} uid={uid} />
    </div>
  );
}
