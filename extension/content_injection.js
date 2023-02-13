//各サイトに直接注入されるScript
//window.nostrを提供するため。
console.log("[nip07ex] [content_injection.js]", location.origin);

// https://zenn.dev/ellreka/articles/799632c02d1cb5
// https://qiita.com/naoiwata/items/0a31d999b2dcd5098289
// https://advancedweb.hu/how-to-use-async-await-with-postmessage/

window.nostr = {
    getPublicKey: async function () {
        //公開鍵要求
        console.log("[nip07ex] [content_injection.js]", "getPublicKey");

        //応答待ちのためのPromise
        const ret = await new Promise((resolve) => {
            //この要求のためのワンタイムなメッセージチャネルを生成
            const channel = new MessageChannel();
            //応答が帰ってきたらこの関数の戻り値とする
            channel.port1.onmessage = (e) => {
                resolve(e.data);
            }

            //メッセージチャネルを添えて要求を投げ上げる
            window.postMessage({
                uuid: "f4fcce3d-1ad5-98bf-d859-ddf1cdeb6429",
                type: "getPublicKey",
            }, location.origin, [channel.port2]);
        })
        console.log("[nip07ex]", "getPublicKey", ret);
        return ret;
    },

    signEvent: async function (event) {
        //署名要求
        console.log("[nip07ex] [content_injection.js]", "signEvent", event);

        //応答待ちのためのPromise
        const ret = await new Promise((resolve) => {
            //この要求のためのワンタイムなメッセージチャネルを生成
            const channel = new MessageChannel();
            //応答が帰ってきたらこの関数の戻り値とする
            channel.port1.onmessage = (e) => {
                resolve(e.data);
            }

            //メッセージチャネルを添えて要求を投げ上げる
            window.postMessage({
                uuid: "f4fcce3d-1ad5-98bf-d859-ddf1cdeb6429",
                type: "signEvent",
                event: event,
            }, location.origin, [channel.port2]);
        })
        console.log("[nip07ex] [content_injection.js]", "signEvent", ret);
        return ret;
    },
    nip04: {
        encrypt: async function (pubkey, plaintext) {
            //暗号化要求
            console.log("[nip07ex] [content_injection.js]", "nip04.encrypt", pubkey, plaintext);

            //応答待ちのためのPromise
            const ret = await new Promise((resolve) => {
                //この要求のためのワンタイムなメッセージチャネルを生成
                const channel = new MessageChannel();
                //応答が帰ってきたらこの関数の戻り値とする
                channel.port1.onmessage = (e) => {
                    resolve(e.data);
                }

                //メッセージチャネルを添えて要求を投げ上げる
                window.postMessage({
                    uuid: "f4fcce3d-1ad5-98bf-d859-ddf1cdeb6429",
                    type: "nip04.encrypt",
                    pubkey: pubkey,
                    plaintext: plaintext
                }, location.origin, [channel.port2]);
            })
            console.log("[nip07ex] [content_injection.js]", "nip04.encrypt", ret);
            return ret;
        },

        decrypt: async function (pubkey, ciphertext) {
            //暗号化要求
            console.log("[nip07ex] [content_injection.js]", "nip04.decrypt", pubkey, ciphertext);

            //応答待ちのためのPromise
            const ret = await new Promise((resolve) => {
                //この要求のためのワンタイムなメッセージチャネルを生成
                const channel = new MessageChannel();
                //応答が帰ってきたらこの関数の戻り値とする
                channel.port1.onmessage = (e) => {
                    resolve(e.data);
                }

                //メッセージチャネルを添えて要求を投げ上げる
                window.postMessage({
                    uuid: "f4fcce3d-1ad5-98bf-d859-ddf1cdeb6429",
                    type: "nip04.decrypt",
                    pubkey: pubkey,
                    ciphertext: ciphertext
                }, location.origin, [channel.port2]);
            })
            console.log("[nip07ex] [content_injection.js]", "nip04.decrypt", ret);
            return ret;
        }
    },
};
