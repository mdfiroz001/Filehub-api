import storage from '../lib/storage.js';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(404).send('Not found');
  }

  try {
    const link = storage.getLink(code);

    if (!link) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Not Found - FileHub</title>
          <style>
            body { font-family: Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
            .container { max-width: 500px; padding: 20px; }
            h1 { font-size: 4rem; margin: 0; }
            .btn { display: inline-block; padding: 12px 30px; background: white; color: #667eea; text-decoration: none; border-radius: 50px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <h2>Link Not Found</h2>
            <a href="https://file-hubs.vercel.app" class="btn">Go to FileHub</a>
          </div>
        </body>
        </html>
      `);
    }

    storage.incrementClicks(code);
    const redirectUrl = `https://file-hubs.vercel.app/${link.postType}/${link.postId}`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to ${link.title}</title>
        <meta http-equiv="refresh" content="2;url=${redirectUrl}">
        <style>
          body { font-family: Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
          .spinner { width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; margin: 20px auto; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: white; color: #667eea; text-decoration: none; border-radius: 50px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Redirecting to FileHub</h2>
          <div class="spinner"></div>
          <p>If not redirected, <a href="${redirectUrl}" class="btn">click here</a></p>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    res.status(500).send('Internal server error');
  }
}
