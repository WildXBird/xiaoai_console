import * as crypto from "crypto"




const TOKEN_PRIVATE_KEY = ""
const TOKEN_PUBLIC_KEY = ""
const TOKEN_EXPIRE_DAYS = 7
type userAccessLevel = "user" | "admin" | "master"
/**
 * 固定公私钥并保密
 * 随机生成AESKEY 并加密
 * 随机生成AESIV 并公开
 */

type RSA_PRIVATE_KEY = string
type RSA_PUBLIC_KEY = string
type RSA_EncryptableData = Buffer
type RSA_EncryptedData = Buffer
type RSA_DecryptedData = Buffer
type AES_KEY = Buffer
type AES_IV = Buffer
type AES_EncryptableData = Buffer
type AES_EncryptedData = string
type AES_DecryptedData = string

let RSAencrypt = function (privateKey: RSA_PRIVATE_KEY, buffer: RSA_EncryptableData): RSA_EncryptedData {
    return crypto.privateEncrypt({ key: privateKey, passphrase: '' }, buffer);
}
let RSAdecrypt = function (publicKey: RSA_PUBLIC_KEY, encryptData: RSA_EncryptedData): RSA_DecryptedData {
    return crypto.publicDecrypt({ key: publicKey, }, encryptData);
}
let AESencrypt = function (key: AES_KEY, iv: AES_IV, buffer: AES_EncryptableData): AES_EncryptedData {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return cipher.update(buffer, undefined, "base64") + cipher.final("base64");
}
let AESdecrypt = function (key: AES_KEY, iv: AES_IV, encryptData: AES_EncryptedData): AES_DecryptedData {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return decipher.update(encryptData, "base64", "utf8") + decipher.final('utf8');
}

///////////////TOKEN细节///////////////////////////

interface AuthorizationCreationData {
    uid: number,
    ua: string,
    ip: string,
    level: userAccessLevel,
    expireTime?: Date
    remember?: boolean

}
type AuthorizationBody = {
    uid: number,
    ua: string,
    ip: string,
    level: userAccessLevel,
    createTime: string,
    expireTime: string,
    rmToken?: boolean
}
type RemberTokenBody = {} & AuthorizationBody
type AuthorizationTokenObj = {
    ver: number,
    env: string,
    typ: "bdt",
    enc: "A128CBC",
    int: "RS256",
    iv: string,
    key: string,
    body: string,
}
type AuthorizationToken = string

export type AuthorizationTokenCreation = {
    authorizationToken: AuthorizationToken,
    rememberToken: string | undefined
}
export type AuthorizationDecodeResult = RemberTokenBody | AuthorizationBody | undefined
function isTokenExpired(AuthorizationTokenText: string): boolean {
    return false
}


export function CreateAuthorization(data: AuthorizationCreationData): AuthorizationTokenCreation {
    const AES_KEY: AES_KEY = crypto.randomBytes(16);
    const AES_IV: AES_IV = crypto.randomBytes(16);
    const RSA_PRIVATE_KEY: RSA_PRIVATE_KEY = TOKEN_PRIVATE_KEY
    const encryptedAESKey: Buffer = RSAencrypt(RSA_PRIVATE_KEY, AES_KEY)
    let expireTime: string
    if (data.expireTime instanceof Date) {
        expireTime = data.expireTime.toISOString()
    } else {
        expireTime = new Date(new Date().valueOf() + (TOKEN_EXPIRE_DAYS * 3600 * 24 * 1000)).toISOString()
    }

    const AuthorizationBody: AuthorizationBody = {
        uid: data.uid,
        ua: data.ua,
        ip: data.ip,
        level: data.level,
        // ...data,
        createTime: new Date().toISOString(),
        expireTime,
    }
    const AuthorizationBodyBuffer: Buffer = Buffer.from(JSON.stringify(AuthorizationBody))
    const encryptedAuthorizationBase64Body: string = AESencrypt(AES_KEY, AES_IV, AuthorizationBodyBuffer)
    const AuthorizationTokenObj: AuthorizationTokenObj = {
        ver: 1,
        env: "Prod",
        typ: "bdt",
        enc: "A128CBC",
        int: "RS256",
        iv: AES_IV.toString("base64"),
        key: encryptedAESKey.toString("base64"),
        body: encryptedAuthorizationBase64Body
    }
    const AuthorizationToken: string = Buffer.from(JSON.stringify(AuthorizationTokenObj)).toString('base64')
    let rememberToken = undefined
    if (data.remember) {
        const RemberTokenBody: RemberTokenBody = {
            rmToken: true,
            ...AuthorizationBody
        }
        const RemberTokenBodyBuffer: Buffer = Buffer.from(JSON.stringify(RemberTokenBody))
        const encryptedRemberTokenBase64Body: string = AESencrypt(AES_KEY, AES_IV, RemberTokenBodyBuffer)
        const RemberTokenObj: AuthorizationTokenObj = {
            ver: 1,
            env: "Prod",
            typ: "bdt",
            enc: "A128CBC",
            int: "RS256",
            iv: AES_IV.toString("base64"),
            key: encryptedAESKey.toString("base64"),
            body: encryptedRemberTokenBase64Body
        }
        const RemberToken: string = Buffer.from(JSON.stringify(RemberTokenObj)).toString('base64')
        rememberToken = RemberToken
    }

    return {
        authorizationToken: AuthorizationToken,
        rememberToken,
    }
}

export function DecodeAuthorization(data: AuthorizationToken): AuthorizationDecodeResult {
    try {
        if (data.length < 50) {
            throw "TokenTooShortOrEmpty"
        }
        if (isTokenExpired(data)) {
            throw "TokenExpired"
        }

        const AuthorizationTokenMD5 = TokenText2MD5(data)
        if (typeof (deprecatedTokenList[AuthorizationTokenMD5]) !== "undefined") {
            throw "TokenDeprecated"
        }

        const RSA_PUBLIC_KEY: RSA_PUBLIC_KEY = TOKEN_PUBLIC_KEY
        const AuthorizationTokenText: string = Buffer.from(data, "base64").toString("utf8");
        const AuthorizationTokenObj: AuthorizationTokenObj = JSON.parse(AuthorizationTokenText)
        const AES_IV: AES_IV = Buffer.from(AuthorizationTokenObj.iv, "base64")
        const encryptedAESKey: Buffer = Buffer.from(AuthorizationTokenObj.key, "base64")
        const encryptedAuthorizationBase64Body: string = AuthorizationTokenObj.body
        if ("A128CBC" === AuthorizationTokenObj.enc && "RS256" === AuthorizationTokenObj.int) {
            const AES_KEY: AES_KEY = RSAdecrypt(RSA_PUBLIC_KEY, encryptedAESKey)
            const AuthorizationBodyText: string = AESdecrypt(AES_KEY, AES_IV, encryptedAuthorizationBase64Body)
            const AuthorizationBody: AuthorizationDecodeResult = JSON.parse(AuthorizationBodyText)
            if (AuthorizationBody) {
                const TokenExpireTimeValue = new Date(AuthorizationBody.expireTime).valueOf()
                if (new Date().valueOf() < TokenExpireTimeValue) {
                    return AuthorizationBody
                }
            }
        }
        throw "TypeError"
    } catch (error) {
        return undefined
    }
}

export function TokenText2MD5(token: string): string {
    var hash = crypto.createHash('md5');
    hash.update(token);
    return hash.digest('hex');
}

export function AuthorizationText2B64(token: string): string | undefined {
    if (token.startsWith("Bdc_v1 t=") || token.startsWith("rm_v1 t=")) {
        const B64 = token.replace("Bdc_v1 t=", "").replace("rm_v1 t=", "")
        return B64
    }
}

//logout lab 
type TokenExpireDate = Date
type DeprecatedTokenList = {
    [md5: string]: TokenExpireDate
}
const deprecatedTokenList: DeprecatedTokenList = {}

export function AddDeprecatedToken(authorizationText: string) {
    return new Promise<boolean>(function (resolve, reject) {
        setTimeout(() => {
            resolve(false)
        }, 1000 * 5);
        const authorizationB64Text = AuthorizationText2B64(authorizationText)
        if (authorizationB64Text) {
            const decodeResult = DecodeAuthorization(authorizationB64Text)
            if (decodeResult) {
                const expireTimeText = decodeResult.expireTime
                let expireTime: Date = new Date(new Date().valueOf() + 1000 * 3600 * 24 * 30)
                try {
                    expireTime = new Date(expireTimeText)
                } catch (error) {

                }
                const md5 = TokenText2MD5(authorizationB64Text)
                deprecatedTokenList[md5] = expireTime
                resolve(true)
            }
        }
    })
}
