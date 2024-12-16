//
//  LoginVC.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import UIKit

class LoginVC: BaseViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    init() {
        super.init(nibName: K.ViewController.loginScreen, bundle: .main)
    }
    
    @IBAction func btnNext(_ sender: UIButton) {
        let mv = HomeViewController()
        let nc = UINavigationController(rootViewController: mv)
        if let window = UIApplication.shared.connectedScenes .filter({ $0.activationState == .foregroundActive }) .compactMap({ $0 as? UIWindowScene }) .first?.windows.first { window.rootViewController = nc }
    }
    

}
