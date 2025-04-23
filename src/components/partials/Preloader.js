import React from 'react';
import Lottie from 'react-lottie';
import '../../css/Preloader.css'; 
import preloaderAnimation from '../../assets/rEHWpIpbrl.json'; 

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
      <Lottie options={options} height={150} width={150} speed={0.8}/>
    </div>
  );
};

export default Preloader;