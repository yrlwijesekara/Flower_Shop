import './About.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniNavbar from '../components/MiniNavbar';
function About() {
  return (
    <>
    <Navbar />
    <MiniNavbar />
      <div class="img">  
        <img src="/About/aboutj.jpg" alt="Flowers" />

      </div>
    <div class="aboutContainter">
        <h1>About Us</h1>
         <h3>WHO ARE WE</h3>
        <p>Welcome to our floral and plant boutique — where nature’s finest blooms and greenery come together in perfect harmony.
            We are passionate florists dedicated to the art of floristry — from fresh flower arrangements and floral styling to indoor plant care and display. Our shop offers a wide range of fresh flowers, potted plants, and green gifts, carefully selected to bring life and beauty into your spaces.<br></br>

            Floristry isn't just about flowers. It’s about expressing emotions through nature. Whether it's a single rose or a lush indoor plant, we’re here to help you choose something meaningful for every moment.</p>

    </div>


    <div class="experiencecontainer">
        
        <div class="yearsofexperience">
        <h1>23 Years of Experience</h1>
        <h4>Natural Materials</h4>
        <h5>Free Shipping</h5>
        <h4>5 Days Refund</h4>
        <h5>Best Fabrics</h5>
        <h4>Good Woods</h4>
        <h5>Friendly Support</h5>
        
        

    </div>

<div class="experienceimg">
    <div class="imgdev">
        <div class="imgone"> <img src="/About/img1.jpg" alt="Experience" /> </div>
        <div class="imgthree"> <img src="/About/img3.jpg" alt="Experience" /> </div>
       
    </div>
    <div class="imgdevtwo">
         <div class="imgtwo"> <img src="/About/img2.jpg" alt="Experience" /> </div>
        <div class="imgfour"> <img src="/About/img4.jpg" alt="Experience" /> </div>
    </div>

</div>

    </div>


<div class="Historycontainer">
    <div class="HistoryImg">
        <div class="experienceimg">
    <div class="imgdev">
        <div class="imgone"> <img src="/About/img1.jpg" alt="Experience" /> </div>
        <div class="imgthree"> <img src="/About/img3.jpg" alt="Experience" /> </div>
       
    </div>
    <div class="imgdevtwo">
         <div class="imgtwo"> <img src="/About/img2.jpg" alt="Experience" /> </div>
        <div class="imgfour"> <img src="/About/img4.jpg" alt="Experience" /> </div>
    </div>

</div>

    </div>
    <div class="HistoryText">
    <h1>OUR HISTORY</h1>\
    <p>From timeless floral beauty to modern plant care — we’ve got it all in one place. Whether you’re styling your home, garden, or office, our shop offers a carefully selected range of flowers, potted plants, natural decor pieces, and fertilizers for all plant types.
Inspired by nature and ancient traditions, we also celebrate the use of natural materials like wood, stone, and moss — transforming any space into a green, peaceful retreat.</p>
    </div>
</div>


<div class="Result">
    <div class="bg-overlay"> <img src="/About/Aboutbg.jpg" alt="Background" /></div>
    <h1>WHAT IS OUR RESULT?</h1>
    
    <div class="resultbox">
    <div class="tbox"> <div class="onebox"> 25 <br></br>+</div> <p>Years of Experience</p> </div>
    <div class="ttbox"> <p>Happy Customers</p> <div class="twobox"> k<br></br>25</div> </div>
       <div class="tttbox"> <div class="threebox"> 25 <br></br>+</div> <p>Show Rooms</p> </div>
    <div class="ttbox"> <p>Award Winning</p> <div class="fourbox"> +<br></br>25</div> </div>
</div>
</div>

<div class="Clientbox">
    <h1>WHAT IS OUR CLIENT SAYS?</h1>
    <img src="/About/client.jpg" alt="Quote" />
    <h2>Emali Jems</h2>
    <p>"Absolutely beautiful flowers! I ordered a bouquet for my mom's birthday, and she loved it. Fresh, vibrant, and delivered right on time."</p>



</div>
<Footer />

    </>
  )
}

export default About
