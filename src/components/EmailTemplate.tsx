import * as React from 'react';

interface EmailTemplateProps {
  downloadUrl: string;
  os: 'mac' | 'windows' | 'linux';
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  downloadUrl,
}) => (
  <div style={{
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    maxWidth: '600px',
    margin: '0 auto',
  }}>
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      {/* ?v=2 busts email image-proxy caches from the old logo era. */}
      <img src="https://memoflow.app/logo.png?v=2" alt="MemoFlow Logo" style={{ width: '96px', borderRadius: '21%' }} />
    </div>

    <div style={{ background: '#ff453a', padding: '2px' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
        <h1 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '20px' }}>
          Welcome to MemoFlow!
        </h1>

        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
          Thank you for choosing MemoFlow! Your meetings and dictation stay
          on your Mac — nothing you record ever leaves it.
        </p>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={downloadUrl}
            style={{
              background: '#ff453a',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Download MemoFlow for macOS
          </a>
          <p style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '10px'
          }}>
            Requires macOS 26 or later · this link expires in 10 minutes
          </p>
        </div>

        {/* Rest of the email content */}
      </div>
    </div>
  </div>
);