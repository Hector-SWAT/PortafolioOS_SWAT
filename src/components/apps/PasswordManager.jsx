import { useState, useEffect, useRef } from 'react';

const PasswordManager = ({ windowId }) => {
  const [passwords, setPasswords] = useState([
    { id: 1, service: 'Gmail', username: 'usuario@gmail.com', password: '********', url: 'https://gmail.com', category: 'Email' },
    { id: 2, service: 'GitHub', username: 'dev_user', password: '********', url: 'https://github.com', category: 'Desarrollo' },
    { id: 3, service: 'Facebook', username: 'mi_usuario', password: '********', url: 'https://facebook.com', category: 'Redes Sociales' },
    { id: 4, service: 'Banco', username: '123456789', password: '********', url: 'https://mibanco.com', category: 'Finanzas' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState({
    service: '',
    username: '',
    password: '',
    url: '',
    category: 'General'
  });
  const [masterPassword, setMasterPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('high');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [categories, setCategories] = useState(['General', 'Email', 'Desarrollo', 'Redes Sociales', 'Finanzas', 'Trabajo', 'Personal']);

  const searchInputRef = useRef(null);

  // Efecto para calcular la fortaleza de la contraseña
  useEffect(() => {
    if (newPassword.password) {
      calculatePasswordStrength(newPassword.password);
    } else {
      setPasswordStrength(0);
    }
  }, [newPassword.password]);

  // Simular desbloqueo con contraseña maestra
  useEffect(() => {
    // En una aplicación real, esto verificaría contra una base de datos cifrada
    const timer = setTimeout(() => {
      setIsUnlocked(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Longitud
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Complejidad
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    
    // Variedad de caracteres
    const uniqueChars = new Set(password).size;
    strength += Math.min(20, uniqueChars * 2);
    
    setPasswordStrength(Math.min(100, strength));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return '#EF4444';
    if (passwordStrength < 70) return '#F59E0B';
    return '#10B981';
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return 'Débil';
    if (passwordStrength < 70) return 'Media';
    return 'Fuerte';
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || password.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddPassword = () => {
    if (!newPassword.service || !newPassword.username || !newPassword.password) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    const newEntry = {
      id: passwords.length > 0 ? Math.max(...passwords.map(p => p.id)) + 1 : 1,
      ...newPassword
    };

    setPasswords([...passwords, newEntry]);
    setIsAdding(false);
    setNewPassword({
      service: '',
      username: '',
      password: '',
      url: '',
      category: 'General'
    });
  };

  const handleEditPassword = () => {
    if (!currentPassword.service || !currentPassword.username || !currentPassword.password) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    setPasswords(passwords.map(p => p.id === currentPassword.id ? currentPassword : p));
    setIsEditing(false);
    setCurrentPassword(null);
  };

  const handleDeletePassword = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta contraseña?')) {
      setPasswords(passwords.filter(p => p.id !== id));
    }
  };

  const startEdit = (password) => {
    setCurrentPassword({...password});
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentPassword(null);
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewPassword({
      service: '',
      username: '',
      password: '',
      url: '',
      category: 'General'
    });
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let generatedPassword = "";
    
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    if (isEditing) {
      setCurrentPassword({...currentPassword, password: generatedPassword});
    } else {
      setNewPassword({...newPassword, password: generatedPassword});
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Mostrar notificación de éxito
      alert('Copiado al portapapeles');
    });
  };

  const getSecurityIcon = () => {
    switch(securityLevel) {
      case 'high': return '🛡️';
      case 'medium': return '🔒';
      case 'low': return '⚠️';
      default: return '🔒';
    }
  };

  // Función segura para manejar clicks
  const handleSafeClick = (callback, e) => {
    if (e && e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
    callback();
  };

  if (!isUnlocked) {
    return (
      <div className="password-manager">
        <div className="unlock-screen">
          <div className="unlock-container">
            <div className="security-icon">🔐</div>
            <h1>Password Manager</h1>
            <p>Ingresa tu contraseña maestra para acceder</p>
            <div className="password-input-container">
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Contraseña maestra"
                className="password-input"
              />
              <button 
                className="unlock-button"
                onClick={(e) => handleSafeClick(() => setIsUnlocked(true), e)}
                onTouchEnd={(e) => handleSafeClick(() => setIsUnlocked(true), e)}
              >
                Desbloquear
              </button>
            </div>
            <div className="security-info">
              <p>🔒 Tus contraseñas están cifradas localmente</p>
              <p>🌐 Nunca se envían a través de la red</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          .password-manager {
            width: 100%;
            height: 100%;
            background: #1a1a1a;
            display: flex;
            flex-direction: column;
            font-family: 'Ubuntu', sans-serif;
          }

          .unlock-screen {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
          }

          .unlock-container {
            background: #2a2a2a;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            max-width: 400px;
            width: 90%;
          }

          .security-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }

          .unlock-container h1 {
            color: white;
            margin-bottom: 10px;
            font-size: 28px;
          }

          .unlock-container p {
            color: #ccc;
            margin-bottom: 30px;
          }

          .password-input-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
          }

          .password-input {
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #444;
            background: #1a1a1a;
            color: white;
            font-size: 16px;
            outline: none;
          }

          .password-input:focus {
            border-color: #8B5CF6;
          }

          .unlock-button {
            background: #8B5CF6;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          .unlock-button:hover {
            background: #7C3AED;
          }

          .security-info {
            display: flex;
            flex-direction: column;
            gap: 10px;
            color: #888;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="password-manager">
      {/* Barra de herramientas superior */}
      <div className="pm-toolbar">
        <div className="toolbar-left">
          <button 
            className="toolbar-button"
            onClick={(e) => handleSafeClick(() => setIsAdding(true), e)}
            onTouchEnd={(e) => handleSafeClick(() => setIsAdding(true), e)}
            title="Agregar Contraseña"
          >
            ➕
          </button>
          <button className="toolbar-button" title="Exportar">📤</button>
          <button className="toolbar-button" title="Importar">📥</button>
        </div>
        
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar contraseñas..."
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-button"
              onClick={(e) => handleSafeClick(() => setSearchTerm(''), e)}
              onTouchEnd={(e) => handleSafeClick(() => setSearchTerm(''), e)}
            >
              ✕
            </button>
          )}
        </div>

        <div className="toolbar-right">
          <button className="toolbar-button" title="Configuración">⚙️</button>
          <button 
            className="toolbar-button"
            onClick={(e) => handleSafeClick(() => setIsUnlocked(false), e)}
            onTouchEnd={(e) => handleSafeClick(() => setIsUnlocked(false), e)}
            title="Bloquear"
          >
            🔒
          </button>
        </div>
      </div>

      {/* Barra de estado */}
      <div className="pm-status-bar">
        <div className="status-left">
          <div className="security-indicator">
            <span className="security-icon">{getSecurityIcon()}</span>
            <span className="status-text">
              {passwords.length} contraseñas almacenadas
            </span>
          </div>
        </div>
        
        <div className="status-right">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="pm-content">
        {filteredPasswords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h2>No se encontraron contraseñas</h2>
            <p>{searchTerm || selectedCategory !== 'all' 
              ? 'Intenta ajustar tus criterios de búsqueda' 
              : 'Comienza agregando tu primera contraseña'}</p>
            <button 
              className="add-first-button"
              onClick={(e) => handleSafeClick(() => setIsAdding(true), e)}
              onTouchEnd={(e) => handleSafeClick(() => setIsAdding(true), e)}
            >
              Agregar Contraseña
            </button>
          </div>
        ) : (
          <div className="passwords-grid">
            {filteredPasswords.map(password => (
              <div key={password.id} className="password-card">
                <div className="card-header">
                  <div className="service-info">
                    <div className="service-icon">🌐</div>
                    <div className="service-details">
                      <h3 className="service-name">{password.service}</h3>
                      <p className="service-category">{password.category}</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="action-button"
                      onClick={(e) => handleSafeClick(() => startEdit(password), e)}
                      onTouchEnd={(e) => handleSafeClick(() => startEdit(password), e)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-button"
                      onClick={(e) => handleSafeClick(() => handleDeletePassword(password.id), e)}
                      onTouchEnd={(e) => handleSafeClick(() => handleDeletePassword(password.id), e)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="credential-field">
                    <label>Usuario:</label>
                    <div className="field-value">
                      <span>{password.username}</span>
                      <button 
                        className="copy-button"
                        onClick={(e) => handleSafeClick(() => copyToClipboard(password.username), e)}
                        onTouchEnd={(e) => handleSafeClick(() => copyToClipboard(password.username), e)}
                        title="Copiar usuario"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  
                  <div className="credential-field">
                    <label>Contraseña:</label>
                    <div className="field-value">
                      <span>{showPassword ? password.password : '•'.repeat(8)}</span>
                      <div className="password-actions">
                        <button 
                          className="copy-button"
                          onClick={(e) => handleSafeClick(() => copyToClipboard(password.password), e)}
                          onTouchEnd={(e) => handleSafeClick(() => copyToClipboard(password.password), e)}
                          title="Copiar contraseña"
                        >
                          📋
                        </button>
                        <button 
                          className="toggle-button"
                          onClick={(e) => handleSafeClick(() => setShowPassword(!showPassword), e)}
                          onTouchEnd={(e) => handleSafeClick(() => setShowPassword(!showPassword), e)}
                          title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {password.url && (
                    <div className="credential-field">
                      <label>URL:</label>
                      <div className="field-value">
                        <a href={password.url} target="_blank" rel="noopener noreferrer" className="url-link">
                          {password.url}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar contraseña */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Agregar Nueva Contraseña</h2>
            
            <div className="form-group">
              <label>Servicio *</label>
              <input
                type="text"
                value={newPassword.service}
                onChange={(e) => setNewPassword({...newPassword, service: e.target.value})}
                placeholder="Ej: Gmail, GitHub, etc."
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Nombre de usuario *</label>
              <input
                type="text"
                value={newPassword.username}
                onChange={(e) => setNewPassword({...newPassword, username: e.target.value})}
                placeholder="Tu nombre de usuario"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña *</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                  placeholder="Ingresa la contraseña"
                  className="form-input"
                />
                <button 
                  className="password-toggle"
                  onClick={(e) => handleSafeClick(() => setShowPassword(!showPassword), e)}
                  onTouchEnd={(e) => handleSafeClick(() => setShowPassword(!showPassword), e)}
                  type="button"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <button 
                  className="generate-button"
                  onClick={(e) => handleSafeClick(generatePassword, e)}
                  onTouchEnd={(e) => handleSafeClick(generatePassword, e)}
                  type="button"
                >
                  🎲
                </button>
              </div>
              
              {newPassword.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${passwordStrength}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                  <div className="strength-label">
                    Fortaleza: <span style={{ color: getStrengthColor() }}>{getStrengthLabel()}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>URL (opcional)</label>
              <input
                type="text"
                value={newPassword.url}
                onChange={(e) => setNewPassword({...newPassword, url: e.target.value})}
                placeholder="https://ejemplo.com"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={newPassword.category}
                onChange={(e) => setNewPassword({...newPassword, category: e.target.value})}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={(e) => handleSafeClick(cancelAdd, e)}
                onTouchEnd={(e) => handleSafeClick(cancelAdd, e)}
              >
                Cancelar
              </button>
              <button 
                className="save-button"
                onClick={(e) => handleSafeClick(handleAddPassword, e)}
                onTouchEnd={(e) => handleSafeClick(handleAddPassword, e)}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar contraseña */}
      {isEditing && currentPassword && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Contraseña</h2>
            
            <div className="form-group">
              <label>Servicio *</label>
              <input
                type="text"
                value={currentPassword.service}
                onChange={(e) => setCurrentPassword({...currentPassword, service: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Nombre de usuario *</label>
              <input
                type="text"
                value={currentPassword.username}
                onChange={(e) => setCurrentPassword({...currentPassword, username: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña *</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword.password}
                  onChange={(e) => setCurrentPassword({...currentPassword, password: e.target.value})}
                  className="form-input"
                />
                <button 
                  className="password-toggle"
                  onClick={(e) => handleSafeClick(() => setShowPassword(!showPassword), e)}
                  onTouchEnd={(e) => handleSafeClick(() => setShowPassword(!showPassword), e)}
                  type="button"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <button 
                  className="generate-button"
                  onClick={(e) => handleSafeClick(generatePassword, e)}
                  onTouchEnd={(e) => handleSafeClick(generatePassword, e)}
                  type="button"
                >
                  🎲
                </button>
              </div>
              
              {currentPassword.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${passwordStrength}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                  <div className="strength-label">
                    Fortaleza: <span style={{ color: getStrengthColor() }}>{getStrengthLabel()}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>URL (opcional)</label>
              <input
                type="text"
                value={currentPassword.url}
                onChange={(e) => setCurrentPassword({...currentPassword, url: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={currentPassword.category}
                onChange={(e) => setCurrentPassword({...currentPassword, category: e.target.value})}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={(e) => handleSafeClick(cancelEdit, e)}
                onTouchEnd={(e) => handleSafeClick(cancelEdit, e)}
              >
                Cancelar
              </button>
              <button 
                className="save-button"
                onClick={(e) => handleSafeClick(handleEditPassword, e)}
                onTouchEnd={(e) => handleSafeClick(handleEditPassword, e)}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .password-manager {
          width: 100%;
          height: 100%;
          background: #f0f0f0;
          display: flex;
          flex-direction: column;
          font-family: 'Ubuntu', sans-serif;
        }

        .pm-toolbar {
          display: flex;
          align-items: center;
          background: #2c2c2c;
          padding: 8px 12px;
          border-bottom: 1px solid #444;
          gap: 10px;
        }

        .toolbar-left, .toolbar-right {
          display: flex;
          gap: 5px;
        }

        .toolbar-button {
          background: #404040;
          border: none;
          border-radius: 3px;
          color: white;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .toolbar-button:hover {
          background: #505050;
        }

        .search-bar {
          flex: 1;
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border-radius: 20px;
          padding: 4px 12px;
          gap: 8px;
        }

        .search-icon {
          font-size: 14px;
          color: #888;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 13px;
          outline: none;
        }

        .search-input::placeholder {
          color: #888;
        }

        .clear-button {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 12px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .pm-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1a1a1a;
          padding: 6px 12px;
          color: #ccc;
          font-size: 12px;
          border-bottom: 1px solid #333;
        }

        .security-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-filter {
          background: #2a2a2a;
          border: 1px solid #444;
          color: #ccc;
          border-radius: 3px;
          padding: 4px 8px;
          font-size: 12px;
        }

        .pm-content {
          flex: 1;
          padding: 16px;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #666;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h2 {
          margin-bottom: 10px;
          color: #444;
        }

        .empty-state p {
          margin-bottom: 20px;
          max-width: 300px;
        }

        .add-first-button {
          background: #8B5CF6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .add-first-button:hover {
          background: #7C3AED;
        }

        .passwords-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .password-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .password-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .service-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .service-icon {
          font-size: 20px;
        }

        .service-details h3 {
          margin: 0;
          font-size: 16px;
          color: #2c2c2c;
        }

        .service-category {
          margin: 0;
          font-size: 12px;
          color: #6c757d;
        }

        .card-actions {
          display: flex;
          gap: 5px;
        }

        .action-button {
          background: transparent;
          border: none;
          border-radius: 3px;
          padding: 4px 6px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .action-button:hover {
          background: #e9ecef;
        }

        .card-content {
          padding: 16px;
        }

        .credential-field {
          margin-bottom: 12px;
        }

        .credential-field label {
          display: block;
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 4px;
        }

        .field-value {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .field-value span {
          font-family: 'Ubuntu Mono', monospace;
          font-size: 14px;
          color: #2c2c2c;
        }

        .password-actions {
          display: flex;
          gap: 5px;
        }

        .copy-button, .toggle-button {
          background: transparent;
          border: none;
          border-radius: 3px;
          padding: 4px 6px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .copy-button:hover, .toggle-button:hover {
          background: #e9ecef;
        }

        .url-link {
          color: #8B5CF6;
          text-decoration: none;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
          display: inline-block;
        }

        .url-link:hover {
          text-decoration: underline;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2c2c2c;
          font-size: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #2c2c2c;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus, .form-select:focus {
          border-color: #8B5CF6;
        }

        .password-input-group {
          position: relative;
          display: flex;
        }

        .password-input-group .form-input {
          flex: 1;
          padding-right: 80px;
        }

        .password-toggle, .generate-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .password-toggle {
          right: 40px;
        }

        .generate-button {
          right: 10px;
        }

        .password-strength {
          margin-top: 8px;
        }

        .strength-bar {
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .strength-fill {
          height: 100%;
          transition: width 0.3s, background-color 0.3s;
        }

        .strength-label {
          font-size: 12px;
          color: #6c757d;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .cancel-button, .save-button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .cancel-button {
          background: #f8f9fa;
          color: #6c757d;
        }

        .cancel-button:hover {
          background: #e9ecef;
        }

        .save-button {
          background: #8B5CF6;
          color: white;
        }

        .save-button:hover {
          background: #7C3AED;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .pm-toolbar {
            padding: 6px 8px;
          }
          
          .toolbar-button {
            padding: 4px 8px;
            font-size: 12px;
          }
          
          .search-bar {
            padding: 3px 8px;
          }
          
          .pm-content {
            padding: 12px;
          }
          
          .passwords-grid {
            grid-template-columns: 1fr;
          }
          
          .modal {
            padding: 16px;
            margin: 10px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .cancel-button, .save-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .pm-toolbar {
            flex-wrap: wrap;
          }
          
          .toolbar-left, .toolbar-right {
            flex: 1;
          }
          
          .search-bar {
            order: 3;
            flex: 100%;
            margin-top: 8px;
          }
          
          .field-value {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .password-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default PasswordManager;