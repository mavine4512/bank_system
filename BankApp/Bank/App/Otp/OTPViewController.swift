//
//  OTPViewController.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import UIKit

class OTPViewController: BaseViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

    }
    
    init() {
        super.init(nibName: K.ViewController.otpScreen, bundle: .main)
    }

    
    @IBAction func btnNext(_ sender: UIButton) {
        let vc = LoginVC()
        if let navigationController = self.navigationController {
            navigationController.pushViewController(vc, animated: false)
        }
    }
}
