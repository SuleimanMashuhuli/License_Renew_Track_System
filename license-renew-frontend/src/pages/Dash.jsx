import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

const Dash = () => {
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [licenseData, setLicenseData] = useState(null);
  const token = sessionStorage.getItem('token');


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
    <body>
    <div>
    <section id='header'>
        <div>
            <ul id='barnav'>
                <li><a href="#home">HOME</a></li>
                <li><a href="/contacts">CONTACTS</a></li>
                <li><a href="/about">ABOUT</a></li>
                <li><a href="/services">SERVICES</a></li>
            </ul>
        </div>
    </section>

    <section id="hero">
        <div class="navbar">

            <ul id="navbar">
            <img src="logO.jpg" alt="log" class="log" />

                <li class="dropdown">
                    <span class="dropdown-label">NAVIGATE</span>
                    <ul class="dropdown-content">
                    <li><a href="#">VIEW</a></li>
                    <li><a href="#">REPORTS</a></li>
                    </ul>
                </li>
                <li><a href="#">RENEWALS</a></li>
                <li class="dropdown">
                    <span class="dropdown-label">SUBSCRIPTION</span>
                    <ul class="dropdown-content">
                    <li><a href="#">CREATE</a></li>
                    <li><a href="#">MANAGE</a></li>
                    </ul>
                </li>
                <li><a href="#">FAQs</a></li>
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
            </ul>

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
        </div>
    </section>

    <section id='dash' class="cross-lines-background">
        <div class="dash-text">
            <h4>Maliza stress ya renewals</h4>
            <h2>Your Number One Choice...</h2>
            <h1>on all subscriptions</h1>
            <p>Save up to 50% off discount! by renewing with ABC Bank</p>
            <button className='bttn'><a href="explore.html">Explore Now</a></button>
        </div>
        <div class="slides">
            <img src="/186.png" alt="Slide 1"/>
            <img src="/345.png" alt="Slide 2"/>
            <img src="/21.png" alt="Slide 3"/>
            <img src="/426.png" alt="Slide 4"/>
            <img src="/51.png" alt="Slide 5"/>
        </div>
    </section>

    <section id='reasons' className='section-p1'>
        <h2>Reasons for Choosing ABC Bank</h2>
        <div class="fe-box">
            <img src="secure.png" alt="" />
            <h6>Secure & Flexible</h6>
        </div>
        <div class="fe-box">
            <img src="userf.png" alt="" />
            <h6>User Friendly</h6>
        </div>
        <div class="fe-box">
            <img src="interface.png" alt="" />
            <h6>Responsive Interface</h6>
        </div>
        <div class="fe-box">
            <img src="/f6.png" alt="" />
            <h6>Customer Support</h6>
        </div>
    </section>
    
    <section id='why' className='section-p1 why-section'>
        <div className='right'>
            <h2>Why ABC Bank</h2>
            <p>
                <i><span className='first-letter'>"A</span>BC Bank is the ideal partner for your License Renewal Tracking needs that could offer several benefits"</i>
                <br/>This system was our idea since then on our customer who have been suffering
                on renewals. 
                As we've got our Software Development team staff who work productively day and night
                to ensure our customers get what best for them that will suit their need, finaly ABCRenew was birth.
                <br />
                We work toghether and share to our customers on what we've innovated to connect all through our digital services. 
            </p>
                <br/><a href='/contacts' className='contact-btn'>CONTACT US</a>
        </div>
        <div className='pg3-Image'>
            <img src='/WhatsApp-Image-2025-02-18-at-10.56.18_a797007e.jpg' alt='' />
        </div>
    </section>

    <section id='clients' className='section-p1'>
        <h4>Patners and Clients</h4>
        <div className="client-partners">
            <div className="card">
                <img src="/firm.jpg" alt="com" className="card-image" />
                <h3 className="card-title">
                Companies
                <div className="underline"></div>
                </h3>
                <p className="card-description">
                We collaborate with leading firms to streamline their software license management and compliance processes.
                </p>
                <a href="#" className="btn">Learn More &gt;&gt;</a>
            </div>

            <div className="card">
                <img src="/startUP.jpg" alt="Savings and Investment" className="card-image" />
                <h3 className="card-title">
                Startups
                <div className="underline"></div>
                </h3>
                <p className="card-description">
                Startups trust us to help them scale by managing their software licenses efficiently and cost-effectively.
                </p>
                <a href="#" className="btn">Learn More &gt;&gt;</a>
            </div>

            <div className="card">
                <img src="/person.jpg" alt="ind" className="card-image" />
                <h3 className="card-title">
                Individuals
                <div className="underline"></div>
                </h3>
                <p className="card-description">
                Freelancers and individuals rely on us to keep track of their essential software tools and licenses.
                </p>
                <a href="#" className="btn">Learn More &gt;&gt;</a>
            </div>
            </div>

    </section>

    <section id='partners' className='section-p1'>
        <div>
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
    </section>

    <section id='news' className='sectiomn-p1'>
        <div class="newstext">
            <h4>Sign Up For Our Newsletter</h4>
            <p>Get E-mails on the lattest products and <span>special offers</span>.</p>
        </div>
        <div class="form">
            <input placeholder="For more news click the button" />
            <button class="normal"><a href='https://www.abcthebank.com/abc-bank-news-latest/'>Click me for News</a></button>
        </div>
    </section>

    <section id='green' className='section-p1'>
        <img src='Going-Green4-2.jpg' alt='GoGreen'  className="full-width-img" />
    </section>

    <footer className='section-p1'>
        <div class="col">
            <img class="log" src="/logO.png" alt="" />
            <h4>Contact Us</h4>
            <p><strong>Address:</strong>Woodvale Grove Westlands, Nairobi</p>
            <p><strong>Phone:</strong>+(254) 701 700700</p>
            <p><strong>Hours:</strong>8:00 - 17:00, Mon - Sat</p>
        </div>
        <div class="follow">
            <h4>Follow Us</h4>
            <div class="icon">
                <a href="https://www.facebook.com/abcbankgroup/"><i class="fab fa-facebook-f"></i></a>
                <a href="https://www.x.com/ABCBankGroup"><i class="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/abcbankgroup/"><i class="fab fa-instagram"></i></a>
                <a href="https://www.youtube.com/@abcbankgroup"><i class="fab fa-youtube"></i></a>
            </div>
        </div>
        <div class="col">
            <h4>About Us</h4>
            <a href="#">About Us</a>
            <a href="#">FAQs</a>
            <a href="#">Terms and Conditions</a>
            <a href="#">Servises</a>
            <a href="#">Contact Us</a>
        </div>
        <div class="col">
            <h4>Quick Links</h4>
            <a href="#">Sign Out</a>
            <a href="#">Career</a>
            <a href="#">Tenders</a>
            <a href="#">Newsletter</a>
            <a href="#">Help</a>
        </div>
        <div class="col install">
            <h4>Install App</h4>
            <p>From App Store or Google Play</p>
            <div class="row">
                <img src="images/pay/app.jpg" alt="" />
                <img src="images/pay/play.jpg" alt="" />
            </div>
            <p>Secure Payment Gateways </p>
            <img src="images/pay/pay.png" alt=""/>
        </div>

        <div class="copyright">
            <p>&copy; 2025 ABC Bank  |  ABC Bank is regulated by the Central Bank of Kenya.</p>
        </div>
    </footer>

    <style>
        {`
 @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'spartan', sans-serif;
}
h1{
    font-size: 50px;
    line-height: 64px;
    color: #222;
}

h2{
    font-size: 46px;
    line-height: 54px;
    color: #222;
}

h4{
    font-size: 20px;
    color: #222;

}

h6{
    font-weight: 700;
    font-size: 12px;
}
p{
    font-size: 16px;
    color: #465b52;
    margin: 15px 0 20px 0;
}

.section-p1{
    padding: 40px 80px;
}

.section-m1{
    margin: 40px 0;
}

body{
    width: 100;
    background-color: #FFF;
   background-image:
        linear-gradient(45deg, #ccc 1px, transparent 1px),
        linear-gradient(-45deg, #ccc 1px, transparent 1px);
    background-size: 20px 20px;
}

button.normal{
    font-size: 14px;
    font-weight: 600;
    padding: 15px 30px;
    color: #000;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    outline: none;
    transition: 0.2s;
}
button.white{
    font-size: 13px;
    font-weight: 600;
    padding: 11px 18px;
    color: #fff;
    background-color: transparent;
    cursor: pointer;
    border: 1px solid #fff;
    outline: none;
    transition: 0.2s;
}
#header {
    background-color: #1e3a8a; 
    padding: 20px 0;
}

#barnav {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center; 
}

#barnav li {
    margin: 0 15px;
}

#barnav a {
    color: white;
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
}

#hero {
    background-color: white;
    padding: 15px 0;
    position: sticky;
    border-bottom: 1px solid #ccc;
    top: 0;
    z-index: 1000;
    background-color: white;
  }
  
  .navbar {
    display: flex;
    align-items: center;
    justify-content: center; 
  padding: 10px 20px;
    
  }
  
  .log {
    height: 50px;
    width: auto;
      margin-right: 400px;
  }
  
  #navbar {
    list-style: none;
    display: flex;
    gap: 20px;
      margin-right: 400px;
  }
  
  #navbar li {
    position: relative;
  }
  
  #navbar a,
  .dropdown-label {
    text-decoration: none;
    color: #003366; 
    font-size: 18px;
    padding: 8px 12px;
    display: block;
    cursor: pointer;
    font-weight: 500;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 140px;
    top: 100%;
    left: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }
  
  .dropdown-content li {
    padding: 0;
  }
  
  .dropdown-content a {
    padding: 10px 12px;
    color: #007BFF;
    text-decoration: none;
    display: block;
  }
  
  .dropdown-content a:hover {
    background-color: #e6f0ff;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    }
    
    .user-profile img {
    width: 30px;
    height: 30px;
    border-radius: 50%;    
    object-fit: cover;        
    }
      
    .modal-overlay {
    position: fixed;
    top: 60px;
    right: 20px;
    width: 250px;
    background: rgba(0, 0, 0, 0.4);
    color: white;
    border-radius: 8px;
    padding: 1rem;
    z-index: 999;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: none;
    }
    .modal-toggle:checked + .modal-overlay {
    display: block;
    }
    .modal-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    position: relative;
    }

#dash {
  position: relative;
  z-index: 1;
  height: 90vh;
  width: 100%;
  padding: 0 80px;
  display: flex;
  flex-direction: row; 
  align-items: center;  
  justify-content: space-between; 
  overflow: hidden;
}

#dash::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background-image: url("/Background4.jpg");
  background-size: 50% 1000%;
  background-position: right;
  background-repeat: no-repeat;
  opacity: 0.5;
  z-index: -1;
}

#dash h4 {
  padding-bottom: 15px;
}

#dash h1 {
  color: #088178;
}

#dash .bttn {
    background-image: url("/button.png");
    background-color: transparent;
    color: #088178;
    border: 0;
    padding: 14px 80px 14px 65px;
    background-repeat: no-repeat;
    cursor: pointer;
    font-weight: 700;
    font-size: 15px;
}

#dash .bttn a {
  text-decoration: none;
  color: #088178;
}

#dash .bttn a:hover {
  color: #000;
  font-weight: 700;
  transition: 0.3s ease;
}

.dash-text {
  flex: 1;
  max-width: 30%; 
}

.slides {
  flex: 1;
  max-width: 70%;
  width: 400px;
  height: 500px;
  position: relative;
  overflow: hidden;

}
.slides img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  animation: slideShow 20s infinite;
}

.slides img:nth-child(1) { animation-delay: 0s; }
.slides img:nth-child(2) { animation-delay: 4s; }
.slides img:nth-child(3) { animation-delay: 8s; }
.slides img:nth-child(4) { animation-delay: 12s; }
.slides img:nth-child(5) { animation-delay: 16s; }

@keyframes slideShow {
  0%   { opacity: 0; }
  5%   { opacity: 1; }
  25%  { opacity: 1; }
  30%  { opacity: 0; }
  100% { opacity: 0; }
}



#reasons{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    
}
#reasons h2 {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
    font-size: 28px;
    font-weight: 600;
    color: #003366;
}

#reasons .fe-box{
    width: 400px;
    text-align: center;
    padding: 25px 5px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    border: 1px solid #cce7d0;
    border-radius: 4px;
     background-color: #fff;
    margin: 15px 0;
    
}

#reasons .fe-box:hover{
    box-shadow: 10px 10px 54px rgba(70, 62, 221, 0.1);
}

#reasons .fe-box img{
    width: 100%;
    height: 200px;
    object-fit: contain; 
    margin-bottom: 10px;
}

#reasons .fe-box h6{
    display: inline-block;
    padding: 9px 8px 6px 8px;
    line-height: 1;
    border-radius: 4px;
    color: #088178;
    background-color: #fddde4;
     box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

#reasons .fe-box:nth-child(2) h6{
    background-color: #cdebbc;
}
#reasons .fe-box:nth-child(3) h6{
    background-color: #d1e8f2;
}
#reasons .fe-box:nth-child(4) h6{
    background-color: #cdd4f8;
}
#reasons .fe-box:nth-child(5) h6{
    background-color: #f6dbf6;
}
#reasons .fe-box:nth-child(6) h6{
    background-color: #cdebbc;
}

.why-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
  flex-wrap: wrap;
    padding: 40px 80px;
    background-image: url("/Background4.jpg"); 
    height: 90vh;
    width: 100%;
    background-size: 50% 1000%; 
    background-position: left; 
    background-height: 200px; 
    background-repeat: no-repeat; 
}

.why-section .right {
  flex: 0 0 30%; 
  max-width: 30%;
  text-align: justify;
  line-height: 20px;
}
  .first-letter {
  font-size: 70px;

}
  .why-section .right h2 {
  margin-top: 0; 
  margin-bottom: 100px;
  color: #003366;
}

.why-section .pg3-Image {
  flex: 1; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.why-section .pg3-Image img {
  max-width: 70%;
  height: auto;
  border-radius: 8px;
}

.contact-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #003366;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}

.contact-btn:hover {
  background-color: #0056b3;
}
  
#clients h4 {
 margin-top: 40px;
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
  color: #003366;
}
  .client-partners {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
}

.card {
  margin: 0;  
  padding: 0;
  width: 23%;
  background-color: #fff;
  border-radius: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  overflow: hidden;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
}

.card-image {
  margin: 0;  
  padding: 0;
  width: 100%;
  height: 50%;
  object-fit: cover;
    transform: scale(1.1); 
  transition: transform 0.5s ease; 
}

.card:hover .card-image {
  transform: scale(1); 
}
.card-title {
  margin-top: 1rem;
  font-size: 1.3rem;
  text-align: left;
  position: relative;
  color: #1e3a8a;
    margin-left: 1rem;
}

.underline {
  width: 10%;
  height: 2px;
  background-color: #1e3a8a;
  margin-top: 4px;
   margin-left: 3.px;
}

.card-description {
  text-align: justify;
  margin: 1rem 0;
  font-size: 0.95rem;
  color: #444;
   margin-left: 1rem;
   width: 90%;
}

.btn {
width: 100%;
  align-self: flex-start;
  text-decoration: none;
  background-color: #1e3a8a;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}
#partners {
 margin-bottom: 100px;
    }


 #news{
 
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    padding: 40px 20px;
    background-repeat: no-repeat;
    background-color: #041e42;
    margin-bottom: 100px;
}
    #news .newstext {
    flex: 1;
    text-align: left;
    padding-right: 20px;
}

#news h4{
    color: #fff;
    font-size: 22 px;
    font-weight: 700;
}
#news p{
    color: #818ea0;
    font-size: 14px;
    font-weight: 600;
}
#news p span{
    color: #ef3636;
}

#news .form{
    display: flex;
    width: 40%;
}

#news input{
    height: 3.125rem;
    padding: 0 1.25rem;
    font-size: 14px;
    width: 100%;
    border: 1px solid transparent;
    border-radius: 4px;
    outline: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

#news button{
    background-color: #088178;
    color: #fff;
    white-space: nowrap;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
#green {
    width: 100%;
    padding: 0;
    margin: 0;
}

#green .full-width-img {
    width: 100%;
    height: auto; 
    display: block; 
}


footer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #1e3a8a;
}
footer .col{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
}
.icon a i {
  color: white;
  font-size: 1.5rem; 
  transition: color 0.3s ease;
}

.icon a i:hover {
  color: #ccc;
}

footer .log{
    margin-bottom: 30px;
}

footer h4{
    font-size: 18px;
    padding-bottom: 20px;
    color: black;
}
footer p{
    font-size: 13px;
    margin: 0 0 8px 0;
    color: #FFF;
}
footer a{
    font-size: 13px;
    text-decoration: none;
    color: #FFF;
    margin-bottom: 10px;
}

footer .follow{
    margin-top: 0px;
    color: #FFF;
}

footer .follow i{
    color: #465b52;
    padding-right: 4px;
    cursor: pointer;
}

footer .install .row img{
    border: 1px solid #088178;
    border-radius: 6px;
}
footer .install img{
    margin: 10px 0 15px 0;
}
footer .follow i :hover,
footer a :hover{
    color: #088178;
}
footer .copyright{
    width: 100%;
    text-align: center;
}
`}
    </style>
</div>
</body>

  );
};

export default Dash;
