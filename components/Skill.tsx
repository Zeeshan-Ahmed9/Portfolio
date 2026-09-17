'use client';

/**
 * Skills Section — Full Stack Developer Portfolio
 * ------------------------------------------------
 * Concept: your stack is a system, not a list. A slow-drifting 3D "node
 * network" (Three.js) sits behind the section as ambient depth, and the
 * foreground reads like a schematic spine running top (browser) to bottom
 * (tooling) — each layer of the stack is a stop along the line, exactly
 * the order a request actually travels through your code.
 *
 * Install:
 *   npm install three gsap lucide-react
 *   npm install -D @types/three   (TypeScript projects)
 *
 * Usage:
 *   import SkillsSection from './skill';
 *   <SkillsSection />
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Server, Database, Cloud, Wrench, Sparkles, type LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Design tokens (harmonized with portfolio's black-100/purple theme)
// ---------------------------------------------------------------------------
const TOKENS = {
  bg: '#000319',           // Matches portfolio bg-black-100 background
  panel: '#0F1129',         // Matches BentoGrid/Experience card background
  panelBorder: '#1C1F3E',   // Matches portfolio black-300 borders
  text: '#FFFFFF',          // Matches white-100
  muted: '#C1C2D3',         // Matches white-200
  purple: '#CBACF9',        // Primary purple accent
  blue: '#38BDF8',          // Light blue accent for connection lines
};

// ---------------------------------------------------------------------------
// Content — swap these for your own stack
// ---------------------------------------------------------------------------
interface SkillItem {
  name: string;
  level: number; // 0–100, used to fill the bar
}

interface StackLayer {
  id: string;
  label: string; // e.g. "Layer 01"
  title: string;
  icon: LucideIcon;
  accent: string;
  blurb: string;
  skills: SkillItem[];
}

const STACK: StackLayer[] = [
  {
    id: 'frontend',
    label: 'Layer 01',
    title: 'Frontend',
    icon: Code2,
    accent: TOKENS.purple, // Matches primary portfolio purple
    blurb: 'What the user actually touches.',
    skills: [
      { name: 'HTML5', level: 92 },
      { name: 'CSS3', level: 88 },
      { name: 'Tailwind CSS', level: 70 },
      { name: 'JavaScript', level: 76 },
      { name: 'TypeScript', level: 74 },
      { name: 'React', level: 80 },
      { name: 'Next.js', level: 75 },
      { name: 'GSAP', level: 50 },
      { name: 'Framer Motion', level: 60 },
    ],
  },
  {
    id: 'backend',
    label: 'Layer 02',
    title: 'Backend',
    icon: Server,
    accent: '#6366F1', // Indigo accent
    blurb: 'Where the request gets decided.',
    skills: [
      { name: 'Node.js', level: 65 },
      { name: 'Python', level: 50 },
      { name: 'PHP', level: 55 },
      { name: 'Express', level: 67 },
      { name: 'NestJS', level: 50 },
      { name: 'GraphQL', level: 10 },
      { name: 'REST API Design', level: 60 },
    ],
  },
  {
    id: 'database',
    label: 'Layer 03',
    title: 'Database',
    icon: Database,
    accent: '#06B6D4', // Cyan accent
    blurb: 'Where the truth is kept.',
    skills: [
      { name: 'PostgreSQL', level: 56 },
      { name: 'MongoDB', level: 70 },
      { name: 'Redis', level: 10 },
      { name: 'MySQL', level: 50 },
    ],
  },
  {
    id: 'devops',
    label: 'Layer 04',
    title: 'DevOps & Cloud',
    icon: Cloud,
    accent: '#EC4899', // Pink accent
    blurb: 'How it stays up in production.',
    skills: [
      { name: 'Docker', level: 71 },
      { name: 'AWS (EC2/S3/Lambda)', level: 32 },
      { name: 'CI/CD (GitHub Actions)', level: 61 },
      { name: 'Kubernetes', level: 58 },
      { name: 'Nginx', level: 21 },
    ],
  },
  {
    id: 'tools',
    label: 'Layer 05',
    title: 'Tools & Practice',
    icon: Wrench,
    accent: '#10B981', // Emerald green accent
    blurb: 'How the work actually gets shipped.',
    skills: [
      { name: 'Git / GitHub', level: 80 },
      { name: 'Jest & Testing Library', level: 60 },
      { name: 'Figma', level: 68 },
      { name: 'Agile / Scrum', level: 10 },
      { name: 'Vite / Webpack', level: 65 },
    ],
  },
  {
  id: "ai",
  label: "Layer 06",
  title: "LLMs & AI",
  icon: Sparkles,
  accent: "#8B5CF6",
  blurb: "Leveraging LLMs to accelerate development and solve complex problems.",
  skills: [
    { name: "OpenAI GPT", level: 85 },
    { name: "Claude", level: 80 },
    { name: "Gemini", level: 85 },
    { name: "Prompt Engineering", level: 90 },
    { name: "LLM APIs", level: 80 },
  ],
}
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Skill() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  // --- Three.js: ambient drifting node network ---------------------------
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let width = host.clientWidth;
    let height = host.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    // Nodes
    const NODE_COUNT = 46;
    const BOUNDS = { x: 9, y: 5.5, z: 4 };
    const positions = new Float32Array(NODE_COUNT * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.004
        )
      );
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const nodeMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(TOKENS.purple),
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(points);

    // Connections — rebuilt each frame from current node positions
    const MAX_LINE_VERTS = NODE_COUNT * NODE_COUNT * 2 * 3;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_LINE_VERTS);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(TOKENS.blue),
      transparent: true,
      opacity: 0.16,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const CONNECT_DIST = 3.1;
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const posAttr = nodeGeometry.getAttribute('position') as THREE.BufferAttribute;

      // Drift nodes and bounce off bounds
      for (let i = 0; i < NODE_COUNT; i++) {
        const ix = i * 3;
        posAttr.array[ix] += velocities[i].x;
        posAttr.array[ix + 1] += velocities[i].y;
        posAttr.array[ix + 2] += velocities[i].z;

        if (Math.abs(posAttr.array[ix]) > BOUNDS.x) velocities[i].x *= -1;
        if (Math.abs(posAttr.array[ix + 1]) > BOUNDS.y) velocities[i].y *= -1;
        if (Math.abs(posAttr.array[ix + 2]) > BOUNDS.z) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Rebuild connections between nearby nodes
      let vertIndex = 0;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = arr[i * 3] - arr[j * 3];
          const dy = arr[i * 3 + 1] - arr[j * 3 + 1];
          const dz = arr[i * 3 + 2] - arr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < CONNECT_DIST) {
            linePositions[vertIndex++] = arr[i * 3];
            linePositions[vertIndex++] = arr[i * 3 + 1];
            linePositions[vertIndex++] = arr[i * 3 + 2];
            linePositions[vertIndex++] = arr[j * 3];
            linePositions[vertIndex++] = arr[j * 3 + 1];
            linePositions[vertIndex++] = arr[j * 3 + 2];
          }
        }
      }
      lineGeometry.setDrawRange(0, vertIndex / 3);
      (lineGeometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;

      // Gentle whole-scene rotation + mouse parallax
      const t = clock.getElapsedTime();
      scene.rotation.y = Math.sin(t * 0.05) * 0.15 + mouse.x * 0.12;
      scene.rotation.x = Math.cos(t * 0.04) * 0.08 + mouse.y * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(host);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  // --- GSAP: scroll-triggered reveals + skill bar fills -------------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
          }
        );
      }

      layerRefs.current.forEach((el, i) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 50, rotateX: -6 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.85,
            ease: 'power3.out',
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );

        const marker = el.querySelector('.layer-marker');
        if (marker) {
          gsap.fromTo(
            marker,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2.4)',
              scrollTrigger: { trigger: el, start: 'top 85%' },
            }
          );
        }

        const names = el.querySelectorAll('.skill-name');
        gsap.fromTo(
          names,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 78%' },
          }
        );

        const bars = el.querySelectorAll<HTMLDivElement>('.skill-bar-fill');
        bars.forEach((bar) => {
          const level = bar.dataset.level ?? '0';
          gsap.fromTo(
            bar,
            { width: '0%' },
            {
              width: `${level}%`,
              duration: 1.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 78%' },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // --- Hover tilt micro-interaction on layer cards ------------------------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: px * 4,
      rotateX: -py * 4,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  };
  const handleMouseLeave = (el: HTMLDivElement) => {
    gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ background: TOKENS.bg, color: TOKENS.text, position: 'relative', overflow: 'hidden' }}
      className="w-full px-6 py-24 md:px-12 lg:px-24"
    >
      {/* 3D ambient background */}
      <div
        ref={canvasHostRef}
        style={{ position: 'absolute', inset: 0, opacity: 0.55, pointerEvents: 'none' }}
      />

      <div style={{ position: 'relative', zIndex: 1 }} className="mx-auto max-w-4xl">
        <div ref={headingRef} className="mb-16 md:mb-20">
          <p
            style={{ color: TOKENS.purple }}
            className="mb-3 font-mono text-xs tracking-[0.25em] uppercase"
          >
            {"// full-stack-toolkit"}
          </p>
          <h2 style={{ color: "#FFFFFF" }} className="text-3xl md:text-5xl font-bold tracking-tight">
            Skills, <span className="text-purple">top to bottom</span> of the stack
          </h2>
          <p style={{ color: TOKENS.muted }} className="mt-4 max-w-xl text-sm md:text-base">
            Laid out the way a request actually travels — from the interface a
            user touches down to the tools that ship and keep it running.
          </p>
        </div>

        {/* Spine */}
        <div className="relative">
          <div
            aria-hidden
            style={{ background: TOKENS.panelBorder }}
            className="absolute left-[27px] top-2 bottom-2 w-px md:left-[31px]"
          />

          <div className="flex flex-col gap-8 md:gap-10">
            {STACK.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.id}
                  ref={(el) => { layerRefs.current[i] = el; }}
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative pl-16 md:pl-20"
                >
                  {/* Node marker on the spine */}
                  <div
                    className="layer-marker absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full md:h-16 md:w-16"
                    style={{
                      background: TOKENS.panel,
                      border: `1px solid ${layer.accent}55`,
                      boxShadow: `0 0 22px ${layer.accent}33`,
                    }}
                  >
                    <Icon size={22} color={layer.accent} strokeWidth={1.75} />
                  </div>

                  {/* Layer card */}
                  <div
                    style={{
                      background: TOKENS.panel,
                      border: `1px solid ${TOKENS.panelBorder}`,
                    }}
                    className="rounded-2xl p-6 md:p-8"
                  >
                    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span
                          style={{ color: layer.accent }}
                          className="font-mono text-[11px] tracking-[0.2em] uppercase"
                        >
                          {layer.label}
                        </span>
                        <h3 className="mt-1 text-xl font-semibold md:text-2xl">{layer.title}</h3>
                      </div>
                      <p style={{ color: TOKENS.muted }} className="text-sm italic">
                        {layer.blurb}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {layer.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="skill-name text-sm font-medium">{skill.name}</span>
                            <span style={{ color: TOKENS.muted }} className="text-xs font-mono">
                              {skill.level}%
                            </span>
                          </div>
                          <div
                            style={{ background: '#1B2340' }}
                            className="h-1.5 w-full overflow-hidden rounded-full"
                          >
                            <div
                              className="skill-bar-fill h-full rounded-full"
                              data-level={skill.level}
                              style={{ width: '0%', background: layer.accent }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

