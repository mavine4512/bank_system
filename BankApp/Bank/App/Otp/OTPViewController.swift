//
//  OTPViewController.swift
//  Bank
//
//  Created by MavineNaaman on 14/12/2024.
//

import UIKit

class OTPViewController: BaseViewController {
    
    @IBOutlet weak var txtOtpCode: UITextField!
    
    
    
    //MARK: properties
    private var viewModel = OtpViewModel()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        viewModel.delegate = self
    }
    
    init() {
        super.init(nibName: K.ViewController.otpScreen, bundle: .main)
    }

    
    @IBAction func btnNext(_ sender: UIButton) {
        
        if txtOtpCode.text == "" {
            showAlert(title: "", message: "Enter Otp Code")
        } else {
            showLoading()
            viewModel.validateOtp(otpCode: txtOtpCode.text!)
        }
    }
}



extension OTPViewController: NetworkResponse {
    func response(data: [String : Any]) {
        hideLoading()
        DispatchQueue.main.async {
            let vc = LoginVC()
            if let navigationController = self.navigationController {
                navigationController.pushViewController(vc, animated: false)
            }
        }
    }
    
    func error(error: String) {
        hideLoading()
        DispatchQueue.main.async {
            self.showAlert(title: "Error!", message: error)
        }
    }
    
    
}
