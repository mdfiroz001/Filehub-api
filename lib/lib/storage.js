// ইন-মেমরি স্টোরেজ
class Storage {
  constructor() {
    this.links = new Map();
    this.postLinks = new Map();
  }

  saveLink(shortCode, data) {
    this.links.set(shortCode, {
      ...data,
      createdAt: Date.now(),
      clicks: 0,
      lastClicked: null
    });
    
    const postKey = `${data.postType}_${data.postId}`;
    this.postLinks.set(postKey, shortCode);
    return true;
  }

  getLink(shortCode) {
    return this.links.get(shortCode) || null;
  }

  getLinkByPostId(postType, postId) {
    const postKey = `${postType}_${postId}`;
    const shortCode = this.postLinks.get(postKey);
    if (shortCode) {
      const link = this.getLink(shortCode);
      return link ? { ...link, shortCode } : null;
    }
    return null;
  }

  incrementClicks(shortCode) {
    const link = this.links.get(shortCode);
    if (link) {
      link.clicks += 1;
      link.lastClicked = Date.now();
      this.links.set(shortCode, link);
      return true;
    }
    return false;
  }

  getAllLinks(limit = 50) {
    const all = Array.from(this.links.entries()).map(([code, data]) => ({
      shortCode: code,
      ...data
    }));
    return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  }

  deleteLink(shortCode) {
    const link = this.links.get(shortCode);
    if (link) {
      const postKey = `${link.postType}_${link.postId}`;
      this.postLinks.delete(postKey);
      this.links.delete(shortCode);
      return true;
    }
    return false;
  }
}

const storage = new Storage();
export default storage;
