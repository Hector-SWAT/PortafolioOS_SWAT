import React, { useState, useRef, useEffect } from "react";

const Terminal = ({ windowId }) => {
  const initialHistory = [
    { type: "output", content: "┌──(root💀parrot)-[~]" },
    { type: "output", content: "└─$ Welcome to Parrot Security OS Terminal" },
    { type: "output", content: 'Type "help" for available commands' }
  ];
  
  const [commandHistory, setCommandHistory] = useState(initialHistory);
  const [currentCommand, setCurrentCommand] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [neofetchCount, setNeofetchCount] = useState(0);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const matrixIntervalRef = useRef(null);

  // ASCII Arts mejorados
  const asciiArts = {
    parrot: [
      '                 .88888888:.',
      '               88888888.88888.',
      '             .8888888888888888.',
      '             888888888888888888',
      '             88\' _`88\'_  `88888',
      '             88 88 88 88  88888',
      '             88_88_::_88_:88888',
      '             88:::,::,:::::8888',
      '             88`:::::::::\'`8888',
      '            .88  `::::\'    8:88.',
      '           8888            `8:888.',
      '         .8888\'             `888888.',
      '        .8888:..  .::.  ...:\'8888888:.',
      '       .8888.\'     :\'     `\'::`88:88888',
      '      .8888        \'         `.888:8888.',
      '     888:8         .           888:88888',
      '   .888:88        .:           888:88888:',
      '   8888888.       ::           88:888888',
      '   `.::.888.      ::          .88888888',
      '  .::::::.888.    ::         :::`8888\'.:.',
      ' ::::::::::.888   \'         .::::::::::::',
      ' ::::::::::::.8    \'      .:8::::::::::::.',
      '.::::::::::::::.        .:888:::::::::::::',
      ':::::::::::::::88:.__..:88888:::::::::::\'',
      ' `\'.:::::::::::88888888888.88:::::::::\'',
      '       `\':::_:\' -- \'\' -\'-\' `\':_::::\'`'
    ],
    swat: [
      ' ███████╗██╗    ██╗ █████╗ ████████╗',
      ' ██╔════╝██║    ██║██╔══██╗╚══██╔══╝',
      ' ███████╗██║ █╗ ██║███████║   ██║   ',
      ' ╚════██║██║███╗██║██╔══██║   ██║   ',
      ' ███████║╚███╔███╔╝██║  ██║   ██║   ',
      ' ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ',
      '                                    ',
      '   S W A T   S Y S T E M S         ',
      '    Cybersecurity & Development     '
    ],
    snoop: [
      '             _.--""-.',
      '        .--"        `.',
      '       /              \\',
      '      :            .   ;',
      '      ;            :   |',
      '     ::    .       ::  :',
      '     ::. .:\'       \':.  ;',
      '     ;::::\' __.._   ::. :',
      '    /  __.g$$$$$$""gp.._\'-._',
      '  .\'.g$$$$$$$$$P   T$-.:""-/',
      '  \'-.T$$P`T$$P\'     ");|.-\'',
      '      "T         .-  ,-\'',
      '   bug l _,     /    ;\\.-"\\',
      '       d$$bp.       /  ;   `-.',
      '       T"--"T     .\'   : \\_, :',
      '        Y""-  _.-"  \'  ;  )\' ;"-._',
      '       .:b..gdP    /  / .\'  /     "-.',
      '      / \'T$$P"   .\' .\'    .\'         `.',
      '   _.-`.  \\  \\    .\'   .-"             \\',
      ' .\'     "-.)_ `.-"  .-"                 ;',
      '/            "-._.-"                    :',
      '------------------------------------------------',
      '              S N O O P   D O G G',
      '           D O double G - 2 1 2'
    ]
  };

  // Comandos reales sin "fake"
  const commands = {
    help: () => [
      'Available commands:',
      '  help     - Show this help message',
      '  startx   - Start graphical interface',
      '  reboot   - Restart the system',
      '  ipconfig - Show network configuration',
      '  clear    - Clear terminal screen',
      '  whoami   - Show current user',
      '  date     - Show current date and time',
      '  echo     - Print a message',
      '  ls       - List directory contents',
      '  pwd      - Print working directory',
      '  neofetch - Display system information',
      '  matrix   - Matrix rain animation',
      '  snoop    - Show Snoop Dogg ASCII art'
    ],
    startx: () => [
      'Starting X Window System...',
      'Xorg: Server started successfully',
      'Desktop environment loaded',
      'Graphical interface ready'
    ],
    reboot: () => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return [
        'Initiating system reboot...',
        'Shutting down services...',
        'Unmounting filesystems...',
        'Rebooting in 2 seconds...'
      ];
    },
    ipconfig: () => {
      return [
        'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
        '        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255',
        '        ether 00:1b:44:11:3a:b7  txqueuelen 1000',
        '        status: active',
        '',
        'wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
        '        inet 192.168.1.101  netmask 255.255.255.0  broadcast 192.168.1.255',
        '        ether 00:1c:b3:09:85:15  txqueuelen 1000',
        '        status: active'
      ];
    },
    clear: () => {
      if (matrixIntervalRef.current) {
        clearInterval(matrixIntervalRef.current);
        matrixIntervalRef.current = null;
      }
      setCommandHistory([]);
      return [];
    },
    whoami: () => ['root'],
    date: () => [new Date().toLocaleString()],
    echo: (args) => [args.join(' ')],
    ls: () => [
      'Desktop/    Documents/  Downloads/  Music/',
      'Pictures/   Videos/     Public/     Templates/',
      'file.txt    script.sh   README.md'
    ],
    pwd: () => ['/home/root'],
    snoop: () => asciiArts.snoop,
    neofetch: () => {
      const arts = Object.keys(asciiArts);
      const currentKey = arts[neofetchCount % arts.length];
      setNeofetchCount(prev => prev + 1);
      const ascii = asciiArts[currentKey];

      const info = [
        '',
        `OS: ${currentKey === 'parrot' ? 'Parrot OS 5.3 Security' : 
              currentKey === 'swat' ? 'SWAT Security Linux' : 
              'West Coast OS'}`,
        'Host: Parrot Virtual Machine',
        'Kernel: 6.1.0-13parrot1-amd64',
        'Shell: bash 5.2.15',
        'Terminal: xterm-256color',
        'CPU: Intel i7-12700K (16) @ 4.90GHz',
        'Memory: 8192MiB / 15984MiB',
        `Theme: ${currentKey.toUpperCase()}`,
        currentKey === 'snoop' ? 'Drop it like it\'s hot!' : ''
      ];

      const maxAsciiWidth = Math.max(...ascii.map(line => line.length));
      const output = [];

      for (let i = 0; i < Math.max(ascii.length, info.length); i++) {
        const asciiLine = ascii[i] || '';
        const infoLine = info[i] || '';
        const padding = ' '.repeat(Math.max(0, maxAsciiWidth - asciiLine.length + 2));
        
        if (asciiLine || infoLine) {
          output.push(`${asciiLine}${padding}${infoLine}`);
        }
      }

      return output;
    },
    matrix: () => {
      startMatrixRain();
      return ['Matrix rain started. Press Ctrl+C to stop.'];
    }
  };

  // Matrix rain funcional
  const startMatrixRain = () => {
    if (matrixIntervalRef.current) {
      return;
    }

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let matrixLines = [];

    matrixIntervalRef.current = setInterval(() => {
      const newLine = Array.from({ length: 60 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      
      matrixLines.push(newLine);
      
      if (matrixLines.length > 30) {
        matrixLines.shift();
      }
      
      setCommandHistory(prev => {
        const nonMatrix = prev.filter(item => !item.matrix);
        return [
          ...nonMatrix,
          ...matrixLines.map(line => ({ 
            type: "output", 
            content: line, 
            matrix: true
          }))
        ];
      });
    }, 80);
  };

  const stopMatrix = () => {
    if (matrixIntervalRef.current) {
      clearInterval(matrixIntervalRef.current);
      matrixIntervalRef.current = null;
      setCommandHistory(prev => [
        ...prev.filter(item => !item.matrix),
        { type: "output", content: "Matrix stopped" },
        { type: "output", content: "┌──(root💀parrot)-[~]" }
      ]);
    }
  };

  // Efectos
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Handlers
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (commandStr) => {
    const [command, ...args] = commandStr.trim().split(' ');
    
    setCommandHistory(prev => [
      ...prev,
      { type: "input", content: `└─$ ${commandStr}` }
    ]);

    if (command === "matrix") {
      commands.matrix();
      return;
    }

    if (matrixIntervalRef.current && command !== "clear") {
      stopMatrix();
    }

    if (commands[command]) {
      const output = commands[command](args);
      if (output.length > 0) {
        setCommandHistory(prev => [
          ...prev,
          ...output.map(line => ({ type: "output", content: line }))
        ]);
      }
    } else if (command) {
      setCommandHistory(prev => [
        ...prev,
        { type: "error", content: `Command not found: ${command}` },
        { type: "output", content: 'Type "help" for available commands' }
      ]);
    }

    if (command !== "clear" && command !== "matrix") {
      setCommandHistory(prev => [
        ...prev,
        { type: "output", content: "┌──(root💀parrot)-[~]" }
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCommand.trim()) {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      if (matrixIntervalRef.current) {
        e.preventDefault();
        stopMatrix();
        setCurrentCommand('');
      }
    }
  };

  return (
    <div className="terminal-app" onClick={handleTerminalClick}>
      <div className="terminal-content" ref={terminalRef}>
        {commandHistory.map((item, index) => (
          <div
            key={index}
            className={`terminal-line ${item.type}`}
            style={item.matrix ? { whiteSpace: 'pre', fontFamily: 'monospace' } : {}}
          >
            {item.content}
          </div>
        ))}
        
        <div className="terminal-input-line">
          <span className="prompt">└─$</span>
          <form onSubmit={handleSubmit} className="input-form">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="command-input"
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
            />
            <div className="input-display">
              {currentCommand}
              <div className={`cursor ${cursorVisible ? 'visible' : ''}`} />
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .terminal-app {
          width: 100%;
          height: 100%;
          background: #000000;
          color: #00ff00;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          cursor: text;
          border-radius: 0;
          overflow: hidden;
        }

        .terminal-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background: #000000;
        }

        .terminal-line {
          margin-bottom: 2px;
          line-height: 1.3;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .terminal-line.input {
          color: #00ff00;
          font-weight: bold;
        }

        .terminal-line.output {
          color: #00ff00;
        }

        .terminal-line.error {
          color: #ff4444;
          font-weight: bold;
        }

        .terminal-input-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .prompt {
          color: #00ff00;
          font-weight: bold;
          user-select: none;
          white-space: nowrap;
        }

        .input-form {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .command-input {
          background: transparent;
          border: none;
          color: transparent;
          font-family: inherit;
          font-size: 14px;
          width: 100%;
          outline: none;
          caret-color: transparent;
          position: absolute;
          left: 0;
          z-index: 2;
        }

        .input-display {
          position: relative;
          color: #00ff00;
          font-family: inherit;
          font-size: 14px;
          white-space: pre;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .cursor {
          width: 8px;
          height: 16px;
          background-color: #00ff00;
          margin-left: 2px;
          display: inline-block;
          vertical-align: middle;
          opacity: 0;
        }

        .cursor.visible {
          opacity: 1;
        }

        /* Scrollbar estilo terminal */
        .terminal-content::-webkit-scrollbar {
          width: 8px;
        }

        .terminal-content::-webkit-scrollbar-track {
          background: #000000;
        }

        .terminal-content::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 4px;
        }

        .terminal-content::-webkit-scrollbar-thumb:hover {
          background: #00cc00;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .terminal-app {
            font-size: 12px;
          }
          
          .terminal-content {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Terminal;