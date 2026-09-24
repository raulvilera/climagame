import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const port = Number(process.env.PORT || 8787);
const root = fileURLToPath(new URL('..', import.meta.url));
const rooms = new Map();
const questionsByRound = new Map();
const sheetsWebhookUrl = process.env.SHEETS_WEBHOOK_URL;
const sheetsWebhookSecret = process.env.SHEETS_WEBHOOK_SECRET;

async function recordAnswer(data) {
  if (!sheetsWebhookUrl || !sheetsWebhookSecret) return;
  try {
    await fetch(sheetsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, token: sheetsWebhookSecret })
    });
  } catch (error) {
    console.error('Falha ao registrar resposta na planilha:', error.message);
  }
}

function roomFor(code) {
  if (!rooms.has(code)) rooms.set(code, { players: new Map(), round: 0, question: null, started: false });
  return rooms.get(code);
}
function broadcast(code, payload) {
  const room = rooms.get(code);
  if (!room) return;
  const message = JSON.stringify(payload);
  for (const player of room.players.values()) if (player.socket.readyState === 1) player.socket.send(message);
}
function snapshot(room) {
  return [...room.players.values()]
    .map(({ id, name, score, answered }) => ({ id, name, score, answered }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
function sendState(code) {
  const room = rooms.get(code);
  if (room) broadcast(code, { type: 'leaderboard', players: snapshot(room), round: room.round, started: room.started });
}

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ service: 'ClimaGame multiplayer', rooms: rooms.size }));
    return;
  }
  const requested = pathname === '/' ? '/dist/index.html' : `/dist${pathname}`;
  try {
    const file = await readFile(join(root, requested));
    res.writeHead(200, { 'Content-Type': mime[extname(requested)] || 'application/octet-stream' });
    res.end(file);
  } catch {
    const file = await readFile(join(root, 'dist/index.html'));
    res.writeHead(200, { 'Content-Type': mime['.html'] });
    res.end(file);
  }
});
const wss = new WebSocketServer({ server });

wss.on('connection', socket => {
  let roomCode; let playerId;
  socket.on('message', raw => {
    let data; try { data = JSON.parse(raw.toString()); } catch { return; }
    if (data.type === 'join') {
      roomCode = String(data.room || 'AULA-8').toUpperCase().slice(0, 12);
      playerId = crypto.randomUUID();
      const room = roomFor(roomCode);
      room.players.set(playerId, { id: playerId, socket, name: String(data.name || 'Explorador'), score: 0, answered: false });
      socket.send(JSON.stringify({ type: 'joined', id: playerId, room: roomCode }));
      sendState(roomCode);
    }
    if (!roomCode || !playerId) return;
    const room = rooms.get(roomCode); const player = room?.players.get(playerId);
    if (!room || !player) return;
    if (data.type === 'start') { room.started = true; room.round = Number(data.round || 1); room.question = data.questionId; for (const p of room.players.values()) p.answered = false; broadcast(roomCode, { type: 'round', round: room.round, questionId: room.question }); sendState(roomCode); }
    if (data.type === 'answer') {
      if (player.answered) return;
      player.answered = true;
      if (data.correct) player.score += Math.max(100, Number(data.points || 100));
      void recordAnswer({
        name: player.name,
        series: data.series,
        call: data.call,
        email: data.email,
        room: roomCode,
        theme: data.theme,
        lesson: data.lesson,
        question: data.question,
        selectedOption: data.selectedOption,
        correctOption: data.correctOption,
        correct: Boolean(data.correct),
        points: Number(data.points || 0)
      });
      sendState(roomCode);
    }
    if (data.type === 'reset') { for (const p of room.players.values()) { p.score = 0; p.answered = false; } room.round = 0; room.started = false; sendState(roomCode); }
  });
  socket.on('close', () => { if (roomCode && rooms.has(roomCode)) { rooms.get(roomCode).players.delete(playerId); sendState(roomCode); } });
});
server.listen(port, '0.0.0.0', () => console.log(`ClimaGame multiplayer on :${port}`));
