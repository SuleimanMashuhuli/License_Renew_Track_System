import { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [licenseData, setLicenseData] = useState(null);
  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No token found!');
        return;
      }

      try {
        const subsResponse = await fetch('http://127.0.0.1:8000/licenseS/');
        const subsData = await subsResponse.json();
        setSubscriptionData(subsData);
        setFilteredData(subsData);

        const response = await axios.get('http://127.0.0.1:8000/profile/', {
          headers: {
            'Content-Type': 'application/json',
            'Authoriz.ation': `Bearer ${token}`,
          },
        });
        setLicenseData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = subscriptionData.filter((item) =>
        item.owner_full_name?.toLowerCase().includes(lowerCaseQuery) ||
        item.owner_email?.toLowerCase().includes(lowerCaseQuery) ||
        item.subscription_type?.toLowerCase().includes(lowerCaseQuery) ||
        item.expiry_date?.toLowerCase().includes(lowerCaseQuery) ||
        item.owner_department?.toLowerCase().includes(lowerCaseQuery)
    );

    if (query.trim() === '') {
        setFilteredData([]); 
        return;
      }

    setFilteredData(filtered);

    if (filtered.length > 0) {
        const match = filtered[0];
        navigate(`/manage?owner=${encodeURIComponent(match.owner_full_name)}&subscription=${encodeURIComponent(match.subscription_type)}&email=${encodeURIComponent(match.owner_email)}&department=${encodeURIComponent(match.owner_department)}&expiry=${encodeURIComponent(match.expiry_date)}`);
      }
};

  const getInitialsAvatar = (firstName, lastName) => {
    const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
  };


  return (
    <div className='MainPage'>
        {/* -SECTION 1- */}
        <div className='page1'>
            <headeR className='headeR'>
                <div className="logo-section">
                    <img src="logO1.png" className="logo" alt="logo" />
                    <h1 className="bank-name">ABC Bank</h1>
                </div>
                <nav>
                    <ul className="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="/contacts">Contacts</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/services">Services</a></li>
                        <li class="user-profile">
                            <label for="profile-toggle" class="user-profile">
                            {licenseData && (
                                <>
                                    <img
                                        src={licenseData.profile_picture || getInitialsAvatar(licenseData.user?.first_name, licenseData.user?.last_name)}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <span><i class="fa-solid fa-caret-down"></i></span>
                                </>
                            )}
                            </label>
                        </li>
                        <a>
                        <img src="/Kenya.png" width="18" height="12" alt="KE" />

                        </a>
                    </ul>
                </nav>

                <input type="checkbox" id="profile-toggle" class="modal-toggle" hidden />
                
                <div class="modal-overlay">
                    <div class="modal-content">
                        <label for="profile-toggle" class="close-btn">&times;</label>
                        <br/>
                        <div className="license-profile-image">

                            {licenseData && (
                            <>
                                <img
                                    src={licenseData.profile_picture || getInitialsAvatar(licenseData.user?.first_name, licenseData.user?.last_name)}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full"
                                />
                                <h2 className="text-lg font-medium ">{licenseData.user?.first_name} {licenseData.user?.last_name}</h2>
                            </>
                            )}  
                        </div>
                    
                        <button class="action-Btn"><Link to="/vprofile">View Profile</Link></button>
                        <button class="action-Btn"><Link to="/sign_in">Sign Out</Link></button>
                    </div>
                </div> 
            </headeR>
            <div className='page1-main'>
                <div className='pg1-container'>
                    <div className='contenT'>
                        <img src='/WhatsApp-Image-2025-02-18-at-10.56.19_b6b9654a.jpg' className="img" alt='img' />
                    </div>

                    <div className='words'>

                    <div className="search-filter">
                            <input
                                type="text"
                                className="search-input"
                                style={{ border: '2px solid #003366', display: 'block', padding: '10px' }}
                                placeholder="Search by name, email, department..."
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <i className="fas fa-search search-icon"></i>

                    </div>

                    <h1>Your Trusted Partner in License Renewal!!
                            <br/>
                        </h1>
                        <p>As a leading digital banking provider, we are excited to introduce our latest service—  
                        a seamless and efficient license renewal system designed just for you....</p>

                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>

                        <ul>
                            <li class="card renew">
                                <div class="icon"><i class="fa-solid fa-refresh"></i></div>
                                <div class="title">RENEW</div>
                            </li>
                            <li class="card create">
                                <div class="icon"><i class="fa-solid fa-plus"></i></div>
                                <div class="title">CREATE</div>
                            </li>
                            <li class="card manage">
                                <div class="icon"><i class="fa-solid fa-cogs"></i></div>
                                <div class="title">MANAGE</div>
                            </li>
                            <li class="card view">
                                <div class="icon"><i class="fa-solid fa-eye"></i></div>
                                <div class="title">VIEW</div>
                            </li>
                            <li class="card reports">
                                <div class="icon"><i class="fa-solid fa-chart-line"></i></div>
                                <div class="title">REPORTS</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        {/* -SECTION 2- */}
        <div className='page2'>
            <div className='topper'>
                <h2>Reasons for choosing ABC</h2>
            </div>
            <div className='pg2-container'>
                <div className="feature">
                    <i className="fa-solid fa-check"></i>
                    <h2>User Friendly</h2>
                    <i className="fa-solid fa-smile"></i> 
                </div>
                <div className="feature">
                    <i className="fa-solid fa-check"></i>
                    <h2>Secure & Flexible</h2>
                    <i className="fa-solid fa-lock"></i>
                </div>
                <div className="feature">
                    <i className="fa-solid fa-check"></i>
                    <h2>Customer Support</h2>
                    <i className="fa-solid fa-headset"></i>
                </div>
                <div className="feature">
                    <i className="fa-solid fa-check"></i>
                    <h2>Responsive Interface</h2>
                    <i className="fa-solid fa-laptop-code"></i> 
                </div>
            </div>
        </div>

        {/* -SECTION 3- */}
        <div className='page3'>
            <div className='pg3-container'>
                <div className='right'>
                    <h3>Why ABC Bank</h3>
                    <p2>
                        <i>"ABC Bank is the ideal partner for your License Renewal Tracking needs that could offer several benefits"</i>
                        <br/>This system was our idea since then on our customer who have been suffering
                        on renewals. 
                        As we've got our Software Development team staff who work productively day and night
                        to ensure our customers get what best for them that will suit their need, finaly ABCRenew was birth.
                        <br />
                        We work toghether and share to our customers on what we've innovated to connect all through our digital services. 
                    </p2>
                    <br/><a href='/contacts' className='contact-btn'>CONTACT US</a>
                </div>
                <div className='pg3-Image'>
                    <img src='/devteam.png' alt='' />
                </div>
            </div>
        </div>
        {/* -SECTION 4- */}
        <div className='page4'>
            <div className='pg4-container'>
                <div className='pg4-col1'>
                    <div className='pg4-dp'>
                        <Link to="/reports" >
                            <div className='above'>
                                <img src='/reportB.png' alt='' />
                                <h4>Reports</h4>
                            </div>
                        </Link>
                        <p4>Generate reports here for auditing and compliance checks. This section allows you to download detailed reports for reviewing software usage, license validity and expiration dates. Stay informed about your license status with comprehensive insights.</p4>
                    </div>
                    <div className='pg4-dp'>
                        <Link to="/viewlicense" >
                            <div className='above'>
                                <img src='/vieW.png' alt='' />
                                <h4>View License</h4>
                            </div>
                        </Link>
                        <p4>Check details of your licenses here. You can view all relevant information about each software license, including license key, renewal date and more. Easily track the status of your licenses to avoid any expirations or gaps in coverage.</p4>
                    </div>
                </div>
                <div className='pg4-col2'>
                    <img src='/phoney1.png' alt='' />
                </div>
                <div className='pg4-col3'>
                    <div className='pg4-dp'>
                            <Link to="/renewals" >
                                <div className='above'>
                                    <img src='/renewB.png' alt='' />
                                    <h4>Renewing</h4>
                                </div>
                            </Link>
                            <p4>Renew licenses before expiration. This feature enables you to quickly renew expiring licenses and ensure that you continue to comply with your software agreements. Set reminders and manage renewals efficiently.</p4>
                        </div>
                        <div className='pg4-dp'>
                            <Link to="/providers" >
                                <div className='above'>
                                    <img src='/manageB.png' alt='' />
                                    <h4>Manage Licenses</h4>
                                </div>
                            </Link>
                            <p4>Track all your licenses in one place. This section allows you to organize and manage all the licenses associated with your business. Keep track of important details like license type, status and renewal dates in a centralized dashboard.</p4>
                        </div>
                    </div>
            </div>
        </div>

        {/* -SECTION 6- */}
        <div className='page6'>
            <div className='client-info'>
                <div className='client-head'>
                    <h9> <font color='blue'>Our Clients & Partners</font></h9>
                </div>
                <div className='client-partners'>
                    <div className='partner-boxes'>
                        <img src='/firm.jpg' className='com' alt='com' />
                        <h1>Companies</h1>
                        <hr/>
                        <p6>We collaborate with leading firms to streamline their software license management and compliance processes.</p6>
                    </div>
                    <div className='partner-boxes'>
                        <img src='/startUP.jpg' className='start' alt='start' />    
                        <h1>Startups</h1>
                        <hr/>
                        <p6>Startups trust us to help them scale by managing their software licenses efficiently and cost-effectively.</p6>
                    </div>
                    <div className='partner-boxes'>
                        <img src='person.jpg' className='ind' alt='ind' />
                        <h1>Individuals</h1>
                        <hr/>
                        <p6>Freelancers and individuals rely on us to keep track of their essential software tools and licenses.</p6>
                    </div>
                </div>
                <div className='client-image'>
                    <img src='/safaricom.png' className='client-logo' alt='Safaricom' />
                    <img src='/meta.png' className='client-logo' alt='Meta' />
                    <img src='/amazon.png' className='client-logo' alt='Amazon' />
                    <img src='/google.png' className='client-logo' alt='Google' />
                    <img src='/microsoft.png' className='client-logo' alt='Microsoft' />
                    <img src='/airtel.png' className='client-logo' alt='Airtel' />
                    <img src='/telkom.png' className='client-logo' alt='Telkom' />
                    <img src='/ibm.png' className='client-logo' alt='IBM' />
                </div>
            </div>
        </div>

        <div class="contact-container">
            <div class="payment-info">
                <h6>Payment Methods</h6>
                <p62><strong>We accept various payment methods for your convenience:</strong>
                    <br/>Need help on payments? Check out our FAQs on the payment processes.
                </p62>
                <div class="payment-logos">
                    <img src="Paypal.png" alt="PayPal" />
                    <img src="Visa.png" alt="Visa" />
                    <img src="Mastercard.png" alt="MasterCard" />
                    <img src="Mpesa.png" alt="M-Pesa" />
                    <img src="airtel.png" alt="airtel" />
                </div>
                <p>For more details, feel free to contact us!</p>
            </div>
            <div class="contact-form">
                <form>
                    <input type="text" name="from_name" placeholder="Full Name" aria-label="Full Name" required />
                    <input type="email" name="email" placeholder="Email Address" aria-label="Email Address" required />
                    <input type="text" name="subject" placeholder="Subject" aria-label="Subject" required />
                    <textarea name="message" placeholder="Message" rows="4" aria-label="Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>  
            </div>
        </div>
        <img src='Going-Green4-2.jpg' alt='GoGreen'  className="full-width-img" />
        {/* -SECTION 7- */}
        <footer>
            <div class="footerContainer">
                <div class="socialIcons">
                    <a href="https://www.facebook.com/abcbankgroup/"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://www.instagram.com/abcbankgroup/"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.x.com/ABCBankGroup"><i class="fa-brands fa-twitter"></i></a>
                    <a href="https://www.google.com/search?gs_ssp=eJzj4tLP1Tcwza1KTzJUYDRgdGDw4ktMSlZISszLVshOzatMBACLogkq&q=abc+bank+kenya&oq=ABC+&gs_lcrp=EgZjaHJvbWUqEggCEC4YJxjHARjRAxiABBiKBTIGCAAQRRg5Mh8IARAuGIMBGMcBGNQCGIsDGKgDGLEDGNEDGNIDGIAEMhIIAhAuGCcYxwEY0QMYgAQYigUyCggDEAAYsQMYgAQyBwgEEAAYgAQyBwgFEAAYgAQyCggGEAAYiwMYgAQyFggHEC4YrwEYxwEYiwMYpgMYqAMYgAQyBwgIEAAYgAQyBwgJEAAYjwLSAQg0MjIxajFqN6gCALACAA&sourceid=chrome&ie=UTF-8"><i class="fa-brands fa-google-plus"></i></a>
                    <a href="https://www.youtube.com/@abcbankgroup"><i class="fa-brands fa-youtube"></i></a>
                </div>
                
                <div class="footerNav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contacts">Contact Us</a></li>
                        <li><a href="">Our Team</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footerBottom">
                <p>&copy; 2025 ABC Bank  |  ABC Bank is regulated by the Central Bank of Kenya.</p>
            </div>
        </footer>


    </div>            
  )
}

export default Dashboard













        // {/* -SECTION 5- */}
        // <div className='page5'>
        //     <div className='box'>
        //         <h>Frequently Asked Questions</h>
        //         <div className='pg5-container'>
        //             <details>
        //                 <summary>How to Renew your License?</summary>
        //                 <p>
        //                    1. Go to the Safaricom Portal<br/>

        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Open the Safaricom services.<br/>
        //                    2. Sign in<br/>

        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Use your credentials to sign in<br/>
        //                    3. Check your Software Subscriptions<br/>

        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Navigate to "My Subscriptions" .<br/>
        //                    4. Select the Software expired<br/>

        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Click on the software.<br/>
        //                    5. Confirm & Pay<br/>

        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The portal will display the fee.<br/>
        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Choose M-Pesa, Card or Bank transfer as the payment method.<br/>
        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If using M-Pesa, enter the Paybill number provided.<br/>
        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pay and close.<br/>
        //                    6. Receive Confirmation<br/>

        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Once payment is successful, you will get an SMS confirming the payment.<br/>
        //                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Download or print the receipt.<br/>
        //                    7. Upload the receipt to our website once done for renewal approve.
        //             </p>
        //             </details>
        //             <details>
        //                 <summary>How can I upload my software license documents?</summary>
        //                 <p>You can upload your software license documents by navigating to the 'Document Management' section of your dashboard and selecting the 'Upload' option.</p>
        //             </details>
        //             <details>
        //                 <summary>What types of reminders does LicenseRenew provide?</summary>
        //                 <p>LicenseRenew provides automated email reminders and in-app notifications for upcoming license renewals, with customizable schedules (e.g., 30, 15, or 7 days before expiry).</p>
        //             </details>
        //             <details>
        //                 <summary>Can I generate reports in LicenseRenew?</summary>
        //                 <p>Yes, LicenseRenew allows you to generate both PDF and Excel reports to track compliance and license statuses.</p>
        //             </details>
        //             <details>
        //                 <summary>How do I update my contact information?</summary>
        //                 <p >You can update your contact information by going to your profile page and editing the fields for your email and phone number.</p>
        //             </details>
        //         </div>
                
        //     </div>
          
        // </div>


