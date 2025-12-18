// BtcTermsPage.jsx
import React from 'react';

const BtcTermsPage = () => {
  const pdfFile = '/dieu-khoan.pdf';

  return (
    <div style={{ width: '370%', height: '1300px' }}>
      <iframe
        src={pdfFile}
        title="Điều khoản BTC"
        width="100%"
        height="100%" // iframe sẽ lấp đầy 1300px của div cha
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default BtcTermsPage;