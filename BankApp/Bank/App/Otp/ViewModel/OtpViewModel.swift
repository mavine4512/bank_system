//
//  OtpViewModel.swift
//  Bank
//
//  Created by MavineNaaman on 16/12/2024.
//

import Foundation


class OtpViewModel {
    
    
    var delegate: NetworkResponse?

    
    func validateOtp(otpCode: String) {
        NetworkManager.shared.request(
            .validateOtp(code: ["otp": otpCode])
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
