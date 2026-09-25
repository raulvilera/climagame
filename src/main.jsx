import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowRight, Award, CloudSun, Copy, Crown, Info, Radio, RotateCcw, Sparkles, Users, Zap } from 'lucide-react';
import { questions, questionImages, rosterByClass, themes } from './data';
import './styles.css';

const localKey = 'climagame-session';
function App() {
  const [screen, setScreen] = useState('lobby');
  const [student, setStudent] = useState({ name:'', call:'', email:'', series:'' });
  const [roomCode, setRoomCode] = useState('AULA-8');
  const [filter, setFilter] = useState('Todos os temas');
  const [stageIndex, setStageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const sessionId = useRef(crypto.randomUUID());
  const stageThemes = useMemo(() => filter === 'Todos os temas' ? themes : [filter], [filter]);
  const stageQuestions = useMemo(() => questions.filter(q => q.theme === stageThemes[stageIndex]), [stageThemes, stageIndex]);
  const current = stageQuestions[questionIndex % Math.max(stageQuestions.length, 1)] || questions[0];
  const currentImage = questionImages[questions.indexOf(current)];
  const isLastQuestionOfStage = questionIndex === stageQuestions.length - 1;
  const isLastStage = stageIndex === stageThemes.length - 1;

  useEffect(() => { const saved = localStorage.getItem(localKey); if (saved) setStudent(JSON.parse(saved)); }, []);
  useEffect(() => () => socketRef.current?.close(), []);

  function selectStudent(name) {
    const found = (rosterByClass[student.series] || []).find(s => s.name === name);
    if (found) setStudent(s => ({ ...s, name: found.name, call: found.call, email: found.email }));
    else setStudent(s => ({ ...s, name, call:'', email:'' }));
  }
  function startGame() {
    if (!student.name || !student.email || !student.series || !student.call) return;
    localStorage.setItem(localKey, JSON.stringify(student));
    setScore(0); setAnswers(0); setStageIndex(0); setQuestionIndex(0); setLocked(false); setSelected(null); setScreen('game');
    connectRoom();
  }
  function connectRoom() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const url = import.meta.env.VITE_WS_URL || `${protocol}://${location.host}`;
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
    socketRef.current?.send(JSON.stringify({
      type: 'answer',
      correct,
      points,
      series: student.series,
      call: student.call,
      email: student.email,
      theme: current.theme,
      lesson: current.lesson,
      question: current.q,
      selectedOption: current.options[choice],
      correctOption: current.options[current.answer]
    }));
  }
  function next() {
    setSelected(null); setLocked(false);
    if (isLastQuestionOfStage) {
      if (isLastStage) { setScreen('complete'); return; }
      setStageIndex(stage => stage + 1);
      setQuestionIndex(0);
    } else {
      setQuestionIndex(question => question + 1);
    }
  }
  const rank = [...leaderboard, { id:sessionId.current, name:student.name || 'Você', score }].sort((a,b) => b.score - a.score);
  const myRank = Math.max(1, rank.findIndex(p => p.id === sessionId.current) + 1);

  if (screen === 'complete') return <main className="app-shell game-screen"><section className="completion-card"><div className="completion-icon"><Award size={34}/></div><span className="kicker">MISSÃO CONCLUÍDA</span><h1>Você completou todas as etapas!</h1><p>Você percorreu os {stageThemes.length} temas do 3º bimestre e acumulou sua pontuação ao longo da jornada.</p><div className="completion-score"><small>PLACAR FINAL</small><strong>{score.toString().padStart(4,'0')}</strong></div><button className="primary" onClick={() => { setScreen('lobby'); setStageIndex(0); setQuestionIndex(0); setScore(0); setAnswers(0); }}>Jogar novamente <RotateCcw size={18}/></button></section></main>;

  if (screen === 'lobby') return <main className="app-shell"><section className="hero"><div className="hero-copy"><div className="eyebrow"><CloudSun size={16}/> CIÊNCIAS · 8º ANO</div><h1>Clima<span>Game</span></h1><p className="hero-sub">Uma arena de perguntas para explorar o céu, o clima e as escolhas que cuidam do planeta.</p><div className="hero-pills"><span><Sparkles size={14}/> 12 desafios</span><span><Users size={14}/> jogue em equipe</span><span><Zap size={14}/> ranking ao vivo</span></div></div><div className="planet-art" aria-label="Renderização 3D realista da Terra vista do espaço, com satélite e correntes atmosféricas"><img src="/climate-3d-art.png" alt="Renderização 3D realista da Terra vista do espaço com o Brasil em destaque"/></div></section><section className="lobby-card"><div className="section-heading"><div><span className="kicker">ENTRADA DA EXPEDIÇÃO</span><h2>Quem está jogando?</h2><p>Preencha o cabeçalho da atividade para entrar na sala.</p></div><div className="live-badge"><span className="live-dot"/> sala aberta</div></div><div className="form-grid"><label className="field"><span>Série / turma</span><select value={student.series} onChange={e => setStudent({name:'',call:'',email:'',series:e.target.value})}><option value="">Selecione sua turma primeiro...</option><option>8º Ano A</option><option>8º Ano B</option></select></label><label className="field wide"><span>Nome completo</span><select value={student.name} onChange={e => selectStudent(e.target.value)} disabled={!student.series}><option value="">{student.series ? 'Selecione seu nome na lista...' : 'Escolha a turma primeiro...'}</option>{(rosterByClass[student.series] || []).map(s => <option key={s.call} value={s.name}>{s.call} · {s.name}</option>)}</select></label><label className="field"><span>Nº de chamada</span><input value={student.call} onChange={e => setStudent({...student,call:e.target.value})} placeholder="Ex.: 12" /></label><label className="field wide"><span>E-mail institucional</span><input type="email" value={student.email} onChange={e => setStudent({...student,email:e.target.value})} placeholder="seu.email@al.educacao.sp.gov.br" /></label><label className="field"><span>Código da sala</span><input value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} maxLength="12" /></label><label className="field wide"><span>Trilha de conteúdo</span><select value={filter} onChange={e => setFilter(e.target.value)}><option>Todos os temas</option>{themes.map(theme => <option key={theme}>{theme}</option>)}</select></label></div><div className="lobby-footer"><div className="privacy"><Info size={16}/><span>O ranking usa o nome informado apenas dentro da sala.</span></div><button className="primary" onClick={startGame} disabled={!student.name || !student.email || !student.call}>Entrar na arena <ArrowRight size={18}/></button></div></section><p className="curriculum-note">Conteúdos alinhados às aulas 1–24 do 3º bimestre: astronomia, previsão do tempo, climas regionais, El Niño/La Niña e equilíbrio ambiental.</p></main>;

  return <main className="app-shell game-screen"><header className="game-header"><div className="brand"><CloudSun size={22}/><strong>Clima<span>Game</span></strong><small>SALA {roomCode}</small></div><div className="header-stats"><div><small>SEU PLACAR</small><b>{score.toString().padStart(4,'0')}</b></div><div><small>POSIÇÃO</small><b>#{myRank}</b></div><div className="connection"><span className={connected ? 'live-dot' : 'offline-dot'}/>{connected ? 'ao vivo' : 'modo local'}</div></div></header><div className="game-layout"><section className="question-panel"><div className="question-meta"><span className="theme-tag">{current.theme}</span><span>ETAPA {stageIndex + 1} / {stageThemes.length} · {current.lesson}</span><span className="question-count">{questionIndex + 1} / {stageQuestions.length}</span></div><div className="progress"><i style={{width:`${((questionIndex + 1) / stageQuestions.length) * 100}%`}}/></div><div className="question-card"><div className="question-number">DESAFIO {String(questionIndex + 1).padStart(2,'0')}</div><h1>{current.q}</h1><figure className="question-visual"><img src={currentImage} alt="Ilustração 3D relacionada ao conteúdo da pergunta" /><figcaption>Visual científico do desafio</figcaption></figure><div className="answers">{current.options.map((option, i) => <button key={option} className={`answer ${locked ? (i === current.answer ? 'correct' : i === selected ? 'wrong' : 'dim') : ''}`} onClick={() => submitAnswer(i)} disabled={locked}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{locked && i === current.answer && <span className="answer-mark">✓</span>}</button>)}</div>{locked && <div className={`feedback ${selected === current.answer ? 'good' : 'bad'}`}><div>{selected === current.answer ? 'Mandou bem!' : 'Quase lá!'}</div><small>{current.explain}</small></div>}</div>{locked && <button className="next-button" onClick={next}>{isLastQuestionOfStage ? (isLastStage ? 'Finalizar jornada' : 'Avançar para próxima etapa') : 'Próximo desafio'} <ArrowRight size={18}/></button>}</section><aside className="rank-panel"><div className="rank-heading"><div><span className="kicker">PLACAR DA SALA</span><h2>Ranking em tempo real</h2></div><Radio size={18} className={connected ? 'pulse' : ''}/></div><div className="room-code"><span>CÓDIGO PARA JOGAR JUNTO</span><strong>{roomCode}</strong><button onClick={() => navigator.clipboard?.writeText(roomCode)} title="Copiar código"><Copy size={15}/></button></div><div className="rank-list">{rank.slice(0,8).map((p,i) => <div className={`rank-row ${p.id === sessionId.current ? 'me' : ''}`} key={p.id || p.name}><div className={`rank-position pos-${i+1}`}>{i < 3 ? <Crown size={14}/> : i+1}</div><div className="avatar">{p.name.slice(0,1)}</div><div className="rank-name"><b>{p.name === student.name ? 'Você' : p.name}</b><small>{p.answered ? 'respondeu' : 'na arena'}</small></div><strong>{p.score}</strong></div>)}</div><div className="rank-tip"><Activity size={16}/><span>O placar se atualiza automaticamente quando alguém responde.</span></div><button className="reset" onClick={() => { setScreen('lobby'); socketRef.current?.close(); }}><RotateCcw size={15}/> Sair e trocar de jogador</button></aside></div></main>;
}
createRoot(document.getElementById('root')).render(<App />);
