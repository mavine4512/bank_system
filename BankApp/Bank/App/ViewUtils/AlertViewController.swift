//
//  AlertViewController.swift
//  Bank
//
//  Created by MavineNaaman on 16/12/2024.
//

import Foundation
import UIKit

class CustomAlertViewController: UIViewController {
    
    private let titleLabel = UILabel()
    private let messageLabel = UILabel()
    private let okButton = UIButton()
    private let cancelButton = UIButton()
    
    var alertTitle: String?
    var alertMessage: String?
    var okButtonTitle: String?
    var cancelButtonTitle: String?
    var onOk: (() -> Void)?
    var onCancel: (() -> Void)?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    private func setupView() {
        view.backgroundColor = UIColor.black.withAlphaComponent(0.6)
        
        let alertView = UIView()
        alertView.backgroundColor = .white
        alertView.layer.cornerRadius = 12
        alertView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(alertView)
        
        titleLabel.text = alertTitle
        titleLabel.font = UIFont.boldSystemFont(ofSize: 18)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        alertView.addSubview(titleLabel)
        
        messageLabel.text = alertMessage
        messageLabel.font = UIFont.systemFont(ofSize: 14)
        messageLabel.translatesAutoresizingMaskIntoConstraints = false
        alertView.addSubview(messageLabel)
        
        okButton.setTitle(okButtonTitle ?? "OK", for: .normal)
        okButton.backgroundColor = .systemBlue
        okButton.layer.cornerRadius = 6
        okButton.translatesAutoresizingMaskIntoConstraints = false
        okButton.addTarget(self, action: #selector(okButtonTapped), for: .touchUpInside)
      //  alertView.addSubview(okButton)
        
        cancelButton.setTitle(cancelButtonTitle ?? "Cancel", for: .normal)
        cancelButton.backgroundColor = .systemGray
        cancelButton.layer.cornerRadius = 6
        cancelButton.translatesAutoresizingMaskIntoConstraints = false
        cancelButton.addTarget(self, action: #selector(cancelButtonTapped), for: .touchUpInside)
        alertView.addSubview(cancelButton)
        
        NSLayoutConstraint.activate([
            alertView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            alertView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            alertView.widthAnchor.constraint(equalToConstant: 270),
            alertView.heightAnchor.constraint(equalToConstant: 150),
            
            titleLabel.topAnchor.constraint(equalTo: alertView.topAnchor, constant: 16),
            titleLabel.centerXAnchor.constraint(equalTo: alertView.centerXAnchor),
            
            messageLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            messageLabel.centerXAnchor.constraint(equalTo: alertView.centerXAnchor),
            
            /*
            okButton.leadingAnchor.constraint(equalTo: alertView.leadingAnchor, constant: 20),
            okButton.bottomAnchor.constraint(equalTo: alertView.bottomAnchor, constant: -20),
            okButton.widthAnchor.constraint(equalToConstant: 100),
            */
            
            cancelButton.leadingAnchor.constraint(equalTo: alertView.leadingAnchor, constant: 20),
            cancelButton.trailingAnchor.constraint(equalTo: alertView.trailingAnchor, constant: -20),
            cancelButton.bottomAnchor.constraint(equalTo: alertView.bottomAnchor, constant: -20),
            cancelButton.widthAnchor.constraint(equalToConstant: 100)
        ])
    }
    
    @objc private func okButtonTapped() {
        dismiss(animated: true, completion: onOk)
    }
    
    @objc private func cancelButtonTapped() {
        dismiss(animated: true, completion: onCancel)
    }
}
