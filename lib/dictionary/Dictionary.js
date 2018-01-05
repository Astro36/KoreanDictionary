const sqlite3 = require('sqlite3');

const Word = require('./Word');

const koreanRegExp = /^[\sㄱ-ㅎ가-힣ㆍ^-]+$/;

class Dictionary {
  constructor(path = ':memory:') {
    this.crawler = null;
    this.db = new sqlite3.Database(path);
    this.db.run('CREATE TABLE IF NOT EXISTS dictionary(text TEXT NOT NULL, type TEXT, theme TEXT, meaning TEXT);');
    this.path = path;
  }

  add(word) {
    const text = word.getText();
    if (koreanRegExp.test(text)) {
      const type = word.getType();
      const theme = word.getTheme();
      const meaning = word.getMeaning();
      this.db.run('INSERT INTO dictionary VALUES(?, ?, ?, ?)', [text, type ? JSON.stringify(type) : null, theme ? JSON.stringify(theme) : null, meaning ? JSON.stringify(meaning) : null]);
    }
  }

  async fetch() {
    const { db } = this;
    const words = await this.crawler.run();
    db.serialize(() => {
      db.run('BEGIN TRANSACTION;');
      for (let i = 0, len = words.length; i < len; i += 1) {
        const {
          text, type, theme, meaning,
        } = words[i];
        db.run('INSERT INTO dictionary VALUES(?, ?, ?, ?)', [text, type ? JSON.stringify(type) : null, theme ? JSON.stringify(theme) : null, meaning ? JSON.stringify(meaning) : null]);
      }
      db.run('END TRANSACTION;');
    });
  }

  findAll(text) {
    if (koreanRegExp.test(text)) {
      return new Promise(resolve => this.db.all('SELECT * FROM dictionary WHERE text = ?', text, (err, rows) => resolve(rows.map(row => new Word(row.text, row.type, row.theme, row.meaning)))));
    }
    return null;
  }

  getAll() {
    return new Promise(resolve => this.db.all('SELECT * FROM dictionary', (err, rows) => resolve(rows.map(row => new Word(row.text, row.type, row.theme, row.meaning)))));
  }

  getDB() {
    return this.db;
  }

  getDictionaryPath() {
    return this.path;
  }

  has(text) {
    if (koreanRegExp.test(text)) {
      return new Promise(resolve => this.db.get('SELECT * FROM dictionary WHERE text = ?', text, (err, row) => resolve(Boolean(row))));
    }
    return false;
  }
}

module.exports = Dictionary;
