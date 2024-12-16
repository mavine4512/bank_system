//
//  SplashScreenVc.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import UIKit

class SplashScreenVC: BaseViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupData()
        self.view.backgroundColor = .systemBackground
    }
    
    init() {
        super.init(nibName: K.ViewController.splashScreen, bundle: .main)
    }
    
    
    private func setupData() {
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            if MyUserDefault.getCustomerID() == "" {
                let mv = RegistrationVC()
                let nc = UINavigationController(rootViewController: mv)
                if let window = UIApplication.shared.connectedScenes .filter({ $0.activationState == .foregroundActive }) .compactMap({ $0 as? UIWindowScene }) .first?.windows.first { window.rootViewController = nc }
            } else {
                let mv = LoginVC()
                let nc = UINavigationController(rootViewController: mv)
                if let window = UIApplication.shared.connectedScenes .filter({ $0.activationState == .foregroundActive }) .compactMap({ $0 as? UIWindowScene }) .first?.windows.first { window.rootViewController = nc }
            }
        }
        
    }
    

}
