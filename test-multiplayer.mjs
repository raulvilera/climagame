import WebSocket from 'ws';
const ws = new WebSocket('ws://127.0.0.1:8787');
const received = [];
const timeout = setTimeout(() => { console.error('multiplayer-timeout'); process.exit(1); }, 3000);
ws.on('open', () => ws.send(JSON.stringify({ type:'join', room:'TESTE', name:'Aluno teste' })));
ws.on('message', raw => {
  const data = JSON.parse(raw.toString()); received.push(data.type);
  if (data.type === 'joined') ws.send(JSON.stringify({ type:'answer', correct:true, points:100 }));
  if (data.type === 'leaderboard') {
    if (data.players?.[0]?.score === 100) { console.log('multiplayer-ok', received.join(',')); clearTimeout(timeout); ws.close(); }
  }
});
