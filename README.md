# nip07ex
NativeMessagingを用いたnostr NIP-07実装例

ブラウザ拡張はあくまで橋渡しに徹し、nodejs上で署名や暗号化を実施します。  
そのためブラウザに秘密鍵が保存されません。

ハードウェアウォレットの実装に向けた準備実装です。

開発者向けのため、セットアップの手順が面倒です。  
また、現状Google Chrome専用です。

実用性は保証しません。At your own risk, Don't trust meでお願いします。

## 使い方
0. C:\nsec_privatekey.txt にnsec形式の秘密鍵を書き込んでおきます。
0. nodejsをインストールしPATHを通しておきます。
0. nip07exを適当なフォルダに解凍します
0. nativemessaging-manifest.jsonを開き、pathを正しい場所(解凍した場所に基づく値)に修正します。
0. nip07ex_reg.reg を開き、@=以降のパスを正しい場所(解凍した場所に基づく値)に修正し、実行してレジストリに書き込みます。
0. extensionフォルダを、デベロッパーモードを有効にしたGoogle Chromeで「パッケージ化されていない拡張機能を読み込む」で読み込みます
0. 拡張機能IDが表示されるので、nativemessaging-manifest.json内のallowed_originsをそのIDに書き換えます
0. 正常に動作すれば、NIP-07要求時にダイアログが出ます。

