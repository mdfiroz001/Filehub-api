import storage from '../lib/storage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postId, postType, title, userId } = req.body;

    if (!postId || !postType) {
      return res.status(400).json({ error: 'postId and postType are required' });
    }

    const existingLink = storage.getLinkByPostId(postType, postId);
    if (existingLink) {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'https://your-app.vercel.app';
      
      return res.status(200).json({
        success: true,
        shortCode: existingLink.shortCode,
        shortUrl: `${baseUrl}/${existingLink.shortCode}`,
        existing: true,
        postData: existingLink
      });
    }

    let shortCode;
    do {
      shortCode = generateShortCode();
    } while (storage.getLink(shortCode));

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://your-app.vercel.app';

    const linkData = {
      postId,
      postType,
      title: title || 'Untitled',
      userId: userId || null,
      shortCode,
      createdAt: Date.now(),
      clicks: 0
    };

    storage.saveLink(shortCode, linkData);

    return res.status(200).json({
      success: true,
      shortCode,
      shortUrl: `${baseUrl}/${shortCode}`,
      postData: linkData
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function generateShortCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
