//
//  Encryption.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import Foundation
import SwiftyJSON
import CommonCrypto

class Encryption {
    
    static let _key = "Ynk&er3bflx9%"
    static let _iv = "84jlkfndl3nhbdfkf"
    
    static func randomGenerateBytes(count: Int) -> Data? {
        let bytes = UnsafeMutableRawPointer.allocate(byteCount: count, alignment: 1)
        defer { bytes.deallocate() }
        let status = CCRandomGenerateBytes(bytes, count)
        guard status == kCCSuccess else { return nil }
        return Data(bytes: bytes, count: count)
    }
    
    static func encrypt(data: String, iv: String = _key.hash256(), key: String = _iv) -> String {
        return data.aesEcrypt(key: key.hash256(), iv: iv) ?? ""
    }
    
    static func encryptStatic(data: String) -> String {
        return data.aesEcrypt(key: _key.hash256(), iv: _iv) ?? ""
    }
    
    static func decryptStatic(data: String) -> String {
        return data.aesDecrypt(key: _key.hash256(), iv: _iv) ?? ""
    }
    
    static func encryptASE(dataToSend: String, key: String, iv: String) -> String {
        return dataToSend.aesEcrypt(key: key.hash256(), iv: iv) ?? ""
    }

}

extension String {
    
    func aesDecrypt(key:String, iv:String, options:Int = kCCOptionPKCS7Padding) -> String? {
        if let keyData = key.data(using: .utf8),
           let data = Data(base64Encoded: self, options: NSData.Base64DecodingOptions(rawValue: 0)),
           let ivData = iv.data(using: .utf8) {
            
            let cryptLength = data.count + kCCBlockSizeAES128
            var cryptData   = Data(count: cryptLength)

            let keyLength = key.count
            let options:   CCOptions   = UInt32(options)
            let operation: CCOperation = UInt32(kCCDecrypt)
            let algoritm:  CCAlgorithm = UInt32(kCCAlgorithmAES128)

            var bytesLength = Int(0)
            
            
            let status = cryptData.withUnsafeMutableBytes { cryptBytes in
                data.withUnsafeBytes { dataBytes in
                    ivData.withUnsafeBytes { ivBytes in
                        keyData.withUnsafeBytes { keyBytes in
                            CCCrypt(operation, algoritm, options, keyBytes.baseAddress, keyLength, ivBytes.baseAddress, dataBytes.baseAddress, data.count, cryptBytes.baseAddress, cryptLength, &bytesLength)
                        }
                    }
                }
            }
                        
            if UInt32(status) == UInt32(kCCSuccess) {
                cryptData.removeSubrange(bytesLength..<cryptData.count)
                
                let unencryptedMessage = String(data: cryptData as Data, encoding: String.Encoding.utf8)
                return unencryptedMessage
            }
        }
        return nil
    }
    
    func aesEcrypt(key: String, iv: String, options: Int = kCCOptionPKCS7Padding) -> String? {
        if let keyData = key.data(using: .utf8),
           let data = self.data(using: .utf8),
           let ivData = iv.data(using: .utf8) {
            
            let cryptLength = data.count + kCCBlockSizeAES128
            var cryptData   = Data(count: cryptLength)

            let keyLength = key.count
            let options:   CCOptions   = UInt32(options)
            let operation: CCOperation = UInt32(kCCEncrypt)
            let algoritm:  CCAlgorithm = UInt32(kCCAlgorithmAES128)

            var bytesLength = Int(0)
            
            
            let status = cryptData.withUnsafeMutableBytes { cryptBytes in
                data.withUnsafeBytes { dataBytes in
                    ivData.withUnsafeBytes { ivBytes in
                        keyData.withUnsafeBytes { keyBytes in
                            CCCrypt(operation, algoritm, options, keyBytes.baseAddress, keyLength, ivBytes.baseAddress, dataBytes.baseAddress, data.count, cryptBytes.baseAddress, cryptLength, &bytesLength)
                        }
                    }
                }
            }
            
            if UInt32(status) == UInt32(kCCSuccess) {
                cryptData.removeSubrange(bytesLength..<cryptData.count)
                
                return cryptData.base64EncodedString()
            }
            
        }
        
        return nil
    }
    
}

extension Data {
    public static func fromBase64(_ encoded: String) -> Data? {
        var encoded = encoded;
        let remainder = encoded.count % 4
        if remainder > 0 {
            encoded = encoded.padding(
                toLength: encoded.count + 4 - remainder,
                withPad: "=", startingAt: 0);
        }
        return Data(base64Encoded: encoded);
    }
}
