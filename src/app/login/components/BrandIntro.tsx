import React from 'react';

const BrandIntro = () => {
  return (
    <div className="brand-intro">
      <div className="brand-content">
        <div className="brand-logo">
          {process.env.NEXT_PUBLIC_TITLE ? (
            <img src="/assets/logo.svg" alt="Logo" className="logo-image" />
          ) : (
            <div className="logo-placeholder">TTS</div>
          )}
        </div>
        <h1 className="brand-title">{process.env.NEXT_PUBLIC_TITLE || "语音合成平台"}</h1>
        <p className="brand-slogan">
          专业的文本转语音服务，让您的内容有声有色
        </p>
      </div>
    </div>
  );
};

export default BrandIntro;