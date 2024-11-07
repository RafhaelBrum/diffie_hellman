const net = require('net');
const readline = require('readline');

const p = 23;
const g = 5;

let privateKey = Math.floor(Math.random() * (p - 2)) + 1;
let publicKey = Math.pow(g, privateKey) % p;

console.log('Minha Chave Privada:', privateKey);
console.log('Minha Chave Pública:', publicKey);

const options = { host: 'localhost', port: 3000 };
const client = net.createConnection(options, () => {
    console.log('Conectado ao servidor');
    client.write(publicKey.toString());
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let sharedKey;

client.on('data', (data) => {
    if (!sharedKey) {
        // Recebe a chave pública do servidor (ou do outro cliente)
        const otherPublicKey = parseInt(data.toString().trim());
        sharedKey = Math.pow(otherPublicKey, privateKey) % p;
        console.log('Chave Compartilhada Estabelecida:', sharedKey);
    } else {
        const encryptedMessage = data.toString().trim();
        console.log('Mensagem Cifrada Recebida:', encryptedMessage);
        const decryptedMessage = caesarCipher(encryptedMessage, -sharedKey);
        console.log('Mensagem Decifrada:', decryptedMessage);
    }
});

function caesarCipher(message, shift) {
    return message.split('').map(char => {
        const code = char.charCodeAt(0);
        return String.fromCharCode((code + shift + 128) % 128);
    }).join('');
}

rl.on('line', (input) => {
    if (sharedKey) {
        // Gera nova chave privada e pública a cada mensagem
        privateKey = Math.floor(Math.random() * (p - 2)) + 1;
        publicKey = Math.pow(g, privateKey) % p;

        console.log('Nova Chave Privada:', privateKey);
        console.log('Nova Chave Pública:', publicKey);

        // Envia a nova chave pública ao servidor
        client.write(publicKey.toString());

        console.log('Chave da Cifra de César (Deslocamento) para a mensagem:', sharedKey);
        const encryptedMessage = caesarCipher(input, sharedKey);
        console.log('Mensagem Cifrada Enviada:', encryptedMessage);
        client.write(encryptedMessage);
    } else {
        console.log('Aguardando chave compartilhada...');
    }
});
