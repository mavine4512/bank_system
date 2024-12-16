//
//  LoginViewModel.swift
//  Bank
//
//  Created by MavineNaaman on 16/12/2024.
//

import Foundation


class LoginViewModel {
    
    
    var delegate: NetworkResponse?

    
    func login(phoneNumber: String) {
        NetworkManager.shared.request(
            .login(code: ["contact_number": phoneNumber])
        ) { result in
            switch result {
            case .success(let data):
                do {
                    if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                        print(json)
                        self.delegate?.response(data: json)
                    } else {
                        self.delegate?.error(error: "Invalid Json")
                        //completion(.failure(NSError(domain: "Invalid JSON", code: -1, userInfo: nil)))
                    }
                } catch {
                    print(error.localizedDescription)
                    self.delegate?.error(error: error.localizedDescription)
                } case .failure(let error):
                print(error.localizedDescription)
                self.delegate?.error(error: error.localizedDescription)
            }
        }
    }
    
    
}
