const crypto = require("crypto")
const fs = require("fs")

// const AES_KEY = 'd0D8nlgPLrwVD0LsNPhbtlhJm9MRYv9dKaOA4VWRgAwlpTZ8oHXPRp5Z35rJyf08cHSRPNSk8g87HnuP0S27hEqdBq'
// const AES_IV = 'WlHDnZR4xGtZTih2QJBULxE6iqcHmRUJawm4fUwbkoKKvOsPaP'
{
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 1024,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: ''
        }
    });
    fs.writeFileSync("public_key", keyPair.publicKey);
    fs.writeFileSync("private_Key", keyPair.privateKey);
}