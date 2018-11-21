/**
 * Class representing a dictionary item.
 */
class DictionaryItem {
  constructor({
    word, meaning, pos, category,
  }) {
    /**
     * 표제어
     * @member {string}
     */
    this.word = word;
    /**
     * 뜻
     * @member {string}
     */
    this.meaning = meaning;
    /**
     * 품사
     * @member {Array.<string>}
     */
    this.pos = pos;
    /** 전문어 및 특수어휘
     * @member {Array.<string>}
     */
    this.category = category;
  }
}

module.exports = DictionaryItem;
