import React from "react";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import Slider from "react-slick";

function Home(props) {
  const settings = {
    dots: true, // 페이지 번호를 나타냄
    infinite: true, // 무한 루프
    speed: 300, // 애니메이션 속도 (밀리초 단위)
    slidesToShow: 3, // 한 번에 보여질 슬라이드 수
    slidesToScroll: 3, // 스크롤할 슬라이드 수
    rows: 2,
    swipe: true,
    prevArrow: <></>, // 이전 화살표를 빈 컴포넌트로 지정
    nextArrow: <></>, // 다음 화살표를 빈 컴포넌트로 지정
  };

  return (
    <div className="home-container">
      <div className="home-image-container">
        <img src="assets/images/mainballoon.png" alt="mainimg import error" />
      </div>
      <div className="home-board">
        <Slider {...settings} className="home-carousel">
          {/* slide unit start*/}
          <div className="home-slide">
            <Link to="/Dogam" className="nav-link">
              <img src="/assets/icons/google.PNG" alt="icon" />
              <h6>도감</h6>
            </Link>
          </div>
          {/* slide unit end */}

          <div className="home-slide">
            <Link to="/Fishpic" className="nav-link">
              <img src="/assets/icons/google.PNG" alt="icon" />
              <h6>카메라</h6>
            </Link>
          </div>
          <div className="home-slide">
            <img src="/assets/icons/google.PNG" alt="icon" />
            <h6>아이콘3</h6>
          </div>
          <div className="home-slide">
            <img src="/assets/icons/google.PNG" alt="icon" />
            <h6>아이콘4</h6>
          </div>
          <div className="home-slide">
            <img src="/assets/icons/google.PNG" alt="icon" />
            <h6>아이콘5</h6>
          </div>
          <div className="home-slide">
            <img src="/assets/icons/google.PNG" alt="icon" />
            <h6>아이콘6</h6>
          </div>
          <div className="home-slide">
            <img src="/assets/icons/google.PNG" alt="icon" />
            <h6>아이콘7</h6>
          </div>
          <div className="home-slide">
            <img src="/assets/icons/google.PNG" alt="icon" />
            <h6>아이콘8</h6>
          </div>
          <div className="home-slide">
            <img src="/assets/icons/google.PNG" alt="icon" />
            <h6>아이콘9</h6>
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Home;