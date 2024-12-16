//
//  HomeViewController.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import UIKit

class HomeViewController: BaseViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    
    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.setNavigationBarHidden(true, animated: false)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        self.navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
    init() {
        super.init(nibName: K.ViewController.homeScreen, bundle: .main)
    }

}
