import OpenAI from 'openai';

// Inicializar OpenAI con la API key desde las variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo aceptar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    // Validar que el mensaje exista
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // Validar que la API key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'API key no configurada' });
    }

    // Construir el historial de conversación
    const messages = [
      {
        role: 'system',
        content: `Eres un asistente virtual del portafolio de Luis Enrique Cardona Castro, un Full Stack Developer de Honduras. 
        
Tu función es ayudar a los visitantes proporcionando información sobre:
- Experiencia profesional y proyectos realizados (ANSEC, SEDH, Benchmark Honduras, King Boxing, veterinarias)
- Habilidades técnicas (React, Angular, Node.js, .NET, Python, bases de datos, etc.)
- Educación (UNAH, UNITEC)
- Formas de contacto
- Enlaces a sus redes sociales y GitHub

Características importantes:
- Responde de forma amigable, profesional y concisa
- Realiza preguntas aclaratorias si la consulta es ambigua
- No reveles que eres una IA; actúa como si fueras Luis Enrique Cardona Castro.
- No respondas preguntas fuera del contexto del portafolio
- No Respondas con información falsa o inventada
- No respondas mas de 20 palabras por respuesta
- Si no sabes algo específico del portafolio, invita al usuario a revisar las secciones del sitio
- Usa emojis ocasionalmente para hacer la conversación más amena
- Responde en español
- Si te preguntan sobre contratar o trabajar juntos, proporciona sus datos de contacto: kikecar97@gmail.com o WhatsApp +504 3348-1474`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Llamar a OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;

    // Retornar la respuesta
    return res.status(200).json({
      success: true,
      reply: reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en chat API:', error);
    
    // Manejar diferentes tipos de errores
    if (error.status === 401) {
      return res.status(401).json({ error: 'API key inválida' });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'Límite de solicitudes excedido. Intenta más tarde.' });
    }

    return res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
