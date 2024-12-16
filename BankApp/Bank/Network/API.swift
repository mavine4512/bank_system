//
//  API.swift
//  Bank
//
//  Created by MavineNaaman on 16/12/2024.
//

import Foundation

enum API {
    static let baseURL = "http://localhost:3000"

    case registerCustomer(data: [String: Any])
    case validateOtp(code: [String: Any])
    case login(code: [String: Any])
    case listCustomer
    
    var path: String {
        switch self {
        case .registerCustomer:
            return "/api/customer/register"
        case .validateOtp:
            return "/api/customers/10/validate-otp"
        case .listCustomer:
            return "/api/pagination"
        case .login:
            return "/api/customer/login"
        }
    }
    
    var method: String {
        switch self {
        case .listCustomer:
            return "GET"
        case .registerCustomer, .validateOtp, .login:
            return "POST"
        }
    }
    
    var url: URL? {
        return URL(string: "\(API.baseURL)\(path)")
    }
}
