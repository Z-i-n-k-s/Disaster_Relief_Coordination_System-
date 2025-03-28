import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import img1 from "../../../assets/ban1.jpg";
import img2 from "../../../assets/ban4.jpg";
import img3 from "../../../assets/b2.jpg";
import img4 from "../../../assets/ban5.jpg";
import img5 from "../../../assets/b3.jpg";
import "./Banner.css";

const Banner = () => {
  const navigate = useNavigate();  // Hook to navigate programmatically

  // Function to handle the Donate Now button click
  const handleDonateNow = () => {
    navigate("/donateform"); // Navigate to the donate form page
  };

  return (
    <div className="relative">
      <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={3000}
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button onClick={onClickHandler} className="carousel-arrow carousel-prev">
              <FaChevronLeft size={30} color="white" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button onClick={onClickHandler} className="carousel-arrow carousel-next">
              <FaChevronRight size={30} color="white" />
            </button>
          )
        }
      >
        {/* Slide 1 */}
        <div className="relative">
          <img src={img1} className="carousel-image" />
          <div className="carousel-text">
            <h2>Emergency Disaster Relief</h2>
            <p>Join us in providing aid to those affected by disasters. Your contribution makes a difference!</p>
            <button className="donate-btn" onClick={handleDonateNow}>Donate Now</button>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="relative">
          <img src={img2} className="carousel-image" />
          <div className="carousel-text">
            <h2>Help Rebuild Communities</h2>
            <p>Your support can help save lives during critical times. Donate now!</p>
            <button className="donate-btn" onClick={handleDonateNow}>Donate Now</button>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="relative">
          <img src={img3} className="carousel-image" />
          <div className="carousel-text">
            <h2>Support Flood Victims</h2>
            <p>Together, we can rebuild and restore communities. Let's act now!</p>
            <button className="donate-btn" onClick={handleDonateNow}>Donate Now</button>
          </div>
        </div>

        {/* Slide 4 */}
        <div className="relative">
          <img src={img4} className="carousel-image" />
          <div className="carousel-text">
            <h2>Food & Shelter for Families</h2>
            <p>Help us reach those in need by contributing to disaster relief efforts.</p>
            <button className="donate-btn" onClick={handleDonateNow}>Donate Now</button>
          </div>
        </div>

        {/* Slide 5 */}
        <div className="relative">
          <img src={img5} className="carousel-image" />
          <div className="carousel-text">
            <h2>Your Contribution Matters</h2>
            <p>Your donation can provide hope and resources to disaster victims.</p>
            <button className="donate-btn" onClick={handleDonateNow}>Donate Now</button>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
