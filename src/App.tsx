import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-scroll'
import LegalPages from './LegalPages'

function App() {
  const path = window.location.pathname
  if (path === '/privacidad' || path === '/terminos' || path === '/cookies') {
    return <LegalPages page={path} />
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredService, setHoveredService] = useState<number | null>(null)
  const { scrollY } = useScroll()
  
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300])
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0])
  const scaleHero = useTransform(scrollY, [0, 500], [1, 0.8])

  // 3D Particle Effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const w = canvas.width = window.innerWidth
    const h = canvas.height = window.innerHeight

    class Particle {
      x: number
      y: number
      z: number
      size: number
      speedX: number
      speedY: number
      speedZ: number
      color: string

      constructor() {
        this.x = Math.random() * w - w / 2
        this.y = Math.random() * h - h / 2
        this.z = Math.random() * 1000
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 2
        this.speedY = (Math.random() - 0.5) * 2
        this.speedZ = Math.random() * 2 + 1
        this.color = ['#00D9FF', '#A855F7', '#F472B6'][Math.floor(Math.random() * 3)]
      }

      update() {
        this.z -= this.speedZ
        if (this.z <= 0) {
          this.z = 1000
          this.x = Math.random() * w - w / 2
          this.y = Math.random() * h - h / 2
        }
      }

      draw() {
        const scale = 1000 / (1000 + this.z)
        const x2d = this.x * scale + w / 2
        const y2d = this.y * scale + h / 2
        const size2d = this.size * scale

        ctx.beginPath()
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = 1 - this.z / 1000
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    const particles = Array.from({ length: 150 }, () => new Particle())

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100 && particles[i].z < 500 && particles[j].z < 500) {
            const scale = 1000 / (1000 + particles[i].z)
            const x1 = particles[i].x * scale + w / 2
            const y1 = particles[i].y * scale + h / 2
            const x2 = particles[j].x * scale + w / 2
            const y2 = particles[j].y * scale + h / 2

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = '#00D9FF'
            ctx.globalAlpha = (1 - distance / 100) * 0.3
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)'
      ctx.fillRect(0, 0, w, h)

      particles.forEach(p => {
        p.update()
        p.draw()
      })
      connectParticles()

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const services = [
    {
      title: "Desarrollo Web",
      description: "Sitios web y aplicaciones web de alto rendimiento con las últimas tecnologías",
      icon: "⚡",
      gradient: "from-cyan-400 to-blue-600"
    },
    {
      title: "Diseño UI/UX",
      description: "Interfaces intuitivas y experiencias de usuario memorables que convierten",
      icon: "🎨",
      gradient: "from-purple-400 to-pink-600"
    },
    {
      title: "Marketing Digital",
      description: "Estrategias integrales para aumentar tu presencia y conversión online",
      icon: "📈",
      gradient: "from-orange-400 to-red-600"
    },
    {
      title: "Consultoría Tech",
      description: "Asesoramiento experto para transformar digitalmente tu negocio",
      icon: "💡",
      gradient: "from-green-400 to-teal-600"
    },
    {
      title: "E-commerce",
      description: "Tiendas online robustas y escalables que maximizan tus ventas",
      icon: "🛒",
      gradient: "from-yellow-400 to-orange-600"
    },
    {
      title: "Apps Móviles",
      description: "Aplicaciones nativas y multiplataforma que conectan con tus usuarios",
      icon: "📱",
      gradient: "from-indigo-400 to-purple-600"
    }
  ]

  const steps = [
    {
      step: "01",
      title: "Descubrimiento",
      description: "Analizamos tu negocio, objetivos y audiencia para crear una estrategia personalizada"
    },
    {
      step: "02",
      title: "Estrategia",
      description: "Diseñamos un roadmap detallado con milestones y entregables claros"
    },
    {
      step: "03",
      title: "Desarrollo",
      description: "Implementamos soluciones con metodologías ágiles y comunicación constante"
    },
    {
      step: "04",
      title: "Lanzamiento",
      description: "Desplegamos tu proyecto y aseguramos una transición impecable"
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A1E] text-white overflow-x-hidden">
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A1E]/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'Inicio', id: 'inicio' },
              { name: 'Servicios', id: 'servicios' },
              { name: 'Cómo Trabajamos', id: 'como-trabajamos' },
              { name: 'Contacto', id: 'contacto' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.id}
                smooth={true}
                duration={500}
                className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-lg font-semibold text-sm"
          >
            Empezar
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center z-10 pt-20">
        <motion.div 
          style={{ y: parallaxY, opacity: opacityHero, scale: scaleHero }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Logo large />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight md:leading-tight lg:leading-tight"
          >
            Desarrollo web, e-commerce
            <br />
            <span className="text-white">y software a medida</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Transformamos ideas en productos digitales funcionales, escalables y pensados para el mundo real.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="contacto"
              smooth={true}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer"
            >
              Comenzar Proyecto
            </Link>
            <Link
              to="servicios"
              smooth={true}
              className="border-2 border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              Ver Servicios
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-cyan-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Nuestros <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Servicios</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluciones integrales para cada necesidad digital de tu empresa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:border-white/30 transition-all group-hover:transform group-hover:-translate-y-2">
                  <motion.div
                    animate={{ 
                      rotate: hoveredService === index ? 360 : 0,
                      scale: hoveredService === index ? 1.2 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl mb-6"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                  <div className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section id="como-trabajamos" className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Cómo <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Trabajamos</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Un proceso probado que garantiza resultados excepcionales
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transform -translate-y-1/2 z-0" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/30"
                    >
                      {step.step}
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              ¿Listo para <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Empezar</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Cuéntanos sobre tu proyecto y creemos algo extraordinario juntos
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Servicio de interés</label>
                  <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors">
                    <option value="" className="bg-[#0A0A1E]">Selecciona un servicio</option>
                    {services.map((s, i) => (
                      <option key={i} value={s.title} className="bg-[#0A0A1E]">{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensaje</label>
                  <textarea 
                    rows={5}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  Enviar Mensaje
                </motion.button>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Al enviar este formulario, aceptás nuestra <a href="/privacidad" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Política de Privacidad</a>.
                </p>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-2xl">
                      📧
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Email</div>
                      <div className="font-semibold">hola@erymon.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                      📱
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Teléfono</div>
                      <div className="font-semibold">+34 900 123 456</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-2xl">
                      📍
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Ubicación</div>
                      <div className="font-semibold">Buenos Aires, Argentina</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Síguenos</h3>
                <div className="flex gap-4">
                  {['𝕏', 'in', '📸', '▶️'].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl hover:bg-gradient-to-br hover:from-cyan-500 hover:to-purple-600 transition-all"
                    >
                      {social}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo small />
            <div className="text-gray-400 text-sm">
              © 2026 ERYMON. Todos los derechos reservados.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/privacidad" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
              <a href="/terminos" className="text-gray-400 hover:text-white transition-colors">Términos</a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Logo({ large = false, small = false }: { large?: boolean; small?: boolean }) {
  const size = large ? 'text-6xl md:text-7xl' : small ? 'text-2xl' : 'text-3xl'
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <div className={`font-black ${size} tracking-tighter`}>
        <span className="inline-block bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          ERY
        </span>
        <span className="inline-block text-white bg-[#0A0A1E] px-2 -ml-2 -my-2 skew-x-[-10deg] inline-flex items-center border-2 border-white/20">
          MON
        </span>
      </div>
      {large && (
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm text-cyan-400 tracking-[0.3em] -mt-2 uppercase"
        >
          Servicios Digitales
        </motion.div>
      )}
    </motion.div>
  )
}

export default App