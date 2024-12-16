//
//  RegistrationViewModel.swift
//  Bank
//
//  Created by MavineNaaman on 16/12/2024.
//

import Foundation


protocol NetworkResponse {
    func response(data: [String: Any])
    func error(error: String)
}


class RegistrationViewModel {
    
    
    var delegate: NetworkResponse?

    
    func createAccount(user: User) {
        NetworkManager.shared.request(.registerCustomer(data: [
            "first_name": user.firstName,
            "other_names": user.otherNames,
            "email": user.email,
            "contact_number": user.contactNumber,
            "national_id": user.nationalId,
            "password": user.password,
            "account_type": user.accountType
        ])) { result in
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
