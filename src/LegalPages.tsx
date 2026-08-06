import React, { useEffect } from 'react';
import { updateSeo } from './utils/seo';

const SEO_BY_PAGE: Record<string, { title: string; description: string }> = {
  '/privacidad': {
    title: 'Política de Privacidad | ERYMON',
    description: 'Conocé cómo ERYMON recopila, usa y protege tus datos personales al visitar el sitio o usar nuestros servicios.'
  },
  '/terminos': {
    title: 'Términos y Condiciones | ERYMON',
    description: 'Términos y condiciones de uso de los servicios de desarrollo web, e-commerce y software a medida de ERYMON.'
  },
  '/cookies': {
    title: 'Política de Cookies | ERYMON',
    description: 'Información sobre el uso de cookies esenciales en el sitio web de ERYMON.'
  }
};

export default function LegalPages({ page }: { page: string }) {
  useEffect(() => {
    const seo = SEO_BY_PAGE[page]
    if (seo) {
      updateSeo({ title: seo.title, description: seo.description, path: page })
    }
  }, [page])

  const content = (() => {
    switch (page) {
      case '/privacidad':
        return (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Política de Privacidad</h1>
            <div className="space-y-6 text-gray-300">
              <p><strong>Responsable:</strong> Dante Faes (en adelante, ERYMON).</p>
              <p><strong>Email de contacto:</strong> hola@erymon.com</p>
              <p><strong>Ubicación:</strong> Buenos Aires, Argentina.</p>
              <p>En ERYMON respetamos tu derecho a la privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuestro sitio web o usas nuestros servicios.</p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Uso del Formulario de Contacto</h2>
              <p>Nuestro formulario de contacto utiliza <span className="font-bold text-white">Formspark</span> para la gestión de mensajes. Al enviar un mensaje a través del formulario, los datos que nos proporciones (como tu nombre y correo electrónico) serán procesados temporalmente a través de Formspark para que nos lleguen de manera segura. No usamos estos datos para enviar spam ni los vendemos a terceros.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Derechos de los Usuarios</h2>
              <p>Como usuario, tenés derecho a solicitar el acceso, rectificación o eliminación de tus datos personales poniéndote en contacto con nosotros a hola@erymon.com.</p>
            </div>
          </>
        );
      case '/terminos':
        return (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Términos y Condiciones</h1>
            <div className="space-y-6 text-gray-300">
              <p>Estos términos regulan el uso de los servicios prestados por <strong>ERYMON</strong>. Al utilizar nuestro sitio o contratar nuestros servicios, aceptás estos términos en su totalidad.</p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Servicios</h2>
              <p>ERYMON, a cargo de Dante Faes, ofrece servicios de desarrollo web, e-commerce, diseño UI/UX y consultoría tech. Nos reservamos el derecho de modificar la oferta de servicios en cualquier momento.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contacto Legal</h2>
              <p>Cualquier reclamo o disputa deberá enviarse a hola@erymon.com. Nuestra sede de operaciones se encuentra en Buenos Aires, Argentina y nos regimos por la legislación vigente del lugar.</p>
            </div>
          </>
        );
      case '/cookies':
        return (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Política de Cookies</h1>
            <div className="space-y-6 text-gray-300">
              <p>Este sitio web operado por <strong>ERYMON</strong> (Dante Faes) en Buenos Aires, Argentina, utiliza cookies esenciales para funcionar correctamente.</p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">¿Qué son las Cookies?</h2>
              <p>Las cookies son pequeños archivos de texto que se guardan en tu dispositivo para recordar información sobre tu visita. Nuestro sitio web solo utiliza herramientas necesarias para proveer una buena experiencia funcional.</p>
              <p>No utilizamos cookies de seguimiento de terceros sin tu consentimiento. Para cualquier consulta sobre privacidad podés contactarnos a hola@erymon.com.</p>
            </div>
          </>
        );
      default:
        return <h1 className="text-center text-4xl mt-32 text-white">404 - Página no encontrada</h1>;
    }
  })();

  return (
    <div className="min-h-screen bg-[#0A0A1E] text-white">
      <nav className="border-b border-white/10 bg-[#0A0A1E]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="font-black text-2xl tracking-tighter">
            <span className="inline-block bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">ERY</span>
            <span className="inline-block text-white bg-[#0A0A1E] px-2 -ml-2 -my-2 skew-x-[-10deg] inline-flex items-center border-2 border-white/20">MON</span>
          </div>
          <a href="/" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
            ← Volver al Inicio
          </a>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        {content}
      </main>

      <footer className="border-t border-white/10 py-12 text-center text-gray-400 text-sm mt-16">
        <div className="max-w-4xl mx-auto px-6">
          © {new Date().getFullYear()} ERYMON. Todos los derechos reservados. | Dante Faes - Buenos Aires, Argentina.
        </div>
      </footer>
    </div>
  );
}
