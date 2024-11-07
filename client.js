const net = require('net');
const readline = require('readline');

const p = 23;
const g = 5;

const privateKey = Math.floor(Math.random() * (p - 2)) + 1;
const publicKey = Math.pow(g, privateKey) % p;

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
        const otherPublicKey = parseInt(data.toString().trim());
        sharedKey = Math.pow(otherPublicKey, privateKey) % p;
        console.log('Chave Compartilhada:', sharedKey);
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
        console.log('Chave da Cifra de César (Deslocamento) para a mensagem:', sharedKey);

        const encryptedMessage = caesarCipher(input, sharedKey);
        console.log('Mensagem Cifrada Enviada:', encryptedMessage);
        client.write(encryptedMessage);
    } else {
        console.log('Aguardando chave compartilhada...');
    }
});