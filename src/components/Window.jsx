import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente individual de ventana
const Window = ({ 
  id, 
  title, 
  app, 
  children, 
  onClose, 
  onMinimize, 
  onMaximize, 
  isActive, 
  onFocus,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 }
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const windowRef = useRef(null);
  const titleBarRef = useRef(null);

  // Iconos por aplicación
  const getAppIcon = (appName) => {
    const icons = {
      about: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
        </svg>
      ),
      projects: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
        </svg>
      ),
      terminal: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
        </svg>
      ),
      games: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
        </svg>
      )
    };
    return icons[appName] || icons.terminal;
  };

  // Manejar arrastre
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    setIsDragging(true);
    onFocus(id);
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = Math.max(0, e.clientY - dragOffset.y);
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Maximizar/restaurar
  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
      setPosition(initialPosition);
      setSize(initialSize);
    } else {
      setIsMaximized(true);
      setPosition({ x: 0, y: 0 });
      setSize({ 
        width: window.innerWidth, 
        height: window.innerHeight - 64 // Altura menos taskbar
      });
    }
    onMaximize && onMaximize(id);
  };

  // Minimizar
  const handleMinimize = () => {
    setIsMinimized(true);
    onMinimize && onMinimize(id);
  };

  // Cerrar
  const handleClose = () => {
    onClose(id);
  };

  // Event listeners para arrastre
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Doble clic en title bar para maximizar
  const handleTitleBarDoubleClick = () => {
    handleMaximize();
  };

  if (isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      className={`absolute bg-gray-800 rounded-lg shadow-2xl border border-gray-600 overflow-hidden ${
        isActive ? 'z-40 ring-2 ring-cyan-500/50' : 'z-30'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        className="window-titlebar bg-gray-900 h-10 flex items-center justify-between px-4 border-b border-gray-600 cursor-grab"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleTitleBarDoubleClick}
      >
        <div className="flex items-center space-x-2">
          <div className="text-cyan-400">
            {getAppIcon(app)}
          </div>
          <span className="text-white text-sm font-mono font-semibold">
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="window-controls flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="w-6 h-6 bg-yellow-500 hover:bg-yellow-400 rounded-full flex items-center justify-center transition-colors"
            title="Minimize"
          >
            <div className="w-2 h-0.5 bg-yellow-900"></div>
          </button>
          
          <button
            onClick={handleMaximize}
            className="w-6 h-6 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <div className="w-2 h-2 border border-green-900 bg-transparent"></div>
            ) : (
              <div className="w-2 h-2 border border-green-900"></div>
            )}
          </button>
          
          <button
            onClick={handleClose}
            className="w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition-colors"
            title="Close"
          >
            <svg className="w-2 h-2 text-red-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="window-content h-full overflow-auto bg-gray-800">
        {children}
      </div>

      {/* Resize handles */}
      {!isMaximized && (
        <>
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize">
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-600"></div>
          </div>
        </>
      )}
    </motion.div>
  );
};

// Manager de ventanas
const WindowManager = () => {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [nextId, setNextId] = useState(1);

  // Contenido de las aplicaciones
  const getAppContent = (app) => {
    switch (app) {
      case 'about':
        return (
          <div className="p-6 text-white font-mono">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  R
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-green-400">Radnaabazar Bulgan</h1>
                  <p className="text-gray-400">Software Engineer & Full-Stack Developer</p>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h2 className="text-lg text-cyan-400 mb-3">$ whoami</h2>
                <p className="text-gray-300 leading-relaxed">
                  Soy un desarrollador apasionado por crear experiencias web únicas. 
                  Especializado en tecnologías modernas como React, Node.js, y Astro. 
                  Me encanta experimentar con interfaces creativas y soluciones innovadoras.
                </p>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h2 className="text-lg text-cyan-400 mb-3">$ skills --list</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-green-400">• JavaScript/TypeScript</div>
                  <div className="text-green-400">• React.js/Next.js</div>
                  <div className="text-green-400">• Node.js/Express</div>
                  <div className="text-green-400">• Python/Django</div>
                  <div className="text-green-400">• PostgreSQL/MongoDB</div>
                  <div className="text-green-400">• Docker/AWS</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="p-6 text-white font-mono">
            <h1 className="text-xl text-green-400 mb-4">$ ls -la ~/projects/</h1>
            <div className="space-y-3">
              <div className="bg-gray-900 p-4 rounded border-l-4 border-blue-500">
                <h3 className="text-cyan-400 font-semibold">E-commerce Platform</h3>
                <p className="text-gray-400 text-sm mt-1">Full-stack application with React + Node.js</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">React</span>
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">Node.js</span>
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded border-l-4 border-purple-500">
                <h3 className="text-cyan-400 font-semibold">Portfolio OS</h3>
                <p className="text-gray-400 text-sm mt-1">Linux-style desktop portfolio with Astro</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-orange-600 px-2 py-1 rounded">Astro</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">React</span>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded border-l-4 border-green-500">
                <h3 className="text-cyan-400 font-semibold">Task Management API</h3>
                <p className="text-gray-400 text-sm mt-1">RESTful API with authentication and real-time updates</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">Python</span>
                  <span className="text-xs bg-red-600 px-2 py-1 rounded">Django</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'terminal':
        return <TerminalApp />;

      case 'games':
        return (
          <div className="p-6 text-white font-mono">
            <h1 className="text-xl text-purple-400 mb-4">🎮 Game Center</h1>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gray-900 hover:bg-gray-700 p-6 rounded-lg border-2 border-purple-500 transition-colors">
                <h3 className="text-cyan-400 text-lg mb-2">Snake Game</h3>
                <p className="text-gray-400 text-sm">Classic snake game in the terminal</p>
              </button>
              
              <button className="bg-gray-900 hover:bg-gray-700 p-6 rounded-lg border-2 border-green-500 transition-colors">
                <h3 className="text-cyan-400 text-lg mb-2">Memory Game</h3>
                <p className="text-gray-400 text-sm">Test your memory skills</p>
              </button>
              
              <button className="bg-gray-900 hover:bg-gray-700 p-6 rounded-lg border-2 border-blue-500 transition-colors">
                <h3 className="text-cyan-400 text-lg mb-2">Tic Tac Toe</h3>
                <p className="text-gray-400 text-sm">Classic 3x3 game</p>
              </button>
              
              <button className="bg-gray-900 hover:bg-gray-700 p-6 rounded-lg border-2 border-yellow-500 transition-colors">
                <h3 className="text-cyan-400 text-lg mb-2">Calculator</h3>
                <p className="text-gray-400 text-sm">Basic calculator app</p>
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 text-white font-mono">
            <h1 className="text-xl text-red-400">Application not found</h1>
            <p className="text-gray-400">The requested application could not be loaded.</p>
          </div>
        );
    }
  };

  // Abrir nueva ventana
  const openWindow = (app) => {
    const appTitles = {
      about: 'About Me - radnaabazar@portfolio',
      projects: 'Projects - File Manager',
      terminal: 'Terminal - bash',
      games: 'Game Center - Entertainment'
    };

    const newWindow = {
      id: nextId,
      app,
      title: appTitles[app] || `App - ${app}`,
      isActive: true
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(nextId);
    setNextId(prev => prev + 1);
  };

  // Cerrar ventana
  const closeWindow = (windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      const remainingWindows = windows.filter(w => w.id !== windowId);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  // Enfocar ventana
  const focusWindow = (windowId) => {
    setActiveWindowId(windowId);
  };

  // Minimizar ventana
  const minimizeWindow = (windowId) => {
    // La lógica de minimizar se maneja en el componente Window
    console.log(`Minimizing window ${windowId}`);
  };

  // Escuchar eventos de apertura de apps
  useEffect(() => {
    const handleOpenApp = (event) => {
      openWindow(event.detail.app);
    };

    window.addEventListener('openApp', handleOpenApp);
    return () => window.removeEventListener('openApp', handleOpenApp);
  }, [nextId]);

  return (
    <div className="window-manager">
      <AnimatePresence>
        {windows.map(window => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            app={window.app}
            isActive={activeWindowId === window.id}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPosition={{ 
              x: 50 + (window.id * 30), 
              y: 50 + (window.id * 30) 
            }}
          >
            {getAppContent(window.app)}
          </Window>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Terminal simulada
const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'radnaabazar@portfolio:~$ welcome',
    'Welcome to Portfolio Terminal v1.0',
    'Type "help" for available commands.',
    ''
  ]);

  const commands = {
    help: () => [
      'Available commands:',
      '  help      - Show this help message',
      '  about     - Display information about me',
      '  skills    - List my technical skills', 
      '  projects  - Show my recent projects',
      '  contact   - Display contact information',
      '  clear     - Clear terminal screen',
      '  whoami    - Display current user',
      '  date      - Show current date and time',
      '  echo      - Echo input text'
    ],
    about: () => [
      'Radnaabazar Bulgan - Software Engineer',
      'Passionate full-stack developer with expertise in modern web technologies.',
      'I love creating unique user experiences and solving complex problems.'
    ],
    skills: () => [
      'Technical Skills:',
      '  Frontend: React, Vue, Astro, TypeScript, Tailwind CSS',
      '  Backend: Node.js, Python, Django, Express',
      '  Database: PostgreSQL, MongoDB, Redis',
      '  DevOps: Docker, AWS, CI/CD',
      '  Other: Git, Linux, API Design'
    ],
    projects: () => [
      'Recent Projects:',
      '  1. Portfolio OS - Interactive Linux-style portfolio',
      '  2. E-commerce Platform - Full-stack shopping application', 
      '  3. Task Management API - RESTful API with real-time features',
      '  4. Weather Dashboard - React app with weather data visualization'
    ],
    contact: () => [
      'Contact Information:',
      '  Email: radnaabazar@example.com',
      '  GitHub: github.com/radnaabazar',
      '  LinkedIn: linkedin.com/in/radnaabazar',
      '  Portfolio: radnaabazar.dev'
    ],
    whoami: () => ['radnaabazar'],
    date: () => [new Date().toString()],
    clear: () => 'CLEAR'
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const [command, ...args] = trimmedCmd.split(' ');

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    if (command === 'echo') {
      const output = args.join(' ') || '';
      setHistory(prev => [...prev, `radnaabazar@portfolio:~$ ${cmd}`, output, '']);
      return;
    }

    if (commands[command]) {
      const output = commands[command]();
      setHistory(prev => [...prev, `radnaabazar@portfolio:~$ ${cmd}`, ...output, '']);
    } else if (trimmedCmd) {
      setHistory(prev => [...prev, `radnaabazar@portfolio:~$ ${cmd}`, `bash: ${command}: command not found`, '']);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="terminal-app h-full bg-black p-4 font-mono text-sm text-green-400 overflow-auto">
      <div className="terminal-output space-y-1">
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="terminal-input flex items-center mt-2">
        <span className="text-green-400 mr-2">radnaabazar@portfolio:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-green-400 outline-none"
          autoFocus
        />
      </form>
    </div>
  );
};

export default WindowManager;