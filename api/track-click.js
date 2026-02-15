import storage from '../lib/storage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'POST') {
    try {
      const { shortCode } = req.body;
      
      if (!shortCode) {
        return res.status(400).json({ error: 'shortCode required' });
      }
      
      const success = storage.incrementClicks(shortCode);
      
      return res.status(200).json({
        success,
        message: success ? 'Click tracked' : 'Link not found'
      });
      
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
