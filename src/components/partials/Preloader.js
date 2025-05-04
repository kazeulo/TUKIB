import React from 'react';
import Lottie from 'react-lottie';
import '../../css/Preloader.css'; 
import preloaderAnimation from '../../assets/preloader.json'; 

const Preloader = () => {
  const options = {
    loop: true,
    autoplay: true,
    animationData: preloaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="preloader">
      <Lottie options={options} height={110} width={110} speed={0.7}/>
    </div>
  );
};

export default Preloader;