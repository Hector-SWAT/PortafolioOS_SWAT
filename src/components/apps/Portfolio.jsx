// components/apps/Portfolio.jsx
import { useState } from 'react';

const Portfolio = ({ windowId }) => {
  const [activeTab, setActiveTab] = useState('projects');

  const projects = [
    {
      id: 1,
      name: "Detector Automatizado de Vulnerabilidades Web",
      description: "Herramienta avanzada desarrollada en Python y Bash para la detección y análisis de vulnerabilidades en sitios web, aplicando metodologías OWASP y técnicas de automatización para pruebas de seguridad.",
      technologies: ["Python", "Bash", "OWASP", "Web Security", "Automation"],
      status: "En desarrollo",
      github: "https://github.com/Hector-SWAT/vulnerability-detector",
      demo: "#",
      category: "Cybersecurity"
    },
    {
      id: 2,
      name: "ArchDownloader – Plataforma Segura de Descarga Multiplataforma",
      description: "Aplicación híbrida en Bash y Python que permite la descarga segura y eficiente de archivos, videos, audio e imágenes desde múltiples plataformas. Incluye interfaz gráfica con PyQt6 y mecanismos optimizados.",
      technologies: ["Python", "Bash", "PyQt6", "Multiplatform", "Security"],
      status: "Completado",
      github: "https://github.com/Hector-SWAT/archdownloader",
      demo: "#",
      category: "Software Development"
    },
    {
      id: 3,
      name: "Plataforma Web Segura para Restaurantes – La Chichipinga",
      description: "Desarrollo web completo con HTML, CSS, TypeScript y JavaScript para el restaurante 'La Chichipinga'. Incluye prácticas de seguridad en el frontend, diseño responsivo y optimización UX.",
      technologies: ["HTML5", "CSS3", "TypeScript", "JavaScript", "Web Security"],
      status: "Completado",
      github: "https://github.com/Hector-SWAT/la-chichipinga",
      demo: "#",
      category: "Web Development"
    },
    {
      id: 4,
      name: "SWAT-CAS PowerShell Menu",
      description: "Sistema de Acceso Rápido a Terminal y Consolas de Administración. Menú interactivo para acceder rápidamente a PowerShell, CMD, y herramientas de desarrollo con diferentes configuraciones y permisos.",
      technologies: ["PowerShell", "Windows", "System Administration", "Automation"],
      status: "Completado",
      github: "https://github.com/Hector-SWAT/swat-cas-powershell",
      demo: "#",
      category: "System Tools"
    },
    {
      id: 5,
      name: "Sistema Web para Servicio de Taxis",
      description: "Plataforma web completa para gestión de servicio de taxis con enfoque en seguridad y usabilidad.",
      technologies: ["HTML5", "CSS3", "JavaScript", "Web Security", "Responsive Design"],
      status: "Completado",
      github: "https://github.com/Hector-SWAT/taxi-service-web",
      demo: "#",
      category: "Web Development"
    }
  ];

  const skills = {
    "Cybersecurity": ["Ethical Hacking", "Vulnerability Assessment", "Penetration Testing", "OWASP", "Network Security", "Digital Forensics"],
    "Programming": ["Python", "Java", "JavaScript", "TypeScript", "Bash", "PowerShell"],
    "Web Development": ["HTML5", "CSS3", "React", "Security Practices", "Responsive Design"],
    "Tools & Platforms": ["TryHackMe", "HackTheBox", "Git", "VS Code", "PyCharm", "Wireshark"],
    "Operating Systems": ["Windows", "Linux", "Kali Linux", "Parrot OS", "System Administration"]
  };

  const contactInfo = {
    email: "hectorhernadez51@gmail.com",
    github: "github.com/Hector-SWAT",
    linkedin: "linkedin.com/in/hector-delfino-hernandez-perez",
    location: "México"
  };

  const certifications = [
    "Security+ (En progreso)",
    "OSCP (En preparación)",
    "TryHackMe Learning Paths",
    "HackTheBox Challenges"
  ];

  return (
    <div className="portfolio-app">
      <div className="portfolio-header">
        <h1>🚀 Hector Delfino Hernandez Perez</h1>
        <p>Cybersecurity Enthusiast & Full Stack Developer</p>
        <div className="header-tags">
          <span className="tag">🔒 Ethical Hacking</span>
          <span className="tag">🐍 Python Developer</span>
          <span className="tag">🌐 Web Security</span>
          <span className="tag">⚡ Automation</span>
        </div>
      </div>

      <div className="portfolio-tabs">
        <button 
          className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Proyectos
        </button>
        <button 
          className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          ⚡ Habilidades
        </button>
        <button 
          className={`tab-button ${activeTab === 'certifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('certifications')}
        >
          📜 Certificaciones
        </button>
        <button 
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          📧 Contacto
        </button>
      </div>

      <div className="portfolio-content">
        {activeTab === 'projects' && (
          <div className="projects-section">
            <h2>💼 Proyectos de Seguridad y Desarrollo</h2>
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <div className="project-meta">
                      <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                      <span className="category">{project.category}</span>
                    </div>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="technologies">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-button">
                      <span>📂</span> GitHub
                    </a>
                    {project.demo !== '#' && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="link-button demo">
                        <span>🌐</span> Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-section">
            <h2>⚡ Habilidades Técnicas</h2>
            <div className="skills-grid">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="skill-category">
                  <h3>{category}</h3>
                  <div className="skill-list">
                    {skillList.map(skill => (
                      <span key={skill} className="skill-item">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="security-focus">
              <h3>🎯 Enfoque en Seguridad</h3>
              <div className="focus-items">
                <div className="focus-item">
                  <h4>🔍 Vulnerability Assessment</h4>
                  <p>Identificación y análisis de vulnerabilidades en aplicaciones web y sistemas</p>
                </div>
                <div className="focus-item">
                  <h4>🛡️ Secure Coding</h4>
                  <p>Desarrollo de software con prácticas de codificación segura desde el inicio</p>
                </div>
                <div className="focus-item">
                  <h4>🔒 Penetration Testing</h4>
                  <p>Pruebas de penetración éticas para identificar puntos débiles en sistemas</p>
                </div>
                <div className="focus-item">
                  <h4>🌐 Web Application Security</h4>
                  <p>Protección de aplicaciones web contra amenazas comunes (OWASP Top 10)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="certifications-section">
            <h2>📜 Certificaciones y Educación</h2>
            <div className="certs-grid">
              <div className="cert-category">
                <h3>🎓 En Progreso</h3>
                <div className="cert-list">
                  {certifications.slice(0, 2).map((cert, index) => (
                    <div key={index} className="cert-item in-progress">
                      <span className="cert-icon">📚</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cert-category">
                <h3>🏆 Plataformas de Aprendizaje</h3>
                <div className="cert-list">
                  {certifications.slice(2).map((cert, index) => (
                    <div key={index} className="cert-item completed">
                      <span className="cert-icon">🎯</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="learning-path">
              <h3>🚀 Mi Camino en Cybersecurity</h3>
              <div className="path-steps">
                <div className="path-step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <h4>Desarrollo de Software</h4>
                    <p>Base sólida en programación con Java y Python</p>
                  </div>
                </div>
                <div className="path-step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <h4>Transición a Seguridad</h4>
                    <p>Enfoque en ethical hacking y seguridad ofensiva</p>
                  </div>
                </div>
                <div className="path-step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <h4>Certificaciones Profesionales</h4>
                    <p>Preparación para Security+ y OSCP</p>
                  </div>
                </div>
                <div className="path-step">
                  <span className="step-number">4</span>
                  <div className="step-content">
                    <h4>Contribución a la Comunidad</h4>
                    <p>Desarrollo de herramientas de seguridad open-source</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <h2>📧 Contáctame</h2>
            <div className="contact-info">
              <div className="contact-item">
                <span className="icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>
                    <a href="mailto:hectorhernadez51@gmail.com">
                      hectorhernadez51@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon">💼</span>
                <div>
                  <strong>GitHub</strong>
                  <p>
                    <a href="https://github.com/Hector-SWAT" target="_blank" rel="noopener noreferrer">
                      github.com/Hector-SWAT
                    </a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon">📍</span>
                <div>
                  <strong>Ubicación</strong>
                  <p>México</p>
                </div>
              </div>
            </div>
            
            <div className="contact-cta">
              <h3>💬 ¿Interesado en colaborar?</h3>
              <p>Estoy buscando oportunidades para:</p>
              <ul>
                <li>Contribuir a herramientas de seguridad open-source</li>
                <li>Participar en programas de bug bounty</li>
                <li>Unirme a equipos de cybersecurity</li>
                <li>Colaborar en proyectos de investigación de seguridad</li>
              </ul>
              <div className="quote">
                <blockquote>
                  "That which doesn't kill me makes me stronger."
                </blockquote>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .portfolio-app {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #e0e0e0;
          padding: var(--space-lg);
          overflow-y: auto;
          font-family: 'JetBrains Mono', monospace;
        }

        .portfolio-header {
          text-align: center;
          margin-bottom: var(--space-xl);
          border-bottom: 2px solid var(--parrot-green);
          padding-bottom: var(--space-lg);
        }

        .portfolio-header h1 {
          color: var(--primary-cyan);
          font-size: var(--text-2xl);
          margin-bottom: var(--space-sm);
        }

        .portfolio-header p {
          color: var(--text-secondary);
          font-size: var(--text-base);
          margin-bottom: var(--space-md);
        }

        .header-tags {
          display: flex;
          justify-content: center;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .tag {
          background: rgba(30, 138, 74, 0.2);
          color: var(--parrot-green);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          border: 1px solid rgba(30, 138, 74, 0.3);
        }

        .portfolio-tabs {
          display: flex;
          gap: var(--space-xs);
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
          justify-content: center;
        }

        .tab-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
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

        .tab-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: var(--parrot-green);
          color: white;
          border-color: var(--parrot-green);
          box-shadow: 0 4px 12px rgba(30, 138, 74, 0.4);
        }

        .portfolio-content {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Projects Styles */
        .projects-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .project-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          border-color: var(--parrot-green);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-sm);
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .project-header h3 {
          color: var(--primary-cyan);
          font-size: var(--text-lg);
          margin: 0;
          flex: 1;
        }

        .project-meta {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .status {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: bold;
          text-transform: uppercase;
        }

        .status.en-desarrollo {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border: 1px solid #ffc107;
        }

        .status.completado {
          background: rgba(40, 167, 69, 0.2);
          color: #28a745;
          border: 1px solid #28a745;
        }

        .category {
          background: rgba(108, 117, 125, 0.2);
          color: #6c757d;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          border: 1px solid #6c757d;
        }

        .project-description {
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
          line-height: 1.6;
        }

        .technologies {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          margin-bottom: var(--space-md);
        }

        .tech-tag {
          background: rgba(6, 182, 212, 0.2);
          color: var(--primary-cyan);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .project-links {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .link-button {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          text-decoration: none;
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          transition: all 0.3s ease;
          font-size: var(--text-sm);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .link-button:hover {
          background: var(--parrot-green);
          color: white;
          transform: translateY(-2px);
        }

        /* Skills Styles */
        .skills-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .skill-category {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .skill-category h3 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-md);
          font-size: var(--text-lg);
        }

        .skill-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .skill-item {
          background: rgba(30, 138, 74, 0.2);
          color: var(--parrot-green);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          border: 1px solid rgba(30, 138, 74, 0.3);
          font-size: var(--text-sm);
        }

        .security-focus {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .security-focus h3 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .focus-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-lg);
        }

        .focus-item {
          text-align: center;
          padding: var(--space-md);
        }

        .focus-item h4 {
          color: var(--parrot-green);
          margin-bottom: var(--space-sm);
        }

        .focus-item p {
          color: var(--text-secondary);
          font-size: var(--text-sm);
          line-height: 1.5;
        }

        /* Certifications Styles */
        .certs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .cert-category {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .cert-category h3 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-md);
          text-align: center;
        }

        .cert-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .cert-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm);
          border-radius: var(--radius-md);
        }

        .cert-item.in-progress {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .cert-item.completed {
          background: rgba(40, 167, 69, 0.1);
          border: 1px solid rgba(40, 167, 69, 0.3);
        }

        .cert-icon {
          font-size: var(--text-lg);
        }

        .learning-path {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .learning-path h3 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .path-steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .path-step {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
        }

        .step-number {
          background: var(--parrot-green);
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .step-content h4 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-xs);
        }

        .step-content p {
          color: var(--text-secondary);
          margin: 0;
        }

        /* Contact Styles */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .contact-item .icon {
          font-size: var(--text-xl);
          width: 40px;
          text-align: center;
        }

        .contact-item strong {
          color: var(--primary-cyan);
          display: block;
          margin-bottom: var(--space-xs);
        }

        .contact-item a {
          color: var(--text-primary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-item a:hover {
          color: var(--parrot-green);
        }

        .contact-cta {
          background: rgba(30, 138, 74, 0.1);
          border: 1px solid rgba(30, 138, 74, 0.3);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .contact-cta h3 {
          color: var(--parrot-green);
          margin-bottom: var(--space-md);
        }

        .contact-cta ul {
          list-style: none;
          padding: 0;
          margin-bottom: var(--space-lg);
        }

        .contact-cta li {
          padding: var(--space-xs) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
        }

        .contact-cta li:before {
          content: "🎯 ";
          margin-right: var(--space-xs);
        }

        .quote {
          text-align: center;
          padding: var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
        }

        .quote blockquote {
          margin: 0;
          font-style: italic;
          color: var(--text-secondary);
          border-left: 3px solid var(--parrot-green);
          padding-left: var(--space-md);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .portfolio-app {
            padding: var(--space-md);
          }

          .portfolio-tabs {
            flex-direction: column;
          }

          .tab-button {
            max-width: none;
          }

          .project-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .project-meta {
            width: 100%;
            justify-content: flex-start;
          }

          .contact-item {
            flex-direction: column;
            text-align: center;
            gap: var(--space-sm);
          }

          .focus-items {
            grid-template-columns: 1fr;
          }

          .certs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;