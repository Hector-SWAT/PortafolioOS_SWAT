// components/apps/AboutMe.jsx
import { useState } from 'react';

const AboutMe = ({ windowId }) => {
  const [activeSection, setActiveSection] = useState('personal');

  const personalInfo = {
    name: "Hector Delfino Hernandez Perez",
    title: "Cybersecurity Enthusiast & Full Stack Developer",
    location: "México",
    email: "hectorhernadez51@gmail.com",
    age: "22 años",
    bio: "I'm a 22-year-old cybersecurity enthusiast from Mexico, transitioning from software development to the exciting world of information security. My programming background in Java and Python gives me a unique perspective on secure coding practices and vulnerability analysis."
  };

  const experience = [
    {
      period: "2025 - Presente",
      role: "Ethical Hacking & Security Research",
      company: "Self-Study & Platforms",
      description: "Desarrollo de habilidades en ethical hacking a través de TryHackMe y HackTheBox. Estudio para certificaciones de seguridad y práctica de penetration testing."
    },
    {
      period: "2022 - 2023",
      role: "Full Stack Developer",
      company: "Proyectos Personales",
      description: "Desarrollo de aplicaciones web seguras y herramientas de automatización con enfoque en prácticas de coding seguro."
    },
    {
      period: "2021 - 2022",
      role: "Software Developer",
      company: "Base de Programación",
      description: "Desarrollo de fundamentos sólidos en programación con Java y Python, sentando las bases para la transición a cybersecurity."
    }
  ];

  const education = [
    {
      degree: "Transición a Cybersecurity",
      institution: "Self-Taught & Online Platforms",
      year: "2025 - Presente"
    },
    {
      degree: "Desarrollo de Software",
      institution: "Auto-didacta",
      year: "2021 - 2023"
    }
  ];

  const funFacts = [
    "🚀 Empecé a programar creando scripts para videojuegos",
    "🐧 Usuario de Linux desde 2019",
    "🔒 Me encanta participar en CTFs (Capture The Flag)",
    "🎵 Programo escuchando lofi hip hop",
    "☕ Adicto al café mientras debuggeo código",
    "📚 Leo 2-3 libros técnicos al mes",
    "🛡️ Mi objetivo: Hacer el mundo digital más seguro",
    "💡 Siempre aprendiendo nuevas técnicas de seguridad"
  ];

  const currentFocus = [
    "🔍 Developing ethical hacking skills through TryHackMe and HackTheBox",
    "📚 Studying for security certifications (Security+, OSCP)",
    "🌐 Learning about network security, penetration testing, and digital forensics",
    "💻 Practicing secure coding principles in all my projects",
    "🛠️ Building security tools and contributing to open-source projects"
  ];

  const careerGoals = [
    "Contribuir a herramientas de seguridad open-source",
    "Participar en programas de bug bounty",
    "Unirme a equipos de cybersecurity profesionales",
    "Colaborar en proyectos de investigación de seguridad",
    "Ayudar a organizaciones a construir sistemas más seguros"
  ];

  return (
    <div className="about-me-app">
      <div className="about-header">
        <div className="profile-section">
          <div className="avatar">🛡️</div>
          <div className="profile-info">
            <h1>{personalInfo.name}</h1>
            <h2>{personalInfo.title}</h2>
            <p>📍 {personalInfo.location} | 🎂 {personalInfo.age}</p>
            <p>📧 {personalInfo.email}</p>
          </div>
        </div>
        <p className="bio">{personalInfo.bio}</p>
      </div>

      <div className="about-nav">
        <button 
          className={`nav-button ${activeSection === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveSection('personal')}
        >
          👤 Mi Historia
        </button>
        <button 
          className={`nav-button ${activeSection === 'focus' ? 'active' : ''}`}
          onClick={() => setActiveSection('focus')}
        >
          🎯 Enfoque Actual
        </button>
        <button 
          className={`nav-button ${activeSection === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveSection('goals')}
        >
          🚀 Metas
        </button>
        <button 
          className={`nav-button ${activeSection === 'fun' ? 'active' : ''}`}
          onClick={() => setActiveSection('fun')}
        >
          🎯 Curiosidades
        </button>
      </div>

      <div className="about-content">
        {activeSection === 'personal' && (
          <div className="personal-section">
            <h3>👤 Mi Transición a Cybersecurity</h3>
            
            <div className="transition-story">
              <div className="story-point">
                <h4>💻 Orígenes en Desarrollo</h4>
                <p>
                  Comencé mi viaje en el mundo de la tecnología como desarrollador de software, 
                  trabajando con Java y Python. Esta base me dio una comprensión profunda de 
                  cómo se construyen los sistemas, lo que ahora aplico para entender cómo 
                  pueden ser vulnerables.
                </p>
              </div>
              
              <div className="story-point">
                <h4>🛡️ Descubrimiento de la Seguridad</h4>
                <p>
                  Mi interés por la cybersecurity nació al darme cuenta de que podía usar 
                  mis habilidades de programación no solo para construir, sino también para 
                  proteger. La idea de identificar vulnerabilidades antes que los atacantes 
                  me resultó fascinante.
                </p>
              </div>
              
              <div className="story-point">
                <h4>🎯 Enfoque Dual</h4>
                <p>
                  Mi experiencia en desarrollo me da una ventaja única: entiendo los sistemas 
                  desde la perspectiva tanto del constructor como del evaluador de seguridad. 
                  Esto me permite identificar vulnerabilidades que otros podrían pasar por alto.
                </p>
              </div>
            </div>

            <div className="experience-section">
              <h4>📈 Mi Trayectoria</h4>
              <div className="timeline">
                {experience.map((exp, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h5>{exp.role}</h5>
                        <span className="period">{exp.period}</span>
                      </div>
                      <p className="company">{exp.company}</p>
                      <p className="description">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'focus' && (
          <div className="focus-section">
            <h3>🎯 Enfoque Actual</h3>
            
            <div className="current-focus">
              <h4>🚀 Lo Que Estoy Aprendiendo Ahora</h4>
              <div className="focus-list">
                {currentFocus.map((item, index) => (
                  <div key={index} className="focus-item">
                    <span className="focus-icon">🎯</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="skills-breakdown">
              <h4>🛠️ Mi Enfoque Técnico</h4>
              <div className="skills-cards">
                <div className="skill-card">
                  <h5>🔒 Seguridad Ofensiva</h5>
                  <ul>
                    <li>Penetration Testing</li>
                    <li>Vulnerability Assessment</li>
                    <li>Red Team Exercises</li>
                    <li>Exploit Development</li>
                  </ul>
                </div>
                <div className="skill-card">
                  <h5>🛡️ Seguridad Defensiva</h5>
                  <ul>
                    <li>Secure Coding Practices</li>
                    <li>Security Architecture</li>
                    <li>Incident Response</li>
                    <li>Security Monitoring</li>
                  </ul>
                </div>
                <div className="skill-card">
                  <h5>🔧 Desarrollo Seguro</h5>
                  <ul>
                    <li>OWASP Top 10</li>
                    <li>Security SDLC</li>
                    <li>Code Review</li>
                    <li>Security Testing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="philosophy">
              <h4>💡 Mi Filosofía de Seguridad</h4>
              <div className="philosophy-content">
                <p>
                  "Creo que la seguridad debe integrarse desde el inicio del desarrollo, 
                  no agregarse al final. Mi experiencia en desarrollo me permite entender 
                  que la seguridad y la funcionalidad deben coexistir, no competir."
                </p>
                <div className="quote">
                  <blockquote>
                    "That which doesn't kill me makes me stronger."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'goals' && (
          <div className="goals-section">
            <h3>🚀 Metas y Aspiraciones</h3>
            
            <div className="goals-grid">
              {careerGoals.map((goal, index) => (
                <div key={index} className="goal-card">
                  <div className="goal-icon">🎯</div>
                  <h4>{goal}</h4>
                </div>
              ))}
            </div>

            <div className="opportunities">
              <h4>💼 Buscando Oportunidades Para</h4>
              <div className="opportunity-list">
                <div className="opportunity-item">
                  <h5>🔓 Bug Bounty Programs</h5>
                  <p>Aplicar mis habilidades en entornos reales y contribuir a mejorar la seguridad de diversas plataformas.</p>
                </div>
                <div className="opportunity-item">
                  <h5>🤝 Equipos de Cybersecurity</h5>
                  <p>Unirme a equipos donde pueda aprender de profesionales experimentados y crecer mis habilidades.</p>
                </div>
                <div className="opportunity-item">
                  <h5>🔧 Open Source Security Tools</h5>
                  <p>Contribuir al desarrollo de herramientas que ayuden a la comunidad de seguridad.</p>
                </div>
                <div className="opportunity-item">
                  <h5>🔬 Proyectos de Investigación</h5>
                  <p>Colaborar en investigaciones que avancen el campo de la seguridad informática.</p>
                </div>
              </div>
            </div>

            <div className="call-to-action">
              <h4>💬 ¡Hablemos!</h4>
              <p>
                Siempre estoy feliz de conectarme con otros profesionales de seguridad y aprendices. 
                Juntos podemos hacer el mundo digital más seguro.
              </p>
              <div className="cta-buttons">
                <a href="mailto:hectorhernadez51@gmail.com" className="cta-button">
                  📧 Enviar Email
                </a>
                <a href="https://github.com/Hector-SWAT" target="_blank" rel="noopener noreferrer" className="cta-button">
                  💼 Ver GitHub
                </a>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'fun' && (
          <div className="fun-section">
            <h3>🎯 Datos Curiosos</h3>
            <div className="fun-facts">
              {funFacts.map((fact, index) => (
                <div key={index} className="fun-fact">
                  {fact}
                </div>
              ))}
            </div>
            
            <div className="personal-interests">
              <h4>❤️ Mis Pasiones</h4>
              <div className="interests-grid">
                <div className="interest-item">
                  <span className="interest-icon">🔒</span>
                  <div>
                    <h5>Ethical Hacking</h5>
                    <p>Encontrar vulnerabilidades antes que los atacantes</p>
                  </div>
                </div>
                <div className="interest-item">
                  <span className="interest-icon">🐍</span>
                  <div>
                    <h5>Python & Automation</h5>
                    <p>Crear herramientas que automaticen tareas de seguridad</p>
                  </div>
                </div>
                <div className="interest-item">
                  <span className="interest-icon">🌐</span>
                  <div>
                    <h5>Web Security</h5>
                    <p>Proteger aplicaciones web contra amenazas modernas</p>
                  </div>
                </div>
                <div className="interest-item">
                  <span className="interest-icon">📚</span>
                  <div>
                    <h5>Aprendizaje Continuo</h5>
                    <p>Siempre explorando nuevas tecnologías y técnicas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .about-me-app {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0c0c0d 0%, #1a1a2e 50%, #16213e 100%);
          color: #e0e0e0;
          padding: var(--space-lg);
          overflow-y: auto;
          font-family: 'JetBrains Mono', monospace;
        }

        .about-header {
          text-align: center;
          margin-bottom: var(--space-xl);
          border-bottom: 2px solid var(--parrot-green);
          padding-bottom: var(--space-lg);
        }

        .profile-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
        }

        .avatar {
          font-size: 4rem;
          background: rgba(30, 138, 74, 0.2);
          border: 3px solid var(--parrot-green);
          border-radius: 50%;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-info h1 {
          color: var(--primary-cyan);
          font-size: var(--text-2xl);
          margin-bottom: var(--space-xs);
        }

        .profile-info h2 {
          color: var(--text-secondary);
          font-size: var(--text-lg);
          margin-bottom: var(--space-sm);
        }

        .profile-info p {
          margin: var(--space-xs) 0;
          color: var(--text-secondary);
        }

        .bio {
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
          color: var(--text-primary);
          font-size: var(--text-base);
          text-align: center;
        }

        .about-nav {
          display: flex;
          gap: var(--space-xs);
          margin-bottom: var(--space-xl);
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'JetBrains Mono', monospace;
          font-size: var(--text-sm);
          flex: 1;
          min-width: 140px;
          max-width: 200px;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .nav-button.active {
          background: var(--parrot-green);
          color: white;
          border-color: var(--parrot-green);
        }

        .about-content {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Personal Section */
        .transition-story {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .story-point {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .story-point h4 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-sm);
        }

        .story-point p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Timeline Styles */
        .timeline {
          position: relative;
          padding-left: var(--space-xl);
        }

        .timeline:before {
          content: '';
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--parrot-green);
        }

        .timeline-item {
          position: relative;
          margin-bottom: var(--space-lg);
        }

        .timeline-marker {
          position: absolute;
          left: -28px;
          top: 0;
          width: 16px;
          height: 16px;
          background: var(--parrot-green);
          border-radius: 50%;
          border: 3px solid #0c0c0d;
        }

        .timeline-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-sm);
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .timeline-header h5 {
          color: var(--primary-cyan);
          margin: 0;
          font-size: var(--text-lg);
        }

        .period {
          background: rgba(30, 138, 74, 0.2);
          color: var(--parrot-green);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: bold;
        }

        .company {
          color: var(--text-secondary);
          font-weight: bold;
          margin-bottom: var(--space-sm);
        }

        .description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Focus Section */
        .focus-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-xl);
        }

        .focus-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          padding: var(--space-md);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--parrot-green);
        }

        .focus-icon {
          font-size: var(--text-lg);
          flex-shrink: 0;
        }

        .skills-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .skill-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .skill-card h5 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-md);
          text-align: center;
        }

        .skill-card ul {
          list-style: none;
          padding: 0;
        }

        .skill-card li {
          padding: var(--space-xs) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
        }

        .skill-card li:before {
          content: "▸ ";
          color: var(--parrot-green);
          margin-right: var(--space-xs);
        }

        .philosophy {
          background: rgba(30, 138, 74, 0.1);
          border: 1px solid rgba(30, 138, 74, 0.3);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .philosophy h4 {
          color: var(--parrot-green);
          margin-bottom: var(--space-md);
          text-align: center;
        }

        .philosophy-content p {
          color: var(--text-secondary);
          line-height: 1.6;
          text-align: center;
          margin-bottom: var(--space-lg);
        }

        .quote {
          text-align: center;
        }

        .quote blockquote {
          margin: 0;
          font-style: italic;
          color: var(--text-secondary);
          border-left: 3px solid var(--parrot-green);
          padding-left: var(--space-md);
        }

        /* Goals Section */
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .goal-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          text-align: center;
          transition: all 0.3s ease;
        }

        .goal-card:hover {
          transform: translateY(-4px);
          border-color: var(--parrot-green);
        }

        .goal-icon {
          font-size: 2rem;
          margin-bottom: var(--space-md);
        }

        .goal-card h4 {
          color: var(--primary-cyan);
          margin: 0;
          font-size: var(--text-base);
        }

        .opportunity-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .opportunity-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .opportunity-item h5 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-sm);
        }

        .opportunity-item p {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .call-to-action {
          background: rgba(30, 138, 74, 0.1);
          border: 1px solid rgba(30, 138, 74, 0.3);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          text-align: center;
        }

        .call-to-action h4 {
          color: var(--parrot-green);
          margin-bottom: var(--space-md);
        }

        .call-to-action p {
          color: var(--text-secondary);
          margin-bottom: var(--space-lg);
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          background: var(--parrot-green);
          color: white;
          text-decoration: none;
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          transition: all 0.3s ease;
          border: 1px solid var(--parrot-green);
        }

        .cta-button:hover {
          background: transparent;
          color: var(--parrot-green);
          transform: translateY(-2px);
        }

        /* Fun Section */
        .fun-facts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .fun-fact {
          background: rgba(30, 138, 74, 0.1);
          border: 1px solid rgba(30, 138, 74, 0.3);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          text-align: center;
          font-size: var(--text-sm);
          transition: all 0.3s ease;
        }

        .fun-fact:hover {
          background: rgba(30, 138, 74, 0.2);
          transform: scale(1.05);
        }

        .interests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-lg);
        }

        .interest-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .interest-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .interest-item h5 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-xs);
        }

        .interest-item p {
          color: var(--text-secondary);
          margin: 0;
          font-size: var(--text-sm);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .about-me-app {
            padding: var(--space-md);
          }

          .profile-section {
            flex-direction: column;
            text-align: center;
          }

          .about-nav {
            flex-direction: column;
          }

          .nav-button {
            max-width: none;
          }

          .timeline-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .skills-cards,
          .goals-grid,
          .opportunity-list,
          .fun-facts,
          .interests-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutMe;