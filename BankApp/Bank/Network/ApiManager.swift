//
//  ApiManager.swift
//  Bank
//
//  Created by MavineNaaman on 16/12/2024.
//

import Foundation

class NetworkManager {

    static let shared = NetworkManager()
    private init() {}
    
    func request(_ api: API, body: Data? = nil, completion: @escaping (Result<Data, Error>) -> Void) {
        guard let url = api.url else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1, userInfo: nil)))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = api.method
        if let body = body {
            request.httpBody = body
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: -1, userInfo: nil)))
                return
            }
            
            completion(.success(data))
        }
        
        task.resume()
    }
    
}
