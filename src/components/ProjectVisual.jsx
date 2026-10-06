import { rng } from '../utils/math.js';
import { toBits } from '../utils/text.js';

function CryptoVisual({ project }) {
  const random = rng(11);
  const n = 26;
  let price = 100;
  const candles = [];

  for (let i = 0; i < n; i += 1) {
    const open = price;
    const close = open + (random() - 0.44) * 9;
    const high = Math.max(open, close) + random() * 4;
    const low = Math.min(open, close) - random() * 4;
    candles.push({ open, close, high, low });
    price = close;
  }

  const forecast = [];
  let next = price;
  for (let i = 1; i <= 7; i += 1) {
    next += 1.5 + (random() - 0.5) * 2.4;
    forecast.push(next);
  }

  const all = candles
    .flatMap((candle) => [candle.high, candle.low])
    .concat(
      forecast.map((value, index) => value + 3 + index * 1.6),
      forecast.map((value, index) => value - 3 - index * 1.6),
    );
  const min = Math.min(...all);
  const max = Math.max(...all);
  const x0 = 44;
  const x1 = 604;
  const y0 = 84;
  const y1 = 420;
  const step = (x1 - x0) / (n + 7);
  const y = (value) => Number((y1 - ((value - min) / (max - min)) * (y1 - y0)).toFixed(1));
  const lastX = x0 + step * (n - 0.5);
  const points = [[lastX, price]].concat(
    forecast.map((value, index) => [lastX + step * (index + 1), value]),
  );
  const upper = points.map(([px, value], index) => `${px.toFixed(1)},${y(value + index * 1.6 + 1)}`);
  const lower = points
    .map(([px, value], index) => `${px.toFixed(1)},${y(value - index * 1.6 - 1)}`)
    .reverse();

  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label="Ilustração: gráfico de velas com uma faixa de previsão"
      data-project-visual={project.slug}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const gridY = y0 + (index * (y1 - y0)) / 4;
        return <line className="vz-grid" x1={x0} x2={x1} y1={gridY} y2={gridY} key={gridY} />;
      })}
      <text className="vz-label" x={x0} y="52">BTC/USD</text>
      <text className="vz-label vz-accent" x={x1} y="52" textAnchor="end">previsão 7 dias</text>
      {candles.map((candle, index) => {
        const cx = x0 + step * (index + 0.5);
        const openY = y(candle.open);
        const closeY = y(candle.close);
        const top = Math.min(openY, closeY);
        const height = Math.max(2, Math.abs(openY - closeY));
        const className = `cd${candle.close >= candle.open ? ' up' : ''}${index === n - 1 ? ' last' : ''}`;
        return (
          <g className={className} style={{ '--i': index }} key={index}>
            <line x1={cx} x2={cx} y1={y(candle.high)} y2={y(candle.low)} />
            <rect x={(cx - 4.5).toFixed(1)} y={top.toFixed(1)} width="9" height={height.toFixed(1)} rx="1" />
          </g>
        );
      })}
      <polygon className="fc-band" points={upper.concat(lower).join(' ')} />
      <polyline className="fc-line" points={points.map(([px, value]) => `${px.toFixed(1)},${y(value)}`).join(' ')} />
      <line className="fc-now" x1={lastX} x2={lastX} y1={y0} y2={y1} />
    </svg>
  );
}

function UniverseVisual({ project }) {
  const random = rng(5);
  const cx = 320;
  const cy = 250;
  const orbits = [
    { rx: 96, d: 9, s: 6 },
    { rx: 154, d: 14, s: 9, b: true },
    { rx: 214, d: 21, s: 5 },
    { rx: 276, d: 30, s: 11, b: true },
  ];
  const stars = Array.from({ length: 46 }, (_, index) => ({
    index,
    cx: (random() * 640).toFixed(0),
    cy: (random() * 480).toFixed(0),
    r: (0.5 + random() * 1.1).toFixed(2),
    opacity: (0.25 + random() * 0.5).toFixed(2),
  }));

  return (
    <svg
      className="smil"
      viewBox="0 0 640 480"
      role="img"
      aria-label="Ilustração: planetas orbitando um centro"
      data-project-visual={project.slug}
    >
      {stars.map((star) => (
        <circle
          className="uv-star"
          style={{ '--i': star.index }}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          opacity={star.opacity}
          key={star.index}
        />
      ))}
      {orbits.map((orbit) => (
        <ellipse className="uv-orbit" cx={cx} cy={cy} rx={orbit.rx} ry={(orbit.rx * 0.38).toFixed(1)} key={orbit.rx} />
      ))}
      <circle className="uv-glow" cx={cx} cy={cy} r="56" />
      <circle className="uv-core" cx={cx} cy={cy} r="36" />
      <text className="uv-label" x={cx} y={cy + 5}>você</text>
      {orbits.map((orbit, index) => {
        const ry = (orbit.rx * 0.38).toFixed(1);
        const motionPath = `M ${cx - orbit.rx} ${cy} a ${orbit.rx} ${ry} 0 1 0 ${2 * orbit.rx} 0 a ${orbit.rx} ${ry} 0 1 0 ${-2 * orbit.rx} 0`;
        return (
          <circle className={`uv-planet${orbit.b ? ' b' : ''}`} r={orbit.s} key={`${orbit.rx}-planet`}>
            <animateMotion
              dur={`${orbit.d}s`}
              repeatCount="indefinite"
              begin={`-${(index * 3.7 + 1).toFixed(1)}s`}
              path={motionPath}
            />
          </circle>
        );
      })}
    </svg>
  );
}

function ChatVisual({ project }) {
  return (
    <div className="chat" role="img" aria-label="Ilustração: conversa em um chat em tempo real" data-project-visual={project.slug}>
      <div className="chat-side"><b>online</b><span>Ana</span><span>Léo</span><span>você</span><span className="off">Bia</span></div>
      <div className="chat-main">
        <div className="chat-head"><span>#geral</span><em>3 online</em></div>
        <div className="chat-body">
          <p className="msg" style={{ '--i': 0 }}><b>Ana</b>alguém revisou o PR do login?</p>
          <p className="msg me" style={{ '--i': 1 }}>revisei agora, pode fazer o merge</p>
          <p className="msg" style={{ '--i': 2 }}><b>Léo</b>merge feito, subindo pro servidor</p>
          <p className="msg me" style={{ '--i': 3 }}>valeu! já está no ar</p>
          <p className="msg typing" style={{ '--i': 4 }}><i style={{ '--d': 0 }}></i><i style={{ '--d': 1 }}></i><i style={{ '--d': 2 }}></i></p>
        </div>
      </div>
    </div>
  );
}

function PostVisual({ project }) {
  return (
    <div className="pl" role="img" aria-label="Ilustração: post de rede social sendo gerado" data-project-visual={project.slug}>
      <div className="pl-card c3"><span>campanha de email</span><i></i><i></i><i></i></div>
      <div className="pl-card c2"><span>artigo de blog</span><i></i><i></i><i></i><i></i></div>
      <div className="pl-card c1">
        <div className="pl-top"><i></i><span>padaria.do.bairro</span></div>
        <div className="pl-img">imagem do post</div>
        <p className="pl-caption" data-text="Pão quentinho saindo agora. Passa aqui antes das 9h e leva o café junto."></p>
        <span className="pl-tag">gerado com IA</span>
      </div>
    </div>
  );
}

function BitsVisual({ project }) {
  const chars = Array.from(project.name).filter((char) => char !== ' ').slice(0, 7);
  const cell = 30;
  const gap = 8;
  const step = cell + gap;
  const gridWidth = 8 * step - gap;
  const gridHeight = chars.length * step - gap;
  const x0 = (640 - gridWidth) / 2 + 16;
  const y0 = (480 - gridHeight) / 2 + 12;

  return (
    <svg viewBox="0 0 640 480" data-project-visual={project.slug}>
      <text className="vz-label" x="40" y="52">{project.name}</text>
      <text className="vz-label vz-accent" x="600" y="52" textAnchor="end">em binário</text>
      {chars.map((char, row) => {
        const bits = toBits(char).slice(-8);
        return (
          <g key={`${char}-${row}`}>
            <text className="bt-ch" x={x0 - 22} y={(y0 + row * step + cell * 0.72).toFixed(1)} textAnchor="end">{char}</text>
            {Array.from({ length: 8 }, (_, col) => (
              <rect
                className={`bt-cell${bits[col] === '1' ? ' on' : ''}`}
                style={{ '--i': row * 8 + col }}
                x={x0 + col * step}
                y={y0 + row * step}
                width={cell}
                height={cell}
                rx="3"
                key={col}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

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
      {labels.map((label) => <text className="wv-ch" x={label.x} y={top - 16} key={`${key}-${label.key}`}>{label.char}</text>)}
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
        <clipPath id={clipId}><rect width="640" height="480" /></clipPath>
      </defs>
      <text className="vz-label" x="40" y="52">pedrobicas.com</text>
      <text className="vz-label vz-accent" x="600" y="52" textAnchor="end">transmitindo</text>
      <g clipPath={`url(#${clipId})`}>
        <g className="wv-track">
          {strip('first')}
          <g transform={`translate(${x} 0)`}>{strip('second')}</g>
        </g>
      </g>
      <rect y="160" width="640" height="150" fill={`url(#${fadeId})`} />
      <line className="wv-probe" x1="520" x2="520" y1="150" y2="300" />
      <text className="wv-big" x="40" y="400">01010000</text>
      <text className="vz-label" x="40" y="430">P, o primeiro byte</text>
    </svg>
  );
}

export function ProjectVisualContent({ project, uid = project.slug }) {
  if (project.viz === 'crypto') return <CryptoVisual project={project} />;
  if (project.viz === 'universe') return <UniverseVisual project={project} />;
  if (project.viz === 'chat') return <ChatVisual project={project} />;
  if (project.viz === 'post') return <PostVisual project={project} />;
  if (project.viz === 'wire') return <WireVisual project={project} uid={uid} />;
  return <BitsVisual project={project} />;
}

export default function ProjectVisual({ project, uid, className = 'viz', ariaHidden = true }) {
  return (
    <div className={className} aria-hidden={ariaHidden ? 'true' : undefined}>
      <ProjectVisualContent project={project} uid={uid} />
    </div>
  );
}
