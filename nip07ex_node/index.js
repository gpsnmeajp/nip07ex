//"C:\Program Files\Google\Chrome\Application\chrome.exe" --enable-logging=stderr
const fs = require('fs');
const { exit } = require('process');
globalThis.crypto = require('crypto');
const {
    nip04,
    nip19,
    validateEvent,
    verifySignature,
    signEvent,
    getEventHash,
    getPublicKey
} = require('nostr-tools');
const winax = require('winax');
const wsh = new winax.Object('WScript.Shell');

// https://dev.classmethod.jp/articles/chrome-native-message/

let { type, data } = nip19.decode(fs.readFileSync("C:\\nsec_privatekey.txt", 'utf8'));
if (type != "nsec") { exit(-1); }
global.privateKey = data; //グローバル変数にする

//標準入力処理
process.stdin.on('readable', () => {
    var input = []
    var chunk
    while (chunk = process.stdin.read()) {
        input.push(chunk)
    }
    input = Buffer.concat(input)

    var msgLen = input.readUInt32LE(0)
    var dataLen = msgLen + 4

    if (input.length >= dataLen) {
        var content = input.slice(4, dataLen)
        var json = JSON.parse(content.toString())
        handleMessage(json)
    }
})

async function handleMessage(message) {
    try {
        console.error(`Received ${message} from extension`);
        fs.writeFileSync("input.txt", JSON.stringify(message));

        if (message.data.type === "getPublicKey") {
            const result = wsh.Popup("公開鍵を提供しますか？\n要求元: "+ message.origin +"",0,"nip07ex",1+32+256+65536);
            if(result === 1){
                output(getPublicKey(global.privateKey));
            }else{
                output(null);
            }
            return;
        }
        if (message.data.type === "signEvent") {
            let event = message.data.event;
            const result = wsh.Popup("署名しますか？\n要求元: "+ message.origin +"\nkind:"+ event.kind +"\ncontent: "+event.content + "\ntag:"+ JSON.stringify(event.tags),0,"nip07ex",1+32+256+65536);
            if(result === 1){
                event.pubkey = getPublicKey(global.privateKey);
                event.id = getEventHash(event);
                event.sig = signEvent(event, global.privateKey);
                output(event);
            }else{
                output(null);
            }
            return;
        }
        if (message.data.type === "nip04.encrypt") {
            const result = wsh.Popup("暗号化しますか？\n要求元: "+ message.origin +"\nplaintext: "+message.data.plaintext ,0,"nip07ex",1+32+256+65536);
            if(result === 1){
                output(await nip04.encrypt(global.privateKey, message.data.pubkey, message.data.plaintext));
            }else{
                output(null);
            }
            return;
        }
        if (message.data.type === "nip04.decrypt") {
            const decrypt_result = await nip04.decrypt(global.privateKey, message.data.pubkey, message.data.ciphertext)
            const result = wsh.Popup("復号結果を提供しますか？\n要求元: "+ message.origin +"\nplaintext: "+decrypt_result ,0,"nip07ex",1+32+256+65536);
            if(result === 1){
                output(decrypt_result);
            }else{
                output(null);
            }
            return;
        }
        throw "unkwon command";
    } catch (e) {
        fs.writeFileSync("exception.txt", e.toString() + " : " + e.stack);
    }
}

//標準出力処理
function sendMessage(msg) {
    var buffer = Buffer.from(JSON.stringify(msg))

    var header = Buffer.alloc(4)
    header.writeUInt32LE(buffer.length, 0)

    var data = Buffer.concat([header, buffer])
    process.stdout.write(data)
}

//エラー処理
process.on('uncaughtException', (err) => {
    sendMessage({ error: err.toString() })
})

function output(data) {
    fs.writeFileSync("output.txt", JSON.stringify(data));
    sendMessage(data);
}


