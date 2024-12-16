//
//  RegistrationVC.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import UIKit

class RegistrationVC: BaseViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.title = "Sign Up"
    }
    
    init() {
        super.init(nibName: K.ViewController.registrationScreen, bundle: .main)
    }
    
    
    
    @IBAction private func btnNext(_ sender: UIButton) {
        let vc = OTPViewController()
        if let navigationController = self.navigationController {
            navigationController.pushViewController(vc, animated: false)
        }
    }
    

}
