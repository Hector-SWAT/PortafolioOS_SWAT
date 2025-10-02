import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLine, setCurrentLine] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // ASCII Art de SWAT
  const swatAscii = [
    "███████╗██╗    ██╗ █████╗ ████████╗",
    "██╔════╝██║    ██║██╔══██╗╚══██╔══╝",
    "███████╗██║ █╗ ██║███████║   ██║   ",
    "╚════██║██║███╗██║██╔══██║   ██║   ",
    "███████║╚███╔███╔╝██║  ██║   ██║   ",
    "╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ",
    "                                    ",
    "   S W A T   S Y S T E M S         ",
    "    Cybersecurity & Development     "
  ];

  // Mensajes de boot estilo Arch Linux con notificaciones de error
  const bootMessages = [
    "[    0.000000] Initializing SWAT Security Kernel...",
    "[    0.250000] Loading security modules...",
    "[    0.500000] Mounting root filesystem...",
    "[    0.750000] Starting system services...",
    "[    1.000000] Loading cryptographic modules...",
    "[    1.250000] ERROR: Failed to load module 'crypto_sec' - Security risk detected",
    "[    1.500000] Initializing network stack...",
    "[    1.750000] WARNING: Unsecured network interface detected",
    "[    2.000000] Starting SWAT Security Daemon...",
    "[    2.250000] Loading penetration testing tools...",
    "[    2.500000] ERROR: Kernel security violation at address 0x7f8a1c",
    "[    2.750000] Initializing desktop environment...",
    "[    3.000000] SWAT Security System Ready.",
    "[    3.250000] Starting getty on tty1..."
  ];

  // Comandos disponibles
  const commands = {
    'startx': () => {
      setTimeout(() => {
        if (typeof document !== "undefined") {
          document.body.classList.add("loaded");
        }
        setLoading(false);
      }, 1000);
      return "Starting X Window System...\nLoading SWAT Desktop Environment...";
    },
    'help': () => {
      return "Available commands:\nstartx - Launch desktop environment\nhelp - Show this help\nwhoami - Show current user\nuname -a - System information\nclear - Clear terminal\nnotifications - Show system alerts";
    },
    'whoami': () => {
      return "root@swat-system";
    },
    'uname': () => {
      return "SWAT-Linux swat-system 6.1.0-SWAT #1 SMP PREEMPT_DYNAMIC SWAT Security Edition x86_64 GNU/Linux";
    },
    'clear': () => {
      setOutput([]);
      return "";
    },
    'notifications': () => {
      return "System Notifications:\n" + notifications.map(n => 
        `[${n.type.toUpperCase()}] ${n.message}`
      ).join('\n');
    },
    'neofetch': () => {
      return swatAscii.join('\n') + "\n\nOS: SWAT Security Linux\nHost: SWAT Virtual Machine\nKernel: 6.1.0-SWAT\nShell: bash 5.2.15\nTerminal: tty1\nCPU: Intel i7-12700K (16) @ 4.90GHz\nMemory: 8192MiB / 15984MiB";
    }
  };

  // Generar notificaciones del sistema
  useEffect(() => {
    const systemNotifications = [
      {
        id: 1,
        type: 'error',
        title: 'Security Alert',
        message: 'Kernel security update required - Cryptographic module failure',
        time: new Date().toLocaleTimeString(),
        urgent: true
      },
      {
        id: 2,
        type: 'warning',
        title: 'System Update',
        message: '5 security updates available - Patch immediately',
        time: new Date().toLocaleTimeString(),
        urgent: false
      },
      {
        id: 3,
        type: 'error',
        title: 'Network Error',
        message: 'Failed to connect to SWAT security repository',
        time: new Date().toLocaleTimeString(),
        urgent: true
      }
    ];
    
    setNotifications(systemNotifications);
  }, []);

  // Efecto para el boot sequence
  useEffect(() => {
    if (currentStep < bootMessages.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 250);
      return () => clearTimeout(timer);
    } else if (currentStep === bootMessages.length) {
      // Mostrar ASCII art después del boot
      const asciiTimer = setTimeout(() => {
        setBootComplete(true);
        setShowPrompt(true);
        setOutput([
          "SWAT Security System - Version 2.3.1",
          "Kernel 6.1.0-SWAT on an x86_64 (tty1)",
          "",
          "⚠️  System alerts detected - Type 'notifications' to view",
          "",
          "swat-system login: root (automatic login)",
          "Last login: Fri Dec 1 14:30:25 on tty1",
          ""
        ]);
      }, 500);
      return () => clearTimeout(asciiTimer);
    }
  }, [currentStep]);

  // Efecto para el cursor - CORREGIDO
  useEffect(() => {
    if (showPrompt) {
      const inputElement = document.getElementById('terminal-input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [showPrompt, command]);

  // Manejar entrada de comandos
  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = command.trim();
      setOutput(prev => [...prev, `root@swat-system:~# ${cmd}`]);
      
      if (commands[cmd]) {
        const result = commands[cmd]();
        if (result) {
          setOutput(prev => [...prev, ...result.split('\n')]);
        }
      } else if (cmd) {
        setOutput(prev => [...prev, `bash: ${cmd}: command not found`]);
      }
      
      setCommand('');
      setOutput(prev => [...prev, '']);
    }
  };

  // Manejar cambios en el input para actualizar posición del cursor
  const handleInputChange = (e) => {
    setCommand(e.target.value);
    setCursorPosition(e.target.value.length);
  };

  // Calcular posición del cursor
  const calculateCursorPosition = () => {
    const promptText = "root@swat-system:~# ";
    const inputText = command;
    const totalLength = promptText.length + inputText.length;
    
    // Calcular posición basada en caracteres (aproximadamente 8px por carácter en JetBrains Mono 14px)
    return totalLength * 8.2; // Ajuste fino para la fuente
  };

  if (loading) {
    return (
      <motion.div
        id="loader-screen"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000000',
          color: '#00ff00',
          zIndex: 9999,
          fontFamily: '"JetBrains Mono", "Courier New", monospace',
          overflow: 'hidden',
          padding: '1rem'
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Boot Messages */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: bootComplete ? '60%' : 0,
          overflow: 'hidden',
          padding: '1rem'
        }}>
          {bootMessages.slice(0, currentStep).map((message, index) => {
            const isError = message.includes('ERROR:');
            const isWarning = message.includes('WARNING:');
            
            return (
              <motion.p
                key={index}
                style={{
                  fontSize: '14px',
                  color: isError ? '#ff4444' : isWarning ? '#ffaa00' : '#00ff00',
                  margin: '2px 0',
                  fontFamily: '"JetBrains Mono", monospace',
                  opacity: 0.9,
                  fontWeight: isError ? 'bold' : 'normal'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                {message}
              </motion.p>
            );
          })}
        </div>

        {/* Notificaciones del sistema estilo Arch Linux */}
        {bootComplete && notifications.length > 0 && (
          <motion.div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid #ff4444',
              borderRadius: '4px',
              padding: '0.5rem',
              maxWidth: '300px',
              zIndex: 10000
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
              borderBottom: '1px solid #ff4444',
              paddingBottom: '0.25rem'
            }}>
              <span style={{ color: '#ff4444', fontWeight: 'bold', marginRight: '0.5rem' }}>⚠️</span>
              <span style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem' }}>
                System Alerts
              </span>
            </div>
            {notifications.slice(0, 2).map(notification => (
              <div key={notification.id} style={{
                marginBottom: '0.25rem',
                padding: '0.25rem',
                background: notification.urgent ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 170, 0, 0.1)',
                borderRadius: '2px',
                borderLeft: `3px solid ${notification.urgent ? '#ff4444' : '#ffaa00'}`
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  color: notification.urgent ? '#ff4444' : '#ffaa00',
                  fontWeight: 'bold'
                }}>
                  {notification.title}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#cccccc'
                }}>
                  {notification.message}
                </div>
              </div>
            ))}
            {notifications.length > 2 && (
              <div style={{
                fontSize: '0.7rem',
                color: '#888888',
                textAlign: 'center',
                marginTop: '0.25rem'
              }}>
                +{notifications.length - 2} more alerts
              </div>
            )}
          </motion.div>
        )}

        {/* ASCII Art y Terminal */}
        {bootComplete && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'rgba(0, 20, 0, 0.3)',
              borderTop: '1px solid #00ff00',
              padding: '1rem',
              overflowY: 'auto'
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* ASCII Art Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1rem',
              color: '#00ff00',
              fontFamily: '"JetBrains Mono", monospace'
            }}>
              {swatAscii.map((line, index) => (
                <div key={index} style={{ 
                  fontSize: index === swatAscii.length - 2 ? '16px' : '12px',
                  fontWeight: index >= swatAscii.length - 2 ? 'bold' : 'normal',
                  color: index >= swatAscii.length - 2 ? '#00ff00' : '#00ff00',
                  margin: '1px 0'
                }}>
                  {line}
                </div>
              ))}
            </div>

            {/* Terminal Output */}
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              color: '#00ff00',
              lineHeight: '1.4',
              position: 'relative'
            }}>
              {output.map((line, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>
                  {line}
                </div>
              ))}
              
              {/* Input Line - CORREGIDO */}
              {showPrompt && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <span style={{ color: '#00ff00' }}>root@swat-system:~# </span>
                  <input
                    id="terminal-input"
                    type="text"
                    value={command}
                    onChange={handleInputChange}
                    onKeyPress={handleCommand}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#00ff00',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '14px',
                      flex: 1,
                      marginLeft: '0px',
                      caretColor: 'transparent', // Ocultar cursor nativo
                      position: 'relative',
                      zIndex: 2
                    }}
                    autoFocus
                  />
                  
                  {/* Cursor personalizado - POSICIÓN CORREGIDA */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: `${calculateCursorPosition()}px`,
                      width: '8px',
                      height: '16px',
                      background: '#00ff00',
                      zIndex: 1
                    }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
              )}
            </div>

            {/* Help Text */}
            {showPrompt && output.length <= 8 && (
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  color: '#008800',
                  fontSize: '12px',
                  fontFamily: '"JetBrains Mono", monospace'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                Type 'startx' to begin
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}