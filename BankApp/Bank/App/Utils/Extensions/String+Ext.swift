//
//  String+Ext.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import Foundation
import CommonCrypto
import UIKit

extension String {
    
    func hash256() -> String {
        let inputData = Data(utf8)
        var digest = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        inputData.withUnsafeBytes { bytes in
            _ = CC_SHA256(bytes.baseAddress, UInt32(inputData.count), &digest)
        }
        return String((digest.makeIterator().compactMap { String(format: "%02x", $0) }.joined()).prefix(32))
    }
    
}
