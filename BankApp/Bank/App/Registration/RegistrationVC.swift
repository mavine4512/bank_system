//
//  RegistrationVC.swift
//  Bank
//
//  Created by MavineNaaman on 14/12/2024.
//

import UIKit

class RegistrationVC: BaseViewController {
    
    @IBOutlet weak var txtFirstName: UITextField!
    @IBOutlet weak var txtOtherName: UITextField!
    @IBOutlet weak var txtNationalId: UITextField!
    @IBOutlet weak var txtBankAccount: UITextField!
    @IBOutlet weak var txtMobileNumber: UITextField!
    
    
    //MARK: properties
    private var viewModel = RegistrationViewModel()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.title = "Sign Up"
        viewModel.delegate = self
    }
    
    init() {
        super.init(nibName: K.ViewController.registrationScreen, bundle: .main)
    }
    
    
    
    @IBAction private func btnNext(_ sender: UIButton) {
        
        if txtFirstName.text == "" {
            showAlert(title: "", message: "Enter first name")
        } else if txtOtherName.text == "" {
            showAlert(title: "", message: "Enter last name")
        } else if txtNationalId.text == "" {
            showAlert(title: "", message: "Enter id number")
        } else if txtBankAccount.text == "" {
            showAlert(title: "", message: "Enter bank account")
        } else if txtMobileNumber.text == "" {
            showAlert(title: "", message: "Enter mobile number")
        } else {
            let user = User(firstName: txtFirstName.text!, otherNames: txtOtherName.text!, email: "", contactNumber: txtMobileNumber.text!, nationalId: txtNationalId.text!, password: "", accountType: "")
            showLoading()
            viewModel.createAccount(user: user)
            
        }
        
        
    }
    

}


extension RegistrationVC : NetworkResponse {
    
    func response(data: [String : Any]) {
        hideLoading()
        
        DispatchQueue.main.async {
            let vc = OTPViewController()
            if let navigationController = self.navigationController {
                navigationController.pushViewController(vc, animated: false)
            }
        }
    }
    
    func error(error: String) {
        hideLoading()
        DispatchQueue.main.async {
            self.showAlert(title: "Error", message: error)
        }
    }
    
    
}
