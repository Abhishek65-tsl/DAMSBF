// src/components/AssetImage/AssetImage.jsx
import React from 'react';
import styles from './AssetImage.module.css';
import myImage from '../../../assets/Images/BLT.png'


export default function AssetImage({  alt }) {
  return (
    <div className={styles.container}>
      {/* <img className={styles.image} src={src} alt={alt} /> */}
      <img className={styles.image} src={myImage} alt={alt} />
    </div>
  );
}