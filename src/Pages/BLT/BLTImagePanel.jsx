import React from 'react';
import BLTImage from '../../assets/images/BLT.png';

const BLTImagePanel = () => {
  return (
    <div style={{
      width: '100%',
      height: '300px',
      overflow: 'hidden',
      borderRadius: '10px',
      border: '1px solid #444',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img
        src={BLTImage}
        alt="BLT System"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default BLTImagePanel;
