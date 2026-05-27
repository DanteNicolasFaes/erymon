import { useState, useEffect, useRef, type FormEvent } from 'react'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
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
      gradient: "from-cyan-400 to-blue-600",
      cta: "Pedir web"
    },
    {
      title: "Diseño UI/UX",
      description: "Interfaces intuitivas y experiencias de usuario memorables que convierten",
      icon: "🎨",
      gradient: "from-purple-400 to-pink-600",
      cta: "Mejorar diseño"
    },
    {
      title: "E-commerce",
      description: "Tiendas online robustas y escalables que maximizan tus ventas",
      icon: "🛒",
      gradient: "from-yellow-400 to-orange-600",
      cta: "Crear tienda"
    },
    {
      title: "Apps Móviles",
      description: "Aplicaciones nativas y multiplataforma que conectan con tus usuarios",
      icon: "📱",
      gradient: "from-indigo-400 to-purple-600",
      cta: "Consultar app"
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    if (!form.reportValidity()) return

    setIsSubmitting(true)
    setSubmitMessage(null)

    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      servicio: String(formData.get('servicio') ?? ''),
      message: String(formData.get('message') ?? '')
    }

    try {
      console.log('Enviando a Formspark', payload)
      const response = await fetch('https://submit-form.com/qRZlVApRu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log('Formspark response status', response.status)

      if (!response.ok) {
        console.error('Formspark error status', response.status)
        console.error('Formspark error statusText', response.statusText)
        console.error('Formspark error body', await response.text())
        throw new Error('Formspark request failed')
      }

      form.reset()
      setSubmitMessage({
        type: 'success',
        text: 'Mensaje enviado correctamente. Te responderemos pronto.'
      })
    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Ocurrió un error al enviar el mensaje. Intentá nuevamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
              Solicitar presupuesto
            </Link>
            <Link
              to="servicios"
              smooth={true}
              className="border-2 border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              Ver Servicios
            </Link>
            <motion.a
              href="https://wa.me/541155053453"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-green-500/40 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500/10 transition-all"
            >
              Hablar por WhatsApp
            </motion.a>
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

          <div className="grid md:grid-cols-2 gap-8">
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
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:border-white/30 transition-all group-hover:transform group-hover:-translate-y-2 flex flex-col">
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
                  <Link
                    to="contacto"
                    smooth={true}
                    duration={500}
                    className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                  >
                    {service.cta}
                  </Link>
                  <div className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-16"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">No sabes que necesita tu negocio?</h3>
                  <p className="text-lg text-gray-300">Te ayudamos a definir la solucion mas simple y efectiva para empezar.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="contacto"
                    smooth={true}
                    duration={500}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    Solicitar diagnostico
                  </Link>
                  <motion.a
                    href="https://wa.me/541155053453"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border border-green-500/40 bg-green-500/10 px-6 py-3 rounded-xl font-semibold text-center hover:bg-green-500/15 transition-all"
                  >
                    Hablar por WhatsApp
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
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

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-16"
          >
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 text-center backdrop-blur-sm">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Tenes una idea o proyecto en mente?</h3>
              <p className="text-lg text-gray-300 mb-8">Contanos que necesitas y te respondemos con una propuesta clara.</p>
              <Link
                to="contacto"
                smooth={true}
                duration={500}
                className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
              >
                Comenzar ahora
              </Link>
            </div>
          </motion.div>

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
              Contanos qué necesitás <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">construir</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Te respondemos con una propuesta clara para tu web, tienda online, app o sistema a medida.
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <input 
                      type="text"
                      name="name"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email"
                      name="email"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Servicio de interés</label>
                  <select
                    name="servicio"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="" className="bg-[#0A0A1E]">Selecciona un servicio</option>
                    {services.map((s, i) => (
                      <option key={i} value={s.title} className="bg-[#0A0A1E]">{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensaje</label>
                  <textarea 
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </motion.button>
                {submitMessage && (
                  <p
                    className={`text-sm text-center ${
                      submitMessage.type === 'success' ? 'text-cyan-300' : 'text-red-300'
                    }`}
                  >
                    {submitMessage.text}
                  </p>
                )}
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
                      <div className="font-semibold">1155053453</div>
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

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4">Síguenos</h3>
                <div className="flex">
                  <motion.a
                    href="https://www.instagram.com/erymonserviciodigital/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full cursor-pointer flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-600/20 transition-all"
                    aria-label="Instagram"
                  >
                    <span className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <span className="text-left">
                      <span className="block font-semibold text-white">Instagram</span>
                      <span className="block text-sm text-gray-400">Seguinos en redes</span>
                    </span>
                  </motion.a>
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

      <motion.a
        href="https://wa.me/541155053453"
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1fb857] transition-colors"
        aria-label="Enviar WhatsApp"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-7 w-7 fill-current"
        >
          <path d="M12 2a10 10 0 0 0-8.66 15l-1.05 3.83 3.92-1.03A10 10 0 1 0 12 2Zm0 18.18a8.12 8.12 0 0 1-4.13-1.13l-.28-.17-2.33.61.62-2.27-.18-.29A8.18 8.18 0 1 1 12 20.18Zm4.49-6.12c-.25-.13-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.17-.28.19-.53.06a6.68 6.68 0 0 1-1.96-1.21 7.43 7.43 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.28.37-.42.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.02 2.6.12.16 1.76 2.69 4.26 3.77.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
      </motion.a>
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













