const sha1 = require('sha1');
// import sha1 from 'sha1';

const ShaService = {
  toSha: function(...args) {
    let text;
    text = args.join('');
    return sha1(text);
  }
};


module.exports.ShaService = ShaService;
// export default ShaService;
