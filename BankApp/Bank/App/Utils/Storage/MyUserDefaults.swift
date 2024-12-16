//
//  MyUserDefaults.swift
//  Bank
//
//  Created by MavineNaaman on 14/12/2024.
//

import UIKit


enum MyUserDefaultKey: String {
    case email = "email"
    case deviceToken = "deviceToken"
    case name = "name"
    case phoneNo = "phoneNo"
    case gender = "gender"
    case deviceTokenSent = "deviceTokenSent"
    case imgUri = "imgUri"
    case firstLogin = "firstLogin"
    case loggedIn = "loggedIn"
    case languageChanged = "languageChanged"
    case appId = "appId"
    case customerId = "customerId"
    case deviceActivated = "deviceActivated"
    
}

class MyUserDefault {

    static func value<T>(defaultValue: T, forKey key: MyUserDefaultKey) -> T {
        
        if defaultValue is Bool {
            return getBoolean(defaultValue: defaultValue as! Bool, forKey: key) as! T
        }
        
        if defaultValue is Data {
            return getData(defaultValue: defaultValue as? Data, forKey: key) as! T
        }
        
        if defaultValue is Int {
            return getInt(defaultValue: defaultValue as! Int, forKey: key) as! T
        }

        let preferences = UserDefaults.standard
        
        let value = preferences.object(forKey: key.rawValue)
        
        if value == nil {
            return defaultValue
        }
        
        
        let decrypted = Encryption.decryptStatic(data: String(describing: value!))
                
        if decrypted.isEmpty {
            return defaultValue
        }
                
        
        return decrypted as? T ?? defaultValue
    }

    static func value(value: Any, forKey key: MyUserDefaultKey){
        UserDefaults.standard.set(Encryption.encryptStatic(data: String(describing: value)), forKey: key.rawValue)
    }
    
    static func valueClearText<T>(defaultValue: T, forKey key: MyUserDefaultKey) -> T {
        return UserDefaults.standard.object(forKey: key.rawValue) == nil ? defaultValue : UserDefaults.standard.object(forKey: key.rawValue) as! T
    }

    static func valueClearText(value: Any, forKey key: MyUserDefaultKey){
        UserDefaults.standard.set(value, forKey: key.rawValue)
    }
    
    static func getBoolean(defaultValue: Bool, forKey key: MyUserDefaultKey) -> Bool {

        let preferences = UserDefaults.standard
        
        let value = preferences.object(forKey: key.rawValue)
        
        if value == nil {
            return defaultValue
        }
        
        
        let decrypted = Encryption.decryptStatic(data: String(describing: value!))
        
        if decrypted.isEmpty {
//            let rawValue = value as? Bool
//            return rawValue ?? defaultValue
            return defaultValue
        }
                
        
        return Bool(decrypted) ?? defaultValue
    }
    
    static func getData(defaultValue: Data?, forKey key: MyUserDefaultKey) -> Data? {
        
        let preferences = UserDefaults.standard
        
        let value = preferences.data(forKey: key.rawValue)
        
        if value == nil {
            return defaultValue
        }
        
        
        let decrypted = Encryption.decryptStatic(data: String(describing: value!))
        if decrypted.isEmpty {
            return defaultValue
        }
        return decrypted.data(using: .utf8)
    }
    
    static func getInt(defaultValue: Int, forKey key: MyUserDefaultKey) -> Int {

        let preferences = UserDefaults.standard
        
        let value = preferences.object(forKey: key.rawValue)
        
        if value == nil {
            return defaultValue
        }
        
        
        let decrypted = Encryption.decryptStatic(data: String(describing: value!))
        
        if decrypted.isEmpty {
//            let rawValue = value as? Int
//            return rawValue ?? defaultValue
            return defaultValue
        }
                
        
        return Int(decrypted) ?? defaultValue
    }

}

extension MyUserDefault {

    
    static func setName(_ val: String) {
        value(value: val, forKey: .name)
    }
    
    static func getName() -> String {
        return value(defaultValue: "", forKey: .name)
    }
    
    static func setEmail(_ val: String) {
        value(value: val, forKey: .email)
    }
    
    static func getEmail() -> String? {
        return value(defaultValue: nil, forKey: .email)
    }
    
    static func setPhoneNo(_ val: String) {
        value(value: val, forKey: .phoneNo)
    }
    
    
    static func setDeviceToken(_ val: String) {
        value(value: val, forKey: .deviceToken)
    }
    
    static func getDeviceToken() -> String {
        return value(defaultValue: "", forKey: .deviceToken)
    }

    static func loggedIn(_ val: Bool) {
        value(value: val, forKey: .loggedIn)
    }
    
    static func loggedIn() -> Bool {
        return value(defaultValue: false, forKey: .loggedIn)
    }
    
    static func deviceTokenSent(_ val: Bool) {
        value(value: val, forKey: .deviceTokenSent)
    }
    
    static func deviceTokenSent() -> Bool {
        return value(defaultValue: false, forKey: .deviceTokenSent)
    }
    
    static func languageChanged() -> Bool {
        return value(defaultValue: false, forKey: .languageChanged)
    }
    
    static func setAppId(_ val: String) {
        value(value: val, forKey: .appId)
    }
    
    static func getAppId() -> String {
        return value(defaultValue: "", forKey: .appId)
    }
    
    static func setCustomerId(_ val: String) {
        value(value: val, forKey: .customerId)
    }
    
    static func getCustomerID() -> String {
        return value(defaultValue: "", forKey: .customerId)
    }
    
}
