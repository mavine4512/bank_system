//
//  BaseViewController.swift
//  Bank
//
//  Created by AndrewAnanda on 14/12/2024.
//

import UIKit

class BaseViewController: UIViewController {
    
    //MARK: - properties
    public var hasLogout: Bool = true

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        setupGestures()
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
    
    

}
