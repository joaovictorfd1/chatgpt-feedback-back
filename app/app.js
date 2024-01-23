const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/chatgpt-feedback-back', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

// Definir um esquema simples
const Schema = mongoose.Schema;

const newQuestion = new Schema({
  id: {
    type: Number,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: String,
    allowNull: false,
  },
  awnser: {
    type: String,
    allowNull: false,
  },
})

const exemploSchema = new Schema({
  nome: String,
  idade: Number
});

// Criar um modelo com base no esquema
const Exemplo = mongoose.model('Exemplo', exemploSchema);
const Question = mongoose.model('Question', newQuestion)

// Rota para adicionar uma pergunta
app.post('/question', async (req, res) => {
  console.log(req.body)
  try {
    const newQuestion = new Question(req.body)
    await newQuestion.save();
    res.status(200).json(newQuestion)
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      const mensagensErro = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ erro: 'Erro de validação', mensagens: mensagensErro });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
})

// Rota para adicionar um exemplo ao MongoDB
app.get('/question', async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// Rota para obter exemplos do MongoDB
app.get('/obterExemplos', async (req, res) => {
  try {
    const exemplos = await Exemplo.find();
    res.json(exemplos);
  } catch (err) {
    res.status(500).send('Erro ao obter exemplos do MongoDB.');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
