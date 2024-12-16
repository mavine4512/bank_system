//
//  LoadingView.swift
//  Bank
//
//  Created by MavineNaaman on 16/12/2024.
//

import UIKit

class LoadingView: UIView {
    
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private let loadingLabel = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }
    
    private func setupView() {
        backgroundColor = UIColor.black.withAlphaComponent(0.6)

        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.color = .orange
        addSubview(activityIndicator)

        loadingLabel.text = "Loading..."
        loadingLabel.textColor = .black
        loadingLabel.font = UIFont.boldSystemFont(ofSize: 14)
        loadingLabel.translatesAutoresizingMaskIntoConstraints = false
        addSubview(loadingLabel)

        NSLayoutConstraint.activate([
            activityIndicator.centerXAnchor.constraint(equalTo: centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: centerYAnchor),
            
            loadingLabel.topAnchor.constraint(equalTo: activityIndicator.bottomAnchor, constant: 16),
            loadingLabel.centerXAnchor.constraint(equalTo: centerXAnchor)
        ])
    }
    
    func startLoading() {
        activityIndicator.startAnimating()
        isHidden = false
    }
    
    func stopLoading() {
        activityIndicator.stopAnimating()
        isHidden = true
    }
}

