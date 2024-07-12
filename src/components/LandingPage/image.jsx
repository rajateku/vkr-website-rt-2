import React from "react";

export const Image = ({ title, largeImage, smallImage }) => {
  const styles = {
    portfolioItem: {
      display: 'inline-block',
      margin: '10px',
    },
    hoverBg: {
      position: 'relative',
      overflow: 'hidden',
    },
    imgResponsive: {
      width: '300px',  // Set your desired width
      height: '400px', // Set your desired height
      objectFit: 'cover', // Ensure the image covers the entire area
    },
    hoverText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      textAlign: 'center',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    hoverBgHover: {
      opacity: 1,
    },
  };

  return (
    <div style={styles.portfolioItem}>
      <div
        style={styles.hoverBg}
        onMouseEnter={(e) => {
          e.currentTarget.querySelector('.hover-text').style.opacity = 1;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelector('.hover-text').style.opacity = 0;
        }}
      >
        <div className="hover-text" style={styles.hoverText}>
          <h4>{title}</h4>
        </div>
        <img src={smallImage} style={styles.imgResponsive} alt={title} />
      </div>
    </div>
  );
};
