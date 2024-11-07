const net = require('net');
let clients = [];
const p = 23;
const g = 5;

const server = net.createServer((socket) => {
    clients.push(socket);

    if (clients.length === 2) {
        // Recebe a chave pública do Cliente 1 e envia para o Cliente 2
        clients[0].on('data', (data) => {
            console.log('Chave Pública do Cliente 1:', data.toString().trim());
            clients[1].write(data);
        });

        // Recebe a chave pública do Cliente 2 e envia para o Cliente 1
        clients[1].on('data', (data) => {
            console.log('Chave Pública do Cliente 2:', data.toString().trim());
            clients[0].write(data);
        });
    }
});

server.listen(3000, () => {
    console.log('Servidor escutando na porta 3000');
});
