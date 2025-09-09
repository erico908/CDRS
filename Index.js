const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Messages et bannissements en mémoire
let messages = [];
let bannedIps = [];

// Vérifier si IP est bannie
function isBanned(ip) {
  return bannedIps.includes(ip);
}

// Poster un message
app.post("/message", (req, res) => {
  const ip = req.ip;
  if (isBanned(ip)) return res.status(403).json({ error: "Tu es banni !" });
  messages.push({ user: "user", content: req.body.content });
  res.json({ success: true });
});

// Voir les messages
app.get("/messages", (req, res) => {
  res.json(messages);
});

// Admin : bannir
app.post("/ban", (req, res) => {
  const { ip, code } = req.body;
  if (code !== "MONCODESECRET") return res.status(403).json({ error: "Code admin invalide" });
  bannedIps.push(ip);
  res.json({ success: true, banned: ip });
});

// Lancer le serveur
app.listen(PORT, () => console.log(`Serveur en ligne sur http://localhost:${PORT}`));
