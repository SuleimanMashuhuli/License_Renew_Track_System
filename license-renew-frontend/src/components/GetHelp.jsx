import React from 'react';

const FaqPage = () => {
    return (
        <div className="page5 min-h-screen bg-gray-50 p-8">
            <div >
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Frequently Asked Questions</h2>
                
                <div className="pg5-container space-y-4">
                    <details className="bg-blue-50 p-4 rounded-md shadow-sm">
                        <summary className="font-semibold cursor-pointer">How to Renew your License?</summary>
                        <p className="mt-2 text-sm text-gray-700">
                            1. Go to the Safaricom Portal<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Open the Safaricom services.<br />
                            2. Sign in<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Use your credentials to sign in.<br />
                            3. Check your Software Subscriptions<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Navigate to "My Subscriptions".<br />
                            4. Select the Software expired<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Click on the software.<br />
                            5. Confirm & Pay<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The portal will display the fee.<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Choose M-Pesa, Card or Bank transfer as the payment method.<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If using M-Pesa, enter the Paybill number provided.<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pay and close.<br />
                            6. Receive Confirmation<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Once payment is successful, you will get an SMS confirming the payment.<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Download or print the receipt.<br />
                            7. Upload the receipt to our website once done for renewal approval.
                        </p>
                    </details>

                    <details className="bg-blue-50 p-4 rounded-md shadow-sm">
                        <summary className="font-semibold cursor-pointer">How can I upload my software license documents?</summary>
                        <p className="mt-2 text-sm text-gray-700">
                            Navigate to the 'Document Management' section of your dashboard and click the 'Upload' option.
                        </p>
                    </details>

                    <details className="bg-blue-50 p-4 rounded-md shadow-sm">
                        <summary className="font-semibold cursor-pointer">What types of reminders does LicenseRenew provide?</summary>
                        <p className="mt-2 text-sm text-gray-700">
                            LicenseRenew sends automated email reminders and in-app notifications with customizable schedules (30, 15, or 7 days before expiry).
                        </p>
                    </details>

                    <details className="bg-blue-50 p-4 rounded-md shadow-sm">
                        <summary className="font-semibold cursor-pointer">Can I generate reports in LicenseRenew?</summary>
                        <p className="mt-2 text-sm text-gray-700">
                            Yes, LicenseRenew supports both PDF and Excel reports to track license compliance and statuses.
                        </p>
                    </details>

                    <details className="bg-blue-50 p-4 rounded-md shadow-sm">
                        <summary className="font-semibold cursor-pointer">How do I update my contact information?</summary>
                        <p className="mt-2 text-sm text-gray-700">
                            Visit your profile page and edit the email and phone number fields as needed.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
