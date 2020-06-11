
class BaseStrategy {

  constructor(){
    this.analyze   = this.analyze;
    this.doAnalyze = this.doAnalyze;
  }


  analyze() {
    throw "analyze not defined at " + JSON.stringify(this);
  }

  doAnalyze( old, _new ){
    let res = this.analyze( old, _new );
    return res;
  }
}

module.exports.BaseStrategy = BaseStrategy;
// export default BaseStrategy;
