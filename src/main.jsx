import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowRight, Award, CloudSun, Copy, Crown, Info, Radio, RotateCcw, Sparkles, Users, Zap } from 'lucide-react';
import { questions, roster, themes } from './data';
import './styles.css';

const localKey = 'climagame-session';
function App() {
  const [screen, setScreen] = useState('lobby');
  const [student, setStudent] = useState({ name:'', call:'', email:'', series:'8º Ano A' });
  const [roomCode, setRoomCode] = useState('AULA-8');
  const [filter, setFilter] = useState('Todos os temas');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const sessionId = useRef(crypto.randomUUID());
  const pool = useMemo(() => filter === 'Todos os temas' ? questions : questions.filter(q => q.theme === filter), [filter]);
  const current = pool[index % pool.length];

  useEffect(() => { const saved = localStorage.getItem(localKey); if (saved) setStudent(JSON.parse(saved)); }, []);
  useEffect(() => () => socketRef.current?.close(), []);

  function selectStudent(name) {
    const found = roster.find(s => s.name === name);
    if (found) setStudent(s => ({ ...s, name: found.name, call: found.call, email: found.emailGoogle }));
    else setStudent(s => ({ ...s, name, call:'', email:'' }));
  }
  function startGame() {
    if (!student.name || !student.email || !student.series || !student.call) return;
    localStorage.setItem(localKey, JSON.stringify(student));
    setScore(0); setAnswers(0); setIndex(0); setLocked(false); setSelected(null); setScreen('game');
    connectRoom();
  }
  function connectRoom() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const url = import.meta.env.VITE_WS_URL || `${protocol}://${location.hostname}:8787`;
    try {
      const ws = new WebSocket(url); socketRef.current = ws;
      ws.onopen = () => { setConnected(true); ws.send(JSON.stringify({ type:'join', room:roomCode, name:student.name })); };
      ws.onmessage = e => { const data = JSON.parse(e.data); if (data.type === 'leaderboard') setLeaderboard(data.players || []); };
      ws.onclose = () => setConnected(false); ws.onerror = () => setConnected(false);
    } catch { setConnected(false); }
  }
  function submitAnswer(choice) {
    if (locked) return;
    const correct = choice === current.answer; const points = correct ? 100 + Math.max(0, 30 - answers * 2) : 0;
    setSelected(choice); setLocked(true); setAnswers(a => a + 1); if (correct) setScore(s => s + points);
    socketRef.current?.send(JSON.stringify({ type:'answer', correct, points }));
  }
  function next() { setIndex(i => i + 1); setSelected(null); setLocked(false); }
  const rank = [...leaderboard, { id:sessionId.current, name:student.name || 'Você', score }].sort((a,b) => b.score - a.score);
  const myRank = Math.max(1, rank.findIndex(p => p.id === sessionId.current) + 1);

  if (screen === 'lobby') return <main className="app-shell"><section className="hero"><div className="hero-copy"><div className="eyebrow"><CloudSun size={16}/> CIÊNCIAS · 8º ANO</div><h1>Clima<span>Game</span></h1><p className="hero-sub">Uma arena de perguntas para explorar o céu, o clima e as escolhas que cuidam do planeta.</p><div className="hero-pills"><span><Sparkles size={14}/> 12 desafios</span><span><Users size={14}/> jogue em equipe</span><span><Zap size={14}/> ranking ao vivo</span></div></div><div className="planet-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="planet">◒</div><div className="star s1">✦</div><div className="star s2">✧</div></div></section><section className="lobby-card"><div className="section-heading"><div><span className="kicker">ENTRADA DA EXPEDIÇÃO</span><h2>Quem está jogando?</h2><p>Preencha o cabeçalho da atividade para entrar na sala.</p></div><div className="live-badge"><span className="live-dot"/> sala aberta</div></div><div className="form-grid"><label className="field wide"><span>Nome completo</span><select value={student.name} onChange={e => selectStudent(e.target.value)}><option value="">Selecione seu nome na lista...</option>{roster.map(s => <option key={s.call} value={s.name}>{s.call} · {s.name}</option>)}<option value="Outro estudante">Outro estudante</option></select></label><label className="field"><span>Série / turma</span><select value={student.series} onChange={e => setStudent({...student,series:e.target.value})}><option>8º Ano A</option><option>8º Ano B</option></select></label><label className="field"><span>Nº de chamada</span><input value={student.call} onChange={e => setStudent({...student,call:e.target.value})} placeholder="Ex.: 12" /></label><label className="field wide"><span>E-mail institucional</span><input type="email" value={student.email} onChange={e => setStudent({...student,email:e.target.value})} placeholder="seu.email@al.educacao.sp.gov.br" /></label><label className="field"><span>Código da sala</span><input value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} maxLength="12" /></label><label className="field wide"><span>Trilha de conteúdo</span><select value={filter} onChange={e => setFilter(e.target.value)}><option>Todos os temas</option>{themes.map(theme => <option key={theme}>{theme}</option>)}</select></label></div><div className="lobby-footer"><div className="privacy"><Info size={16}/><span>O ranking usa o nome informado apenas dentro da sala.</span></div><button className="primary" onClick={startGame} disabled={!student.name || !student.email || !student.call}>Entrar na arena <ArrowRight size={18}/></button></div></section><p className="curriculum-note">Conteúdos alinhados às aulas 1–24 do 3º bimestre: astronomia, previsão do tempo, climas regionais, El Niño/La Niña e equilíbrio ambiental.</p></main>;

  return <main className="app-shell game-screen"><header className="game-header"><div className="brand"><CloudSun size={22}/><strong>Clima<span>Game</span></strong><small>SALA {roomCode}</small></div><div className="header-stats"><div><small>SEU PLACAR</small><b>{score.toString().padStart(4,'0')}</b></div><div><small>POSIÇÃO</small><b>#{myRank}</b></div><div className="connection"><span className={connected ? 'live-dot' : 'offline-dot'}/>{connected ? 'ao vivo' : 'modo local'}</div></div></header><div className="game-layout"><section className="question-panel"><div className="question-meta"><span className="theme-tag">{current.theme}</span><span>{current.lesson}</span><span className="question-count">{(index % pool.length) + 1} / {pool.length}</span></div><div className="progress"><i style={{width:`${(((index % pool.length)+1)/pool.length)*100}%`}}/></div><div className="question-card"><div className="question-number">DESAFIO {String((index % pool.length)+1).padStart(2,'0')}</div><h1>{current.q}</h1><div className="answers">{current.options.map((option, i) => <button key={option} className={`answer ${locked ? (i === current.answer ? 'correct' : i === selected ? 'wrong' : 'dim') : ''}`} onClick={() => submitAnswer(i)} disabled={locked}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{locked && i === current.answer && <span className="answer-mark">✓</span>}</button>)}</div>{locked && <div className={`feedback ${selected === current.answer ? 'good' : 'bad'}`}><div>{selected === current.answer ? 'Mandou bem!' : 'Quase lá!'}</div><small>{current.explain}</small></div>}</div>{locked && <button className="next-button" onClick={next}>Próximo desafio <ArrowRight size={18}/></button>}</section><aside className="rank-panel"><div className="rank-heading"><div><span className="kicker">PLACAR DA SALA</span><h2>Ranking em tempo real</h2></div><Radio size={18} className={connected ? 'pulse' : ''}/></div><div className="room-code"><span>CÓDIGO PARA JOGAR JUNTO</span><strong>{roomCode}</strong><button onClick={() => navigator.clipboard?.writeText(roomCode)} title="Copiar código"><Copy size={15}/></button></div><div className="rank-list">{rank.slice(0,8).map((p,i) => <div className={`rank-row ${p.id === sessionId.current ? 'me' : ''}`} key={p.id || p.name}><div className={`rank-position pos-${i+1}`}>{i < 3 ? <Crown size={14}/> : i+1}</div><div className="avatar">{p.name.slice(0,1)}</div><div className="rank-name"><b>{p.name === student.name ? 'Você' : p.name}</b><small>{p.answered ? 'respondeu' : 'na arena'}</small></div><strong>{p.score}</strong></div>)}</div><div className="rank-tip"><Activity size={16}/><span>O placar se atualiza automaticamente quando alguém responde.</span></div><button className="reset" onClick={() => { setScreen('lobby'); socketRef.current?.close(); }}><RotateCcw size={15}/> Sair e trocar de jogador</button></aside></div></main>;
}
createRoot(document.getElementById('root')).render(<App />);
