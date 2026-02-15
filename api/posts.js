import storage from '../lib/storage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    try {
      const { limit = 50, type } = req.query;
      
      let links = storage.getAllLinks(parseInt(limit));
      
      if (type) {
        links = links.filter(link => link.postType === type);
      }
      
      return res.status(200).json({
        success: true,
        total: links.length,
        posts: links
      });
      
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
