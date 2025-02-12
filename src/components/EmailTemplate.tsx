import * as React from 'react';

interface EmailTemplateProps {
  downloadUrl: string;
  os: 'mac' | 'windows' | 'linux';
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  downloadUrl,
  os,
}) => (
  <div style={{
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    maxWidth: '600px',
    margin: '0 auto',
  }}>
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <img src="https://memoflow.app/logo.png" alt="MemoFlow Logo" style={{ width: '150px' }} />
    </div>
    
    <div style={{ background: 'linear-gradient(to right, #fbbf24, #f59e0b)', padding: '2px' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
        <h1 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '20px' }}>
          Welcome to MemoFlow!
        </h1>
        
        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
          Thank you for choosing MemoFlow! We're excited to help you transform your meetings into actionable insights.
        </p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={downloadUrl}
            style={{
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Download MemoFlow for {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : 'Linux'}
          </a>
        </div>
        
        {/* Rest of the email content */}
      </div>
    </div>
  </div>
); 