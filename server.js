const http = require('http');
const pool = require('./db.js');

const server = http.createServer(async (req, res) => {

    // Configuração CORS
    // Qual origem tem permissão para acessar o servidor
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

    // Quais métodos são permitidos da origem
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Quais cabeçalhos HTTP o navegador permite que o frontend envie
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // BUSCA USUÁRIOS
    if (req.url === '/usuarios' && req.method === 'GET') {

        try {
            const resultado = await pool.query('SELECT * FROM usuarios');

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(resultado.rows));

        } catch (erro) {
            console.error(erro);
            res.writeHead(500);
            res.end('Erro ao buscar usuários');
        }
    }

    // CRIA USUÁRIO
    if (req.url === '/usuarios' && req.method === 'POST') {

        let corpo = '';

        // Conforme os pedaços da requisição chegam é adicionado ao corpo
        req.on('data', (parte) => {
            corpo += parte;
        });

        req.on('end', async () => {
            try {
                const usuario = JSON.parse(corpo);

                const resultado = await pool.query(`INSERT INTO usuarios (nome, email, senha, create_time) VALUES ($1, $2, $3, NOW()) RETURNING *`, [usuario.nome, usuario.email, usuario.senha]);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    usuario: resultado.rows[0]
                }));

            } catch (erro) {
                console.error(erro);
                res.writeHead(400);
            }
        });
    }

    // EDITA USUÁRIO
    if (req.url === '/usuarios' && req.method === 'PUT') {

        let corpo = '';

        req.on('data', (parte) => {
            corpo += parte
        });

        req.on('end', async () => {
            try {
                const usuario = JSON.parse(corpo);

                const resultado = await pool.query(`UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *`, [usuario.nome, usuario.email, usuario.senha, usuario.id]);

                res.writeHead(200, {
                    'Content-type': 'application/json'
                });

                res.end(JSON.stringify(resultado.rows[0]));

            } catch (erro) {
                console.error(erro);
                res.writeHead(400)
            }
        })
    }

    if(req.url === '/usuarios' && req.method === 'DELETE'){
        
        let corpo = '';

        req.on('data', (parte) =>{
            corpo += parte;
        });

        req.on('end', async () => {
            try {
                const usuario = JSON.parse(corpo);
                const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1', [usuario.id]);

                res.writeHead(200, {
                    'Content-type': 'application/json'
                });

                res.end(JSON.stringify({
                    mensagem: "Excluido com sucesso."
                }));

            }catch(erro){
                console.error(erro);
                res.writeHead(400);
            }
        })
    }
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});