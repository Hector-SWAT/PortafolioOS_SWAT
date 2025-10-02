// src/apps/FileEncryption.jsx
import { useState, useRef } from 'react';

const FileEncryption = ({ windowId }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [operation, setOperation] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [algorithm, setAlgorithm] = useState('aes-256');
  const [keyStrength, setKeyStrength] = useState('high');
  const [showKey, setShowKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('files'); // 'files', 'settings', 'history'

  const fileInputRef = useRef(null);

  const algorithms = [
    { id: 'aes-256', name: 'AES-256-GCM', strength: 'Military Grade', icon: '🛡️' },
    { id: 'chacha20', name: 'ChaCha20-Poly1305', strength: 'High Security', icon: '🔐' },
    { id: 'twofish', name: 'Twofish', strength: 'Strong Encryption', icon: '🐠' },
    { id: 'serpent', name: 'Serpent', strength: 'High Security', icon: '🐍' }
  ];

  const strengthOptions = [
    { id: 'low', name: 'Low (128-bit)', time: 'Seconds to crack' },
    { id: 'medium', name: 'Medium (192-bit)', time: 'Years to crack' },
    { id: 'high', name: 'High (256-bit)', time: 'Billions of years' }
  ];

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name),
      originalFile: file,
      status: 'pending',
      encrypted: false,
      uploadTime: new Date().toLocaleTimeString()
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      setSelectedFile(newFiles[0].id);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newFiles = droppedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name),
      originalFile: file,
      status: 'pending',
      encrypted: false,
      uploadTime: new Date().toLocaleTimeString()
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      setSelectedFile(newFiles[0].id);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      'txt': '📄 Text',
      'pdf': '📕 PDF',
      'doc': '📘 Document',
      'docx': '📘 Document',
      'jpg': '🖼️ Image',
      'png': '🖼️ Image',
      'jpeg': '🖼️ Image',
      'zip': '📦 Archive',
      'rar': '📦 Archive',
      'mp4': '🎥 Video',
      'mp3': '🎵 Audio',
      'exe': '⚙️ Executable',
      'xls': '📊 Spreadsheet',
      'xlsx': '📊 Spreadsheet'
    };
    return types[ext] || '📁 File';
  };

  const getFileIcon = (file) => {
    if (file.encrypted) return '🔒';
    return file.type.charAt(0);
  };

  const generateEncryptionKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    const length = keyStrength === 'low' ? 16 : keyStrength === 'medium' ? 24 : 32;
    
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setGeneratedKey(key);
    setShowKey(true);
    return key;
  };

  const simulateEncryption = (file) => {
    return new Promise((resolve) => {
      setIsProcessing(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            
            // Actualizar estado del archivo
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, status: 'completed', encrypted: operation === 'encrypt' } : f
            ));
            
            // Agregar al historial
            const historyEntry = {
              id: Date.now(),
              filename: file.name,
              operation: operation,
              algorithm: algorithm,
              timestamp: new Date().toLocaleString(),
              status: 'success'
            };
            setHistory(prev => [historyEntry, ...prev.slice(0, 49)]);
            
            resolve();
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 100);
    });
  };

  const handleProcessFiles = async () => {
    if (!password) {
      alert('Please enter a password');
      return;
    }
    
    if (operation === 'encrypt' && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (files.length === 0) {
      alert('Please select files to process');
      return;
    }

    const filesToProcess = selectedFile ? [files.find(f => f.id === selectedFile)] : files;
    
    for (const file of filesToProcess) {
      if (file.status !== 'processing') {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' } : f
        ));
        
        await simulateEncryption(file);
      }
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile === fileId) {
      setSelectedFile(files.length > 1 ? files[0].id : null);
    }
  };

  const clearAllFiles = () => {
    setFiles([]);
    setSelectedFile(null);
  };

  const getAlgorithmInfo = () => {
    return algorithms.find(algo => algo.id === algorithm);
  };

  const getStrengthInfo = () => {
    return strengthOptions.find(strength => strength.id === keyStrength);
  };

  // Render para móvil
  const renderMobileView = () => (
    <div className="mobile-container">
      {/* Header móvil */}
      <div className="mobile-header">
        <div className="mobile-app-title">
          <div className="app-icon">🔒</div>
          <div>
            <h1>File Encryption</h1>
            <p>System SWAT</p>
          </div>
        </div>
        <div className={`mobile-status ${isProcessing ? 'processing' : 'ready'}`}>
          {isProcessing ? '🔄' : '✅'}
        </div>
      </div>

      {/* Tabs móviles */}
      <div className="mobile-tabs">
        <button 
          className={`mobile-tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          📁 Files
        </button>
        <button 
          className={`mobile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
        <button 
          className={`mobile-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 History
        </button>
      </div>

      {/* Contenido de tabs */}
      <div className="mobile-content">
        {activeTab === 'files' && (
          <div className="mobile-tab-content">
            {/* Drop Zone Móvil */}
            <div 
              className="mobile-drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-icon">📁</div>
              <p>Tap to select files</p>
              <small>or drag & drop</small>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              style={{ display: 'none' }}
            />

            {/* Lista de archivos móvil */}
            {files.length > 0 && (
              <div className="mobile-file-list">
                <div className="mobile-file-header">
                  <h3>Selected Files ({files.length})</h3>
                  <button className="mobile-clear-all" onClick={clearAllFiles}>
                    Clear All
                  </button>
                </div>
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`mobile-file-item ${file.status}`}
                  >
                    <div className="mobile-file-icon">{getFileIcon(file)}</div>
                    <div className="mobile-file-info">
                      <div className="mobile-file-name">{file.name}</div>
                      <div className="mobile-file-details">
                        {file.size} • {file.type}
                      </div>
                    </div>
                    <div className="mobile-file-actions">
                      <div className="mobile-file-status">
                        {file.status === 'processing' && '🔄'}
                        {file.status === 'completed' && (file.encrypted ? '🔒' : '🔓')}
                        {file.status === 'pending' && '⏳'}
                      </div>
                      <button 
                        className="mobile-remove-file"
                        onClick={() => removeFile(file.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="mobile-tab-content">
            {/* Operación */}
            <div className="mobile-section">
              <h3>Operation</h3>
              <div className="mobile-operation-buttons">
                <button
                  className={`mobile-operation-btn ${operation === 'encrypt' ? 'active' : ''}`}
                  onClick={() => setOperation('encrypt')}
                >
                  <span className="btn-icon">🔒</span>
                  Encrypt
                </button>
                <button
                  className={`mobile-operation-btn ${operation === 'decrypt' ? 'active' : ''}`}
                  onClick={() => setOperation('decrypt')}
                >
                  <span className="btn-icon">🔓</span>
                  Decrypt
                </button>
              </div>
            </div>

            {/* Configuración */}
            <div className="mobile-section">
              <h3>Encryption Settings</h3>
              <div className="mobile-settings">
                <div className="mobile-setting">
                  <label>Algorithm</label>
                  <select 
                    value={algorithm} 
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="mobile-setting-select"
                  >
                    {algorithms.map(algo => (
                      <option key={algo.id} value={algo.id}>
                        {algo.icon} {algo.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mobile-setting">
                  <label>Key Strength</label>
                  <select 
                    value={keyStrength} 
                    onChange={(e) => setKeyStrength(e.target.value)}
                    className="mobile-setting-select"
                  >
                    {strengthOptions.map(strength => (
                      <option key={strength.id} value={strength.id}>
                        {strength.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div className="mobile-section">
              <h3>Security Key</h3>
              <div className="mobile-password-group">
                <input
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mobile-password-input"
                />
                {operation === 'encrypt' && (
                  <input
                    type="password"
                    placeholder="Confirm password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mobile-password-input"
                  />
                )}
              </div>
              
              <button 
                className="mobile-generate-key"
                onClick={generateEncryptionKey}
              >
                🎲 Generate Key
              </button>
              
              {showKey && (
                <div className="mobile-generated-key">
                  <strong>Generated Key:</strong>
                  <code>{generatedKey}</code>
                  <button onClick={() => setShowKey(false)}>Hide</button>
                </div>
              )}
            </div>

            {/* Progreso */}
            {isProcessing && (
              <div className="mobile-section">
                <h3>Processing</h3>
                <div className="mobile-progress">
                  <div className="mobile-progress-bar">
                    <div 
                      className="mobile-progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="mobile-progress-text">{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {/* Botón de acción */}
            <div className="mobile-action-section">
              <button
                className={`mobile-process-btn ${isProcessing ? 'processing' : ''}`}
                onClick={handleProcessFiles}
                disabled={isProcessing || files.length === 0 || !password}
              >
                {isProcessing ? (
                  <>
                    <span className="mobile-spinner">🔄</span>
                    Processing... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <span className="btn-icon">
                      {operation === 'encrypt' ? '🔒' : '🔓'}
                    </span>
                    {operation === 'encrypt' ? 'Encrypt Files' : 'Decrypt Files'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="mobile-tab-content">
            <div className="mobile-section">
              <h3>Recent Operations</h3>
              {history.length === 0 ? (
                <div className="mobile-no-history">
                  <div className="no-history-icon">📋</div>
                  <p>No operations yet</p>
                </div>
              ) : (
                <div className="mobile-history-list">
                  {history.slice(0, 10).map(entry => (
                    <div key={entry.id} className="mobile-history-item">
                      <div className="mobile-history-icon">
                        {entry.operation === 'encrypt' ? '🔒' : '🔓'}
                      </div>
                      <div className="mobile-history-details">
                        <div className="mobile-history-filename">{entry.filename}</div>
                        <div className="mobile-history-info">
                          {entry.operation} • {entry.algorithm}
                        </div>
                        <div className="mobile-history-time">{entry.timestamp}</div>
                      </div>
                      <div className="mobile-history-status success">✅</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render para desktop (tu código original)
  const renderDesktopView = () => (
    <div className="file-encryption">
      <div className="encryption-container">
        {/* Header */}
        <div className="app-header">
          <div className="header-left">
            <div className="app-icon">🔒</div>
            <div className="app-title">
              <h1>File Encryption - System SWAT</h1>
              <p>Military-grade file encryption and decryption</p>
            </div>
          </div>
          <div className="header-status">
            <div className={`status-indicator ${isProcessing ? 'processing' : 'ready'}`}>
              {isProcessing ? '🔄 Processing' : '✅ Ready'}
            </div>
          </div>
        </div>

        <div className="main-content">
          {/* Sidebar - File List */}
          <div className="sidebar">
            <div className="sidebar-header">
              <h3>Files</h3>
              <span className="file-count">{files.length} files</span>
            </div>
            
            <div 
              className="drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-icon">📁</div>
              <p>Drop files here or click to browse</p>
              <small>Supports all file types</small>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              style={{ display: 'none' }}
            />

            {files.length > 0 && (
              <div className="file-list">
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`file-item ${selectedFile === file.id ? 'selected' : ''} ${file.status}`}
                    onClick={() => setSelectedFile(file.id)}
                  >
                    <div className="file-icon">{getFileIcon(file)}</div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-details">
                        {file.size} • {file.type} • {file.uploadTime}
                      </div>
                    </div>
                    <div className="file-status">
                      {file.status === 'processing' && '🔄'}
                      {file.status === 'completed' && (file.encrypted ? '🔒' : '🔓')}
                      {file.status === 'pending' && '⏳'}
                    </div>
                    <button 
                      className="remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <button className="clear-all" onClick={clearAllFiles}>
                🗑️ Clear All Files
              </button>
            )}
          </div>

          {/* Main Panel - Encryption Controls */}
          <div className="main-panel">
            {/* Operation Selection */}
            <div className="control-section">
              <h3>Operation</h3>
              <div className="operation-buttons">
                <button
                  className={`operation-btn ${operation === 'encrypt' ? 'active' : ''}`}
                  onClick={() => setOperation('encrypt')}
                >
                  <span className="btn-icon">🔒</span>
                  <span className="btn-text">Encrypt Files</span>
                </button>
                <button
                  className={`operation-btn ${operation === 'decrypt' ? 'active' : ''}`}
                  onClick={() => setOperation('decrypt')}
                >
                  <span className="btn-icon">🔓</span>
                  <span className="btn-text">Decrypt Files</span>
                </button>
              </div>
            </div>

            {/* Encryption Settings */}
            <div className="control-section">
              <h3>Encryption Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <label>Algorithm</label>
                  <select 
                    value={algorithm} 
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="setting-select"
                  >
                    {algorithms.map(algo => (
                      <option key={algo.id} value={algo.id}>
                        {algo.icon} {algo.name}
                      </option>
                    ))}
                  </select>
                  <div className="setting-info">
                    Strength: {getAlgorithmInfo().strength}
                  </div>
                </div>

                <div className="setting-group">
                  <label>Key Strength</label>
                  <select 
                    value={keyStrength} 
                    onChange={(e) => setKeyStrength(e.target.value)}
                    className="setting-select"
                  >
                    {strengthOptions.map(strength => (
                      <option key={strength.id} value={strength.id}>
                        {strength.name}
                      </option>
                    ))}
                  </select>
                  <div className="setting-info">
                    {getStrengthInfo().time}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="control-section">
              <h3>Security Key</h3>
              <div className="password-group">
                <input
                  type="password"
                  placeholder="Enter encryption password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password-input"
                />
                {operation === 'encrypt' && (
                  <input
                    type="password"
                    placeholder="Confirm password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="password-input"
                  />
                )}
              </div>
              
              <div className="key-actions">
                <button 
                  className="generate-key-btn"
                  onClick={generateEncryptionKey}
                >
                  🎲 Generate Strong Key
                </button>
                
                {showKey && (
                  <div className="generated-key">
                    <strong>Generated Key:</strong>
                    <code>{generatedKey}</code>
                    <button onClick={() => setShowKey(false)}>Hide</button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="control-section">
                <h3>Processing Files</h3>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{Math.round(progress)}%</span>
                </div>
                <p className="progress-info">
                  {operation === 'encrypt' ? 'Encrypting' : 'Decrypting'} files securely...
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="action-section">
              <button
                className={`process-btn ${isProcessing ? 'processing' : ''}`}
                onClick={handleProcessFiles}
                disabled={isProcessing || files.length === 0 || !password}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner">🔄</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">
                      {operation === 'encrypt' ? '🔒' : '🔓'}
                    </span>
                    {operation === 'encrypt' ? 'Encrypt Files' : 'Decrypt Files'}
                  </>
                )}
              </button>
              
              <div className="security-info">
                <p>🔐 All files are processed locally - no data leaves your device</p>
                <p>⚡ Military-grade encryption algorithms</p>
                <p>🛡️ Zero-knowledge architecture</p>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="control-section">
                <h3>Recent Operations</h3>
                <div className="history-list">
                  {history.slice(0, 5).map(entry => (
                    <div key={entry.id} className="history-item">
                      <div className="history-icon">
                        {entry.operation === 'encrypt' ? '🔒' : '🔓'}
                      </div>
                      <div className="history-details">
                        <div className="history-filename">{entry.filename}</div>
                        <div className="history-info">
                          {entry.operation} • {entry.algorithm} • {entry.timestamp}
                        </div>
                      </div>
                      <div className="history-status success">✅</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        /* Estilos base compartidos */
        .file-encryption {
          width: 100%;
          height: 100%;
          background: #1a1a1a;
          color: #e0e0e0;
          font-family: 'Ubuntu', monospace;
          overflow: auto;
        }

        .encryption-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Estilos Desktop (tu código original) */
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .app-icon {
          font-size: 48px;
        }

        .app-title h1 {
          margin: 0;
          color: #fff;
          font-size: 24px;
        }

        .app-title p {
          margin: 5px 0 0 0;
          color: #888;
          font-size: 14px;
        }

        .status-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .status-indicator.ready {
          background: #10B981;
          color: white;
        }

        .status-indicator.processing {
          background: #F59E0B;
          color: white;
        }

        .main-content {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 20px;
          height: calc(100vh - 150px);
        }

        .sidebar {
          background: #2a2a2a;
          border-radius: 12px;
          padding: 20px;
          overflow-y: auto;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sidebar-header h3 {
          margin: 0;
          color: #fff;
        }

        .file-count {
          background: #404040;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .drop-zone {
          border: 2px dashed #555;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .drop-zone:hover {
          border-color: #8B5CF6;
          background: #333;
        }

        .drop-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .file-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #333;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .file-item:hover {
          background: #3a3a3a;
        }

        .file-item.selected {
          border-color: #8B5CF6;
          background: #3a3a3a;
        }

        .file-item.processing {
          border-left: 4px solid #F59E0B;
        }

        .file-item.completed {
          border-left: 4px solid #10B981;
        }

        .file-icon {
          font-size: 20px;
        }

        .file-info {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-details {
          font-size: 11px;
          color: #888;
        }

        .file-status {
          font-size: 16px;
        }

        .remove-file {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          font-size: 16px;
        }

        .remove-file:hover {
          color: #EF4444;
          background: #444;
        }

        .clear-all {
          width: 100%;
          background: #EF4444;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .clear-all:hover {
          background: #DC2626;
        }

        .main-panel {
          background: #2a2a2a;
          border-radius: 12px;
          padding: 20px;
          overflow-y: auto;
        }

        .control-section {
          margin-bottom: 30px;
        }

        .control-section h3 {
          margin: 0 0 15px 0;
          color: #fff;
          font-size: 18px;
        }

        .operation-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .operation-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: #333;
          border: 2px solid #444;
          border-radius: 8px;
          color: #ccc;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .operation-btn:hover {
          background: #3a3a3a;
          border-color: #555;
        }

        .operation-btn.active {
          background: #8B5CF6;
          border-color: #8B5CF6;
          color: white;
        }

        .btn-icon {
          font-size: 20px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-group label {
          font-weight: 500;
          color: #ccc;
          font-size: 14px;
        }

        .setting-select {
          background: #333;
          border: 1px solid #444;
          border-radius: 6px;
          padding: 10px;
          color: #fff;
          font-family: 'Ubuntu', monospace;
        }

        .setting-info {
          font-size: 12px;
          color: #888;
        }

        .password-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .password-input {
          background: #333;
          border: 1px solid #444;
          border-radius: 6px;
          padding: 12px;
          color: #fff;
          font-family: 'Ubuntu', monospace;
        }

        .password-input:focus {
          outline: none;
          border-color: #8B5CF6;
        }

        .key-actions {
          margin-top: 15px;
        }

        .generate-key-btn {
          background: #8B5CF6;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .generate-key-btn:hover {
          background: #7C3AED;
        }

        .generated-key {
          margin-top: 10px;
          padding: 10px;
          background: #333;
          border-radius: 6px;
          border: 1px solid #444;
        }

        .generated-key code {
          display: block;
          margin: 5px 0;
          padding: 8px;
          background: #1a1a1a;
          border-radius: 4px;
          font-family: 'Ubuntu Mono', monospace;
          word-break: break-all;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #06B6D4);
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .progress-text {
          font-weight: 500;
          color: #8B5CF6;
          min-width: 40px;
        }

        .progress-info {
          margin: 10px 0 0 0;
          color: #888;
          font-size: 14px;
        }

        .action-section {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #333;
          margin-top: 30px;
        }

        .process-btn {
          background: #10B981;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .process-btn:hover:not(:disabled) {
          background: #059669;
        }

        .process-btn:disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .process-btn.processing {
          background: #F59E0B;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        .security-info {
          margin-top: 20px;
          padding: 15px;
          background: #333;
          border-radius: 8px;
          text-align: left;
        }

        .security-info p {
          margin: 5px 0;
          font-size: 14px;
          color: #ccc;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #333;
          border-radius: 6px;
        }

        .history-icon {
          font-size: 16px;
        }

        .history-details {
          flex: 1;
        }

        .history-filename {
          font-weight: 500;
          color: #fff;
        }

        .history-info {
          font-size: 11px;
          color: #888;
        }

        .history-status.success {
          color: #10B981;
        }

        /* Estilos Móvil */
        .mobile-container {
          width: 100%;
          height: 100%;
          background: #1a1a1a;
          color: #e0e0e0;
          font-family: 'Ubuntu', monospace;
          overflow: auto;
          padding: 10px;
        }

        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #333;
          margin-bottom: 15px;
        }

        .mobile-app-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-app-title .app-icon {
          font-size: 32px;
        }

        .mobile-app-title h1 {
          margin: 0;
          color: #fff;
          font-size: 18px;
        }

        .mobile-app-title p {
          margin: 2px 0 0 0;
          color: #888;
          font-size: 12px;
        }

        .mobile-status {
          padding: 8px;
          border-radius: 50%;
          font-size: 16px;
        }

        .mobile-status.ready {
          background: #10B981;
        }

        .mobile-status.processing {
          background: #F59E0B;
        }

        .mobile-tabs {
          display: flex;
          background: #2a2a2a;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 15px;
        }

        .mobile-tab {
          flex: 1;
          padding: 12px 8px;
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          border-radius: 6px;
          font-size: 12px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .mobile-tab.active {
          background: #8B5CF6;
          color: white;
        }

        .mobile-content {
          height: calc(100vh - 180px);
          overflow-y: auto;
        }

        .mobile-tab-content {
          padding: 10px 0;
        }

        .mobile-drop-zone {
          border: 2px dashed #555;
          border-radius: 8px;
          padding: 30px 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 15px;
        }

        .mobile-drop-zone:active {
          border-color: #8B5CF6;
          background: #333;
        }

        .mobile-file-list {
          margin-top: 15px;
        }

        .mobile-file-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .mobile-file-header h3 {
          margin: 0;
          color: #fff;
          font-size: 16px;
        }

        .mobile-clear-all {
          background: #EF4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .mobile-file-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #333;
          border-radius: 8px;
          margin-bottom: 8px;
          border-left: 4px solid transparent;
        }

        .mobile-file-item.processing {
          border-left-color: #F59E0B;
        }

        .mobile-file-item.completed {
          border-left-color: #10B981;
        }

        .mobile-file-icon {
          font-size: 18px;
        }

        .mobile-file-info {
          flex: 1;
          min-width: 0;
        }

        .mobile-file-name {
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
        }

        .mobile-file-details {
          font-size: 11px;
          color: #888;
        }

        .mobile-file-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-file-status {
          font-size: 14px;
        }

        .mobile-remove-file {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          font-size: 16px;
        }

        .mobile-section {
          background: #2a2a2a;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .mobile-section h3 {
          margin: 0 0 12px 0;
          color: #fff;
          font-size: 16px;
        }

        .mobile-operation-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .mobile-operation-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #333;
          border: 2px solid #444;
          border-radius: 6px;
          color: #ccc;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          justify-content: center;
        }

        .mobile-operation-btn.active {
          background: #8B5CF6;
          border-color: #8B5CF6;
          color: white;
        }

        .mobile-settings {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-setting {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mobile-setting label {
          font-weight: 500;
          color: #ccc;
          font-size: 14px;
        }

        .mobile-setting-select {
          background: #333;
          border: 1px solid #444;
          border-radius: 6px;
          padding: 10px;
          color: #fff;
          font-family: 'Ubuntu', monospace;
          font-size: 14px;
        }

        .mobile-password-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-password-input {
          background: #333;
          border: 1px solid #444;
          border-radius: 6px;
          padding: 12px;
          color: #fff;
          font-family: 'Ubuntu', monospace;
          font-size: 14px;
        }

        .mobile-generate-key {
          background: #8B5CF6;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 8px;
          width: 100%;
        }

        .mobile-generated-key {
          margin-top: 10px;
          padding: 10px;
          background: #333;
          border-radius: 6px;
          border: 1px solid #444;
          font-size: 12px;
        }

        .mobile-generated-key code {
          display: block;
          margin: 5px 0;
          padding: 8px;
          background: #1a1a1a;
          border-radius: 4px;
          font-family: 'Ubuntu Mono', monospace;
          word-break: break-all;
          font-size: 11px;
        }

        .mobile-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-progress-bar {
          flex: 1;
          height: 6px;
          background: #333;
          border-radius: 3px;
          overflow: hidden;
        }

        .mobile-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #06B6D4);
          transition: width 0.3s ease;
          border-radius: 3px;
        }

        .mobile-progress-text {
          font-weight: 500;
          color: #8B5CF6;
          min-width: 35px;
          font-size: 14px;
        }

        .mobile-action-section {
          text-align: center;
          padding: 20px 0;
        }

        .mobile-process-btn {
          background: #10B981;
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          justify-content: center;
        }

        .mobile-process-btn:active:not(:disabled) {
          background: #059669;
        }

        .mobile-process-btn:disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .mobile-process-btn.processing {
          background: #F59E0B;
        }

        .mobile-spinner {
          animation: spin 1s linear infinite;
        }

        .mobile-no-history {
          text-align: center;
          padding: 40px 20px;
          color: #888;
        }

        .no-history-icon {
          font-size: 48px;
          margin-bottom: 10px;
          opacity: 0.5;
        }

        .mobile-history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #333;
          border-radius: 6px;
        }

        .mobile-history-icon {
          font-size: 16px;
        }

        .mobile-history-details {
          flex: 1;
        }

        .mobile-history-filename {
          font-weight: 500;
          color: #fff;
          font-size: 14px;
        }

        .mobile-history-info {
          font-size: 12px;
          color: #888;
        }

        .mobile-history-time {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }

        .mobile-history-status.success {
          color: #10B981;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Media Queries */
        @media (max-width: 768px) {
          .file-encryption {
            display: none;
          }
          .mobile-container {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .mobile-container {
            display: none;
          }
          .file-encryption {
            display: block;
          }
          
          .main-content {
            height: calc(100vh - 150px);
          }
        }

        @media (max-width: 480px) {
          .mobile-container {
            padding: 8px;
          }
          
          .mobile-header {
            padding: 12px 0;
          }
          
          .mobile-app-title h1 {
            font-size: 16px;
          }
          
          .mobile-tab {
            padding: 10px 6px;
            font-size: 11px;
          }
          
          .mobile-section {
            padding: 12px;
          }
        }
      `}</style>

      {/* Render condicional basado en el tamaño de pantalla */}
      {typeof window !== 'undefined' && window.innerWidth <= 768 ? renderMobileView() : renderDesktopView()}
    </>
  );
};

export default FileEncryption;