const crypto = require('crypto');

// Função auxiliar para fazer o hash SHA256 (Meta exige hash minúsculo e sem espaços)
function hashData(data) {
  if (!data) return undefined;
  const cleanData = data.trim().toLowerCase();
  return crypto.createHash('sha256').update(cleanData).digest('hex');
}

module.exports = async (req, res) => {
  // Apenas aceitamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { eventName, userData, customData } = req.body;

    const pixelId = process.env.META_PIXEL_ID;
    const token = process.env.META_CAPI_TOKEN;

    if (!pixelId || !token) {
      console.warn('⚠️ Token ou Pixel ID não configurados nas variáveis de ambiente da Vercel!');
      return res.status(500).json({ error: 'Configurações de ambiente ausentes' });
    }

    // Hasheando os dados (mesma lógica que usamos no servidor local)
    const hashedUserData = {
      em: [hashData(userData?.email)],
      ph: [hashData(userData?.phone)],
      fn: [hashData(userData?.firstName)],
      ct: [hashData(userData?.city)],
      client_user_agent: userData?.userAgent || req.headers['user-agent'],
      client_ip_address: req.headers['x-forwarded-for'] || '127.0.0.1' // Vercel manda o IP do cliente aqui
    };

    // Removendo campos não definidos
    Object.keys(hashedUserData).forEach(key => {
      if (hashedUserData[key] === undefined || (Array.isArray(hashedUserData[key]) && hashedUserData[key][0] === undefined)) {
        delete hashedUserData[key];
      }
    });

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: customData || {}
        }
      ]
    };

    console.log(`[Vercel Serverless] Disparando evento ${eventName} para a Meta...`);

    // Usando fetch nativo do Node.js 18+ para evitar problemas de dependência do Axios na Vercel
    const metaResponse = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const metaData = await metaResponse.json();
    
    if (!metaResponse.ok) {
      console.error('[Vercel Serverless] Erro da Meta:', metaData);
      return res.status(metaResponse.status).json({ success: false, error: metaData });
    }

    console.log('[Vercel Serverless] Sucesso! Evento recebido pela Meta:', metaData);
    return res.status(200).json({ success: true, metaResponse: metaData });

  } catch (error) {
    console.error('❌ [Vercel Serverless] Erro interno:', error.message);
    return res.status(500).json({ success: false, error: 'Erro de comunicação' });
  }
};
