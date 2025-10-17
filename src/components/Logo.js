import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const LogoIcon = styled.div`
  font-size: 2rem;
  margin-right: 10px;
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 2rem;
  background: linear-gradient(90deg, gold, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoImage = styled.img`
  max-width: 100%;
  max-height: 80px;
  margin-right: 10px;
`;

const Logo = ({ size = 'large', imageSrc = null, showText = true }) => {
  const fontSize = size === 'small' ? '1.5rem' : '2rem';
  
  if (imageSrc) {
    return (
      <LogoContainer>
        <LogoImage src={imageSrc} alt="Logo" />
        {showText && <LogoText style={{ fontSize }}>Mehfil</LogoText>}
      </LogoContainer>
    );
  }
  
  return (
    <LogoContainer>
      <LogoIcon>🏆</LogoIcon>
      {showText && <LogoText style={{ fontSize }}>Mehfil</LogoText>}
    </LogoContainer>
  );
};

export default Logo;