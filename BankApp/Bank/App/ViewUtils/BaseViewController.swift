//
//  BaseViewController.swift
//  Bank
//
//  Created by MavineNaaman on 14/12/2024.
//

import UIKit

class BaseViewController: UIViewController {
    
    //MARK: - properties
    public var hasLogout: Bool = true
    let loadingView =  LoadingView()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        setupGestures()
        setupLoadingView()
        navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: .plain, target: nil, action: nil)
    }

    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    func setupTableView() {}
    func setupGestures() {}
    
    
    
    private func setupLoadingView() {
        loadingView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(loadingView)
        NSLayoutConstraint.activate([
            loadingView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            loadingView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            loadingView.topAnchor.constraint(equalTo: view.topAnchor),
            loadingView.bottomAnchor.constraint(equalTo: view.bottomAnchor) ])
            loadingView.isHidden = true
    }
    func showLoading() {
        DispatchQueue.main.async {
            self.loadingView.startLoading()
        }
        
    }
    func hideLoading() {
        DispatchQueue.main.async {
            self.loadingView.stopLoading()
        }
    }
    
    
    func showAlert(title: String, message: String) {
        let customAlert = CustomAlertViewController()
        customAlert.alertTitle = title
        customAlert.alertMessage = message
        customAlert.okButtonTitle = "Confirm"
        customAlert.cancelButtonTitle = "Dismiss"
        customAlert.onOk = {
            self.dismiss(animated: true)
        }
        customAlert.onCancel = {
            self.dismiss(animated: true)
        }
        customAlert.modalPresentationStyle = .overCurrentContext
        customAlert.modalTransitionStyle = .crossDissolve
        present(customAlert, animated: true, completion: nil)
    }
    
    
    
    
    

}
