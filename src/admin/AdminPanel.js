import React, { useState } from 'react';
import './AdminPanel.css';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const SECTION_TYPES = [
  { value: 'overview',  label: 'Overview' },
  { value: 'problem',   label: 'Problem Statement' },
  { value: 'role',      label: 'My Role' },
  { value: 'process',   label: 'Design Process' },
  { value: 'decisions', label: 'Key Decisions' },
  { value: 'outcome',   label: 'Outcome' },
  { value: 'learnings', label: 'Key Learnings' },
  { value: 'custom',    label: 'Custom Section' },
];

const ACCENT_PRESETS = [
  { label: 'Green',    value: 'linear-gradient(150deg, #DCFCE7 0%, #F0FDF4 70%)' },
  { label: 'Blue',     value: 'linear-gradient(150deg, #E0E7FF 0%, #F0F4FF 70%)' },
  { label: 'Amber',    value: 'linear-gradient(150deg, #FEF3C7 0%, #FFFBEB 70%)' },
  { label: 'Purple',   value: 'linear-gradient(150deg, #F3E8FF 0%, #FAF5FF 70%)' },
  { label: 'Rose',     value: 'linear-gradient(150deg, #FFE4E6 0%, #FFF1F2 70%)' },
  { label: 'Teal',     value: 'linear-gradient(150deg, #CCFBF1 0%, #F0FDFA 70%)' },
  { label: 'Orange',   value: 'linear-gradient(150deg, #FFEDD5 0%, #FFF7ED 70%)' },
  { label: 'Neutral',  value: '#F7F6F3' },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 9);
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const makeSection = () => ({
  _id: uid(), type: 'overview', title: '', content: '',
  showImages: false,    images: [],
  showHighlight: false, highlightText: '',
  showMetrics: false,   metrics: [],
  showBullets: false,   bulletPoints: [],
  showSteps: false,     steps: [],
});
const makeStat   = () => ({ val: '', label: '' });
const makeMetric = () => ({ num: '', label: '' });
const makeStep   = () => ({ num: '', name: '', desc: '' });
const makeImage  = () => ({ id: uid(), url: '', caption: '', position: 'full' });

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function AdminPanel() {
  /* Project meta */
  const [title,     setTitle]     = useState('');
  const [desc,      setDesc]      = useState('');
  const [year,      setYear]      = useState('');
  const [tags,      setTags]      = useState(['']);
  const [thumbnail, setThumbnail] = useState('');
  const [accentBg,  setAccentBg]  = useState(ACCENT_PRESETS[0].value);
  const [heroStats, setHeroStats] = useState([makeStat(), makeStat(), makeStat()]);
  const [sections,  setSections]  = useState([makeSection()]);

  /* Output */
  const [jsonOutput,  setJsonOutput]  = useState('');
  const [showOutput,  setShowOutput]  = useState(false);
  const [copied,      setCopied]      = useState(false);

  /* ── Tags ── */
  const updateTag = (i, v) => setTags(t => t.map((x, j) => j === i ? v : x));
  const addTag    = () => setTags(t => [...t, '']);
  const removeTag = (i) => setTags(t => t.filter((_, j) => j !== i));

  /* ── Hero stats ── */
  const updateStat = (i, f, v) => setHeroStats(s => s.map((x, j) => j === i ? { ...x, [f]: v } : x));
  const addStat    = () => setHeroStats(s => [...s, makeStat()]);
  const removeStat = (i) => setHeroStats(s => s.filter((_, j) => j !== i));

  /* ── Sections ── */
  const addSection    = () => setSections(s => [...s, makeSection()]);
  const removeSection = (i) => setSections(s => s.filter((_, j) => j !== i));
  const moveSection   = (i, d) => {
    const a = [...sections], to = i + d;
    if (to < 0 || to >= a.length) return;
    [a[i], a[to]] = [a[to], a[i]];
    setSections(a);
  };
  const updateSection = (i, f, v) =>
    setSections(s => s.map((x, j) => j === i ? { ...x, [f]: v } : x));

  /* ── Section sub-list helpers ── */
  const listHelper = (field, maker) => ({
    add:    (i)       => setSections(s => s.map((x, j) => j === i ? { ...x, [field]: [...x[field], maker()] } : x)),
    remove: (i, k)    => setSections(s => s.map((x, j) => j === i ? { ...x, [field]: x[field].filter((_, m) => m !== k) } : x)),
    update: (i, k, f, v) => setSections(s => s.map((x, j) =>
      j === i ? { ...x, [field]: x[field].map((item, m) => m === k ? (typeof f === 'string' ? { ...item, [f]: v } : f(item)) : item) } : x)),
  });

  const metrics = listHelper('metrics',     makeMetric);
  const bullets = listHelper('bulletPoints', () => '');
  const steps   = listHelper('steps',       makeStep);
  const images  = listHelper('images',      makeImage);

  /* bullet update is special (plain string) */
  const updateBullet = (i, k, v) =>
    setSections(s => s.map((x, j) =>
      j === i ? { ...x, bulletPoints: x.bulletPoints.map((b, m) => m === k ? v : b) } : x));

  /* ── Generate JSON ── */
  const generate = () => {
    const id = slug(title) || 'untitled-project';
    const obj = {
      id, slug: id,
      title:     title.trim(),
      desc:      desc.trim(),
      year:      year.trim(),
      tags:      tags.map(t => t.trim()).filter(Boolean),
      visual:    'pv-1',
      thumbnail: thumbnail.trim() || null,
      accentBg,
      heroStats: heroStats
        .filter(s => s.val.trim() || s.label.trim())
        .map(s => ({ val: s.val.trim(), label: s.label.trim() })),
      sections: sections.map(sec => {
        const s = { id: sec._id, type: sec.type, title: sec.title.trim() };
        if (sec.content.trim()) s.content = sec.content.trim();
        if (sec.showImages && sec.images.some(i => i.url)) {
          s.showImages = true;
          s.images = sec.images.filter(i => i.url.trim()).map(i => ({
            id: i.id, url: i.url.trim(), caption: i.caption.trim(), position: i.position,
          }));
        }
        if (sec.showHighlight && sec.highlightText.trim()) {
          s.showHighlight = true; s.highlightText = sec.highlightText.trim();
        }
        if (sec.showMetrics && sec.metrics.some(m => m.num || m.label)) {
          s.showMetrics = true;
          s.metrics = sec.metrics.filter(m => m.num || m.label).map(m => ({ num: m.num.trim(), label: m.label.trim() }));
        }
        if (sec.showBullets && sec.bulletPoints.some(b => b.trim())) {
          s.showBullets = true;
          s.bulletPoints = sec.bulletPoints.filter(b => b.trim());
        }
        if (sec.showSteps && sec.steps.some(st => st.name || st.desc)) {
          s.showSteps = true;
          s.steps = sec.steps.filter(st => st.name || st.desc).map(st => ({
            num: st.num.trim(), name: st.name.trim(), desc: st.desc.trim(),
          }));
        }
        return s;
      }),
    };
    setJsonOutput(JSON.stringify(obj, null, 2));
    setShowOutput(true);
  };

  const copy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */
  return (
    <div className="ap-root">

      {/* Header */}
      <div className="ap-header">
        <div className="ap-header-inner">
          <div className="ap-header-left">
            <div className="ap-logo">Portfolio Admin</div>
            <div className="ap-logo-sub">Project JSON Generator</div>
          </div>
          <div className="ap-header-steps">
            <span className="ap-step active">1 Fill form</span>
            <span className="ap-step-arrow">→</span>
            <span className="ap-step">2 Generate JSON</span>
            <span className="ap-step-arrow">→</span>
            <span className="ap-step">3 Paste into projects.json</span>
          </div>
        </div>
      </div>

      <div className="ap-body">

        {/* ── PROJECT INFO ── */}
        <div className="ap-card">
          <div className="ap-card-label">01</div>
          <div className="ap-card-title">Project Info</div>

          <div className="ap-field">
            <label>Project Title <span className="ap-req">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. AIVAS — AI Voice Assistance System" />
          </div>

          <div className="ap-field">
            <label>Short Description <span className="ap-req">*</span></label>
            <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="One or two sentences shown on the portfolio card and project hero." />
          </div>

          <div className="ap-row-2">
            <div className="ap-field">
              <label>Date Range</label>
              <input value={year} onChange={e => setYear(e.target.value)}
                placeholder="e.g. Jan 2025 – Mar 2025" />
            </div>
            <div className="ap-field">
              <label>Thumbnail Path</label>
              <input value={thumbnail} onChange={e => setThumbnail(e.target.value)}
                placeholder="/thumbnails/project-name.png" />
            </div>
          </div>

          <div className="ap-field">
            <label>Tags</label>
            <div className="ap-list">
              {tags.map((t, i) => (
                <div key={i} className="ap-list-row">
                  <input value={t} onChange={e => updateTag(i, e.target.value)}
                    placeholder="e.g. SaaS Platform" />
                  <button className="ap-icon-btn" onClick={() => removeTag(i)} title="Remove">✕</button>
                </div>
              ))}
              <button className="ap-add-btn" onClick={addTag}>+ Add Tag</button>
            </div>
          </div>

          <div className="ap-field">
            <label>Hero Background Colour</label>
            <div className="ap-accent-grid">
              {ACCENT_PRESETS.map(p => (
                <button
                  key={p.value}
                  className={`ap-accent-chip ${accentBg === p.value ? 'ap-accent-active' : ''}`}
                  style={{ background: p.value }}
                  onClick={() => setAccentBg(p.value)}
                >{p.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── HERO STATS ── */}
        <div className="ap-card">
          <div className="ap-card-label">02</div>
          <div className="ap-card-title">Hero Stats</div>
          <p className="ap-card-hint">Shown below the title on the project hero (e.g. Timeline / 3 Months).</p>
          <div className="ap-stats-grid">
            {heroStats.map((s, i) => (
              <div key={i} className="ap-stat-row">
                <input value={s.val}   onChange={e => updateStat(i, 'val',   e.target.value)} placeholder="Value (e.g. 3 Months)" />
                <input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Label (e.g. Timeline)" />
                <button className="ap-icon-btn" onClick={() => removeStat(i)} title="Remove">✕</button>
              </div>
            ))}
          </div>
          <button className="ap-add-btn" onClick={addStat}>+ Add Stat</button>
        </div>

        {/* ── SECTIONS ── */}
        <div className="ap-card">
          <div className="ap-card-label">03</div>
          <div className="ap-card-title">Case Study Sections</div>
          <p className="ap-card-hint">Add one section per block of content. Use the toggles to enable metrics, bullets, steps, or images.</p>

          {sections.map((sec, i) => (
            <SectionEditor
              key={sec._id}
              sec={sec}
              index={i}
              total={sections.length}
              onUpdate={(f, v)    => updateSection(i, f, v)}
              onMove={(d)         => moveSection(i, d)}
              onRemove={()        => removeSection(i)}
              metrics={{
                add:    ()        => metrics.add(i),
                remove: (k)       => metrics.remove(i, k),
                update: (k, f, v) => metrics.update(i, k, f, v),
              }}
              bulletsH={{
                add:    ()        => bullets.add(i),
                remove: (k)       => bullets.remove(i, k),
                update: (k, v)    => updateBullet(i, k, v),
              }}
              stepsH={{
                add:    ()        => steps.add(i),
                remove: (k)       => steps.remove(i, k),
                update: (k, f, v) => steps.update(i, k, f, v),
              }}
              imagesH={{
                add:    ()        => images.add(i),
                remove: (k)       => images.remove(i, k),
                update: (k, f, v) => images.update(i, k, f, v),
              }}
            />
          ))}

          <button className="ap-add-section-btn" onClick={addSection}>+ Add Section</button>
        </div>

        {/* ── GENERATE ── */}
        <div className="ap-generate-bar">
          <div className="ap-generate-hint">When you're done, generate the JSON and paste it into <code>public/data/projects.json</code></div>
          <button className="ap-generate-btn" onClick={generate}>Generate JSON →</button>
        </div>

      </div>{/* end ap-body */}

      {/* ── OUTPUT MODAL ── */}
      {showOutput && (
        <div className="ap-overlay" onClick={() => setShowOutput(false)}>
          <div className="ap-output" onClick={e => e.stopPropagation()}>
            <div className="ap-output-header">
              <div>
                <div className="ap-output-title">Generated JSON</div>
                <div className="ap-output-hint-sm">
                  Copy this, open <code>public/data/projects.json</code>, and paste it inside the <code>[ ]</code> array (add a comma after the previous project).
                </div>
              </div>
              <div className="ap-output-actions">
                <button className={`ap-copy-btn ${copied ? 'ap-copied' : ''}`} onClick={copy}>
                  {copied ? '✓ Copied!' : 'Copy to Clipboard'}
                </button>
                <button className="ap-close-btn" onClick={() => setShowOutput(false)}>✕</button>
              </div>
            </div>
            <pre className="ap-code">{jsonOutput}</pre>
          </div>
        </div>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────────
   Section Editor
───────────────────────────────────────────── */
function SectionEditor({ sec, index, total, onUpdate, onMove, onRemove, metrics, bulletsH, stepsH, imagesH }) {
  const [open, setOpen] = useState(true);
  const typeLabel = SECTION_TYPES.find(t => t.value === sec.type)?.label || sec.type;

  return (
    <div className={`ap-section ${open ? 'ap-section-open' : ''}`}>
      <div className="ap-section-hd" onClick={() => setOpen(o => !o)}>
        <div className="ap-section-hd-left">
          <span className="ap-sec-num">{index + 1}</span>
          <span className="ap-sec-type">{typeLabel}</span>
          {sec.title && <span className="ap-sec-name">— {sec.title}</span>}
        </div>
        <div className="ap-section-hd-right" onClick={e => e.stopPropagation()}>
          <button className="ap-sec-move" onClick={() => onMove(-1)} disabled={index === 0} title="Move up">↑</button>
          <button className="ap-sec-move" onClick={() => onMove(1)} disabled={index === total - 1} title="Move down">↓</button>
          <button className="ap-sec-delete" onClick={onRemove} title="Remove section">✕</button>
          <span className="ap-sec-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="ap-section-body">

          <div className="ap-row-2">
            <div className="ap-field">
              <label>Section Type</label>
              <select value={sec.type} onChange={e => onUpdate('type', e.target.value)}>
                {SECTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="ap-field">
              <label>Section Title</label>
              <input value={sec.title} onChange={e => onUpdate('title', e.target.value)}
                placeholder="e.g. Project Overview" />
            </div>
          </div>

          <div className="ap-field">
            <label>Main Content</label>
            <textarea rows={5} value={sec.content} onChange={e => onUpdate('content', e.target.value)}
              placeholder="Body text for this section. Separate paragraphs with a blank line." />
          </div>

          {/* ── Toggles ── */}
          <div className="ap-toggles">

            {/* Images */}
            <Toggle label="Images" checked={sec.showImages} onChange={v => onUpdate('showImages', v)} />
            {sec.showImages && (
              <div className="ap-sub">
                {sec.images.map((img, k) => (
                  <div key={img.id} className="ap-image-row">
                    <input value={img.url} onChange={e => imagesH.update(k, 'url', e.target.value)}
                      placeholder="/images/project/screen.jpg" style={{flex:2}} />
                    <input value={img.caption} onChange={e => imagesH.update(k, 'caption', e.target.value)}
                      placeholder="Caption (optional)" style={{flex:2}} />
                    <select value={img.position} onChange={e => imagesH.update(k, 'position', e.target.value)}
                      style={{flex:'0 0 120px'}}>
                      <option value="full">Full width</option>
                      <option value="half">Half (2-col)</option>
                      <option value="inline">Inline</option>
                    </select>
                    <button className="ap-icon-btn" onClick={() => imagesH.remove(k)}>✕</button>
                  </div>
                ))}
                <button className="ap-add-btn" onClick={imagesH.add}>+ Add Image</button>
              </div>
            )}

            {/* Highlight */}
            <Toggle label="Highlight Quote" checked={sec.showHighlight} onChange={v => onUpdate('showHighlight', v)} />
            {sec.showHighlight && (
              <div className="ap-sub">
                <textarea rows={2} value={sec.highlightText} onChange={e => onUpdate('highlightText', e.target.value)}
                  placeholder="A key insight or quote to emphasise in a dark call-out block." />
              </div>
            )}

            {/* Metrics */}
            <Toggle label="Metric Strip" checked={sec.showMetrics} onChange={v => onUpdate('showMetrics', v)} />
            {sec.showMetrics && (
              <div className="ap-sub">
                {sec.metrics.map((m, k) => (
                  <div key={k} className="ap-list-row">
                    <input value={m.num}   onChange={e => metrics.update(k, 'num',   e.target.value)} placeholder="Value (e.g. 40%)" />
                    <input value={m.label} onChange={e => metrics.update(k, 'label', e.target.value)} placeholder="Label (e.g. Faster)" />
                    <button className="ap-icon-btn" onClick={() => metrics.remove(k)}>✕</button>
                  </div>
                ))}
                <button className="ap-add-btn" onClick={metrics.add}>+ Add Metric</button>
              </div>
            )}

            {/* Bullets */}
            <Toggle label="Bullet Points" checked={sec.showBullets} onChange={v => onUpdate('showBullets', v)} />
            {sec.showBullets && (
              <div className="ap-sub">
                {sec.bulletPoints.map((b, k) => (
                  <div key={k} className="ap-list-row">
                    <input value={b} onChange={e => bulletsH.update(k, e.target.value)}
                      placeholder="Bullet point. Use **bold** for emphasis." />
                    <button className="ap-icon-btn" onClick={() => bulletsH.remove(k)}>✕</button>
                  </div>
                ))}
                <button className="ap-add-btn" onClick={bulletsH.add}>+ Add Bullet</button>
              </div>
            )}

            {/* Steps */}
            <Toggle label="Process Steps" checked={sec.showSteps} onChange={v => onUpdate('showSteps', v)} />
            {sec.showSteps && (
              <div className="ap-sub">
                {sec.steps.map((st, k) => (
                  <div key={k} className="ap-step-row">
                    <input value={st.num}  onChange={e => stepsH.update(k, 'num',  e.target.value)} placeholder="01" className="ap-step-num-input" />
                    <input value={st.name} onChange={e => stepsH.update(k, 'name', e.target.value)} placeholder="Step name" />
                    <input value={st.desc} onChange={e => stepsH.update(k, 'desc', e.target.value)} placeholder="Step description" />
                    <button className="ap-icon-btn" onClick={() => stepsH.remove(k)}>✕</button>
                  </div>
                ))}
                <button className="ap-add-btn" onClick={stepsH.add}>+ Add Step</button>
              </div>
            )}

          </div>{/* end toggles */}
        </div>
      )}
    </div>
  );
}

/* ── Toggle component ── */
function Toggle({ label, checked, onChange }) {
  return (
    <label className="ap-toggle-label">
      <div className={`ap-toggle-switch ${checked ? 'ap-toggle-on' : ''}`}
        onClick={() => onChange(!checked)}>
        <div className="ap-toggle-thumb" />
      </div>
      <span>{label}</span>
    </label>
  );
}
