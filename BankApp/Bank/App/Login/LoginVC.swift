//
//  LoginVC.swift
//  Bank
//
//  Created by MavineNaaman on 14/12/2024.
//

import UIKit

class LoginVC: BaseViewController {
    
    @IBOutlet weak var txtPin: UITextField!
    
    
    //MARK: properties
    private var viewModel = LoginViewModel()

    override func viewDidLoad() {
        super.viewDidLoad()

        viewModel.delegate = self
    }
    
    init() {
        super.init(nibName: K.ViewController.loginScreen, bundle: .main)
    }
    
    @IBAction func btnNext(_ sender: UIButton) {
        if txtPin.text == "" {
            showAlert(title: "", message: "Enter login pin")
        } else {
            showLoading()
            viewModel.login(phoneNumber: txtPin.text!)
        }
    }
    

}


extension LoginVC: NetworkResponse {
    func response(data: [String : Any]) {
        self.hideLoading()
        DispatchQueue.main.async {
            let mv = HomeViewController()
            let nc = UINavigationController(rootViewController: mv)
            if let window = UIApplication.shared.connectedScenes .filter({ $0.activationState == .foregroundActive }) .compactMap({ $0 as? UIWindowScene }) .first?.windows.first { window.rootViewController = nc }
        }
    }
    
    func error(error: String) {
        hideLoading()
        DispatchQueue.main.async {
            self.showAlert(title: "Error!", message: error)
        }
    }
    
    
}
