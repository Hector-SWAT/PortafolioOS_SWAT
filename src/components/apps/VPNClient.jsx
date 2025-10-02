import { useState, useEffect } from 'react';

const VPNClient = ({ windowId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState('us-newyork');
  const [connectionTime, setConnectionTime] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [dataTransferred, setDataTransferred] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('high');

  // Servidores disponibles
  const servers = [
    { id: 'us-newyork', name: 'New York, USA', flag: '🇺🇸', ping: 28 },
    { id: 'uk-london', name: 'London, UK', flag: '🇬🇧', ping: 35 },
    { id: 'de-frankfurt', name: 'Frankfurt, Germany', flag: '🇩🇪', ping: 42 },
    { id: 'jp-tokyo', name: 'Tokyo, Japan', flag: '🇯🇵', ping: 185 },
    { id: 'ca-toronto', name: 'Toronto, Canada', flag: '🇨🇦', ping: 45 },
    { id: 'sg-singapore', name: 'Singapore', flag: '🇸🇬', ping: 220 },
    { id: 'au-sydney', name: 'Sydney, Australia', flag: '🇦🇺', ping: 280 },
    { id: 'br-saopaulo', name: 'São Paulo, Brazil', flag: '🇧🇷', ping: 120 }
  ];

  // Niveles de seguridad
  const securityLevels = [
    { id: 'high', name: 'High Security', description: 'AES-256 + Perfect Forward Secrecy' },
    { id: 'standard', name: 'Standard', description: 'AES-128 + Basic Encryption' },
    { id: 'stealth', name: 'Stealth Mode', description: 'Obfuscated servers + Deep Packet Inspection bypass' }
  ];

  // Simular conexión VPN
  const toggleConnection = async () => {
    if (isConnecting) return;

    if (!isConnected) {
      // Conectar
      setIsConnecting(true);
      
      // Simular tiempo de conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setIsConnecting(false);
      
      // Iniciar temporizador
      const startTime = Date.now();
      const timer = setInterval(() => {
        if (isConnected) {
          const seconds = Math.floor((Date.now() - startTime) / 1000);
          setConnectionTime(seconds);
        } else {
          clearInterval(timer);
        }
      }, 1000);
      
      // Simular tráfico de red
      simulateNetworkTraffic();
    } else {
      // Desconectar
      setIsConnected(false);
      setConnectionTime(0);
      setDownloadSpeed(0);
      setUploadSpeed(0);
    }
  };

  // Simular tráfico de red
  const simulateNetworkTraffic = () => {
    const trafficInterval = setInterval(() => {
      if (!isConnected) {
        clearInterval(trafficInterval);
        return;
      }
      
      // Velocidades aleatorias realistas
      const newDownload = Math.random() * 50 + 10; // 10-60 Mbps
      const newUpload = Math.random() * 20 + 5;    // 5-25 Mbps
      
      setDownloadSpeed(Math.round(newDownload * 10) / 10);
      setUploadSpeed(Math.round(newUpload * 10) / 10);
      setDataTransferred(prev => prev + Math.round(newDownload * 131072)); // MB aproximados
    }, 2000);
  };

  // Formatear tiempo de conexión
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatear datos transferidos
  const formatData = (bytes) => {
    const mb = bytes / 1048576;
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  // Obtener servidor seleccionado
  const currentServer = servers.find(server => server.id === selectedServer);

  return (
    <div className="vpn-client">
      {/* Header de estado */}
      <div className={`status-header ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-indicator">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span className="status-text">
            {isConnecting ? 'Connecting...' : isConnected ? 'Protected' : 'Disconnected'}
          </span>
        </div>
        <div className="connection-time">
          {isConnected && `Connected: ${formatTime(connectionTime)}`}
        </div>
      </div>

      {/* Información del servidor */}
      <div className="server-info">
        <div className="server-card">
          <div className="server-flag">{currentServer.flag}</div>
          <div className="server-details">
            <div className="server-name">{currentServer.name}</div>
            <div className="server-ping">Ping: {currentServer.ping}ms</div>
          </div>
          <div className="server-status">
            {isConnected && <div className="secure-badge">🔒 Secure</div>}
          </div>
        </div>
      </div>

      {/* Botón de conexión principal */}
      <div className="connection-section">
        <button
          className={`connect-button ${isConnected ? 'disconnect' : 'connect'} ${isConnecting ? 'connecting' : ''}`}
          onClick={toggleConnection}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <div className="connecting-animation">
              <div className="spinner"></div>
              Connecting...
            </div>
          ) : isConnected ? (
            'Disconnect VPN'
          ) : (
            'Connect VPN'
          )}
        </button>
      </div>

      {/* Estadísticas en tiempo real */}
      {isConnected && (
        <div className="stats-section">
          <h3>Real-time Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⬇️</div>
              <div className="stat-value">{downloadSpeed} Mbps</div>
              <div className="stat-label">Download</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⬆️</div>
              <div className="stat-value">{uploadSpeed} Mbps</div>
              <div className="stat-label">Upload</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{formatData(dataTransferred)}</div>
              <div className="stat-label">Transferred</div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de servidores */}
      <div className="servers-section">
        <h3>Select Server</h3>
        <div className="servers-grid">
          {servers.map(server => (
            <div
              key={server.id}
              className={`server-option ${selectedServer === server.id ? 'selected' : ''} ${isConnected ? 'connected' : ''}`}
              onClick={() => !isConnected && setSelectedServer(server.id)}
            >
              <div className="server-option-flag">{server.flag}</div>
              <div className="server-option-details">
                <div className="server-option-name">{server.name}</div>
                <div className="server-option-ping">{server.ping}ms</div>
              </div>
              {selectedServer === server.id && (
                <div className="server-selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Configuración de seguridad */}
      <div className="security-section">
        <h3>Security Settings</h3>
        <div className="security-options">
          {securityLevels.map(level => (
            <div
              key={level.id}
              className={`security-option ${securityLevel === level.id ? 'selected' : ''}`}
              onClick={() => setSecurityLevel(level.id)}
            >
              <div className="security-radio">
                <div className={`radio-dot ${securityLevel === level.id ? 'selected' : ''}`}></div>
              </div>
              <div className="security-details">
                <div className="security-name">{level.name}</div>
                <div className="security-description">{level.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información de seguridad */}
      <div className="security-info">
        <div className="security-badge">
          <div className="badge-icon">🛡️</div>
          <div className="badge-text">
            <div className="badge-title">Kill Switch Active</div>
            <div className="badge-subtitle">Internet blocked if VPN disconnects</div>
          </div>
        </div>
        <div className="security-badge">
          <div className="badge-icon">🚫</div>
          <div className="badge-text">
            <div className="badge-title">No Logs Policy</div>
            <div className="badge-subtitle">We don't track your activity</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vpn-client {
          width: 100%;
          height: 100%;
          background: #1a202c;
          color: white;
          font-family: 'Ubuntu', sans-serif;
          padding: 20px;
          overflow-y: auto;
          box-sizing: border-box;
        }

        /* Header de estado */
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          background: #2d3748;
          border: 1px solid #4a5568;
        }

        .status-header.connected {
          background: linear-gradient(135deg, #2d3748 0%, #22543d 100%);
          border-color: #38a169;
        }

        .status-header.disconnected {
          background: #2d3748;
          border-color: #4a5568;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.connected {
          background: #68d391;
          box-shadow: 0 0 10px #68d391;
        }

        .status-dot.disconnected {
          background: #fc8181;
        }

        .status-text {
          font-weight: 600;
          font-size: 16px;
        }

        .connection-time {
          color: #a0aec0;
          font-size: 14px;
        }

        /* Información del servidor */
        .server-info {
          margin-bottom: 20px;
        }

        .server-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #2d3748;
          border-radius: 10px;
          border: 1px solid #4a5568;
        }

        .server-flag {
          font-size: 32px;
        }

        .server-details {
          flex: 1;
        }

        .server-name {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .server-ping {
          color: #a0aec0;
          font-size: 14px;
        }

        .secure-badge {
          background: #68d391;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Botón de conexión */
        .connection-section {
          margin-bottom: 25px;
        }

        .connect-button {
          width: 100%;
          padding: 18px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Ubuntu', sans-serif;
        }

        .connect-button.connect {
          background: linear-gradient(135deg, #68d391 0%, #38a169 100%);
          color: white;
        }

        .connect-button.disconnect {
          background: linear-gradient(135deg, #fc8181 0%, #e53e3e 100%);
          color: white;
        }

        .connect-button.connecting {
          background: #4a5568;
          color: #a0aec0;
          cursor: not-allowed;
        }

        .connect-button.connect:hover:not(.connecting) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(104, 211, 145, 0.4);
        }

        .connect-button.disconnect:hover:not(.connecting) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(252, 129, 129, 0.4);
        }

        .connecting-animation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Estadísticas */
        .stats-section {
          margin-bottom: 25px;
        }

        .stats-section h3 {
          margin-bottom: 15px;
          color: #e2e8f0;
          font-size: 18px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .stat-card {
          background: #2d3748;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          border: 1px solid #4a5568;
        }

        .stat-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #68d391;
          margin-bottom: 4px;
        }

        .stat-label {
          color: #a0aec0;
          font-size: 12px;
        }

        /* Servidores */
        .servers-section {
          margin-bottom: 25px;
        }

        .servers-section h3 {
          margin-bottom: 15px;
          color: #e2e8f0;
          font-size: 18px;
        }

        .servers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .server-option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 15px;
          background: #2d3748;
          border: 1px solid #4a5568;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .server-option:hover:not(.connected) {
          border-color: #68d391;
          background: #2f5a3c;
        }

        .server-option.selected {
          border-color: #68d391;
          background: #22543d;
        }

        .server-option.connected {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .server-option-flag {
          font-size: 24px;
        }

        .server-option-details {
          flex: 1;
        }

        .server-option-name {
          font-weight: 500;
          margin-bottom: 2px;
        }

        .server-option-ping {
          color: #a0aec0;
          font-size: 12px;
        }

        .server-selected-indicator {
          color: #68d391;
          font-weight: bold;
          font-size: 18px;
        }

        /* Configuración de seguridad */
        .security-section {
          margin-bottom: 25px;
        }

        .security-section h3 {
          margin-bottom: 15px;
          color: #e2e8f0;
          font-size: 18px;
        }

        .security-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .security-option {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;
          background: #2d3748;
          border: 1px solid #4a5568;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .security-option:hover {
          border-color: #68d391;
        }

        .security-option.selected {
          border-color: #68d391;
          background: #22543d;
        }

        .security-radio {
          padding-top: 2px;
        }

        .radio-dot {
          width: 18px;
          height: 18px;
          border: 2px solid #4a5568;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .radio-dot.selected {
          border-color: #68d391;
          background: #68d391;
          box-shadow: 0 0 0 4px rgba(104, 211, 145, 0.2);
        }

        .security-details {
          flex: 1;
        }

        .security-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .security-description {
          color: #a0aec0;
          font-size: 12px;
          line-height: 1.4;
        }

        /* Información de seguridad */
        .security-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #2d3748;
          border: 1px solid #4a5568;
          border-radius: 8px;
        }

        .badge-icon {
          font-size: 20px;
        }

        .badge-text {
          flex: 1;
        }

        .badge-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .badge-subtitle {
          color: #a0aec0;
          font-size: 11px;
        }

        /* Animaciones */
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .vpn-client {
            padding: 15px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .security-info {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .server-card {
            padding: 12px;
          }

          .connect-button {
            padding: 16px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .vpn-client {
            padding: 10px;
          }

          .status-header {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .server-card {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .servers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default VPNClient;