import React from 'react';
import './App.css';


const digitNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const zeros = /(?<![1-9]+0*)0*(?=[0-9]+)/g;
const twoOperators = /(?<=[0-9])([/*+-]+)([*/+])/g;
const matchOp = /(?<=[0-9]+[/*+-]+)([*/+])/g;
const endOperators = /[/*-+\.]+$/;
const equals = /(?<=[0-9])=/;
const twoDots = /(?<=[0-9]\.[0-9]*)\.+/g;
const operatorDot = /(?<=[/*+-])\.+/g;

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: '0',
      input: '',
      warning: false
    }
    this.cellClick = this.cellClick.bind(this);
    this.clear = this.clear.bind(this);
    this.makeResult = this.makeResult.bind(this);
    this.cleanFormula = this.cleanFormula.bind(this);
    this.delete = this.delete.bind(this);
    this.checkLength = this.checkLength.bind(this);
  };
  //add digit length limit on display
  //a number cannot start with several zeros
  //two decimal dots are ignored and only one dot is displayed
  //из двух последовательных операторов, за исключением минуса, выполняется второй
  //after pressing = operations continue with the current result
  //4 знака после запятой: number.toFixed(4)
  
  clear() {
    this.setState({
      formula: '0',
      input: ''
    });
  };

  checkLength(string) {
    if (string.length >= 15) {
      this.setState({ 
        warning: true,
        input: '' })
    } else {
      this.setState({ warning: false })
    }
  };

  cellClick(value) {
    this.checkLength(this.state.formula+value)
    if (this.state.warning === false) {
     if (value !== '=') {
      this.setState({
        formula: this.cleanFormula(this.state.formula+value),
        input: value
      });
      } else {
        this.makeResult();
      };
    }
    
  };

  delete() {
    if (this.state.formula !== '0') {
      const delF = this.state.formula.slice(0, -1);
      this.checkLength(delF);
      this.setState({
        formula: delF,
        input: ''
      })
    }
  };

  cleanFormula(formula) {
    return formula
    .replace(zeros, '')
    .replace(twoOperators, formula.match(matchOp))
    .replace(operatorDot, '')
    .replace(twoDots, '')
    .replace(equals, '');
  };

  //press '='
  makeResult() {
    const result = eval(this.cleanFormula(this.state.formula).replace(endOperators, ''));
    this.setState({
      formula: (/\.[0-9]{5,}/).test(result) ? result.toFixed(4) : result,
      input: ''
    })
  };

  render() {
    
    return(
      <>
      <div id='grid'>
        <div id="display-box">
          <p id='display'>{this.state.formula}</p>
          <p><span className={this.state.warning ? 'animated' : 'hidden'}>MAX LIMIT</span>{this.state.input}</p></div> {/*row end*/}
        <DigitCellRow digitClick={this.cellClick} firstDigit={7} />
        <OperatorCell operatorName={'divide'} operatorValue={'/'} operatorClick={this.cellClick} /> {/*row end*/}
        <DigitCellRow digitClick={this.cellClick} firstDigit={4} />
        <OperatorCell operatorName={'multiply'} operatorValue={'*'} operatorClick={this.cellClick} /> {/*row end*/}
        <DigitCellRow digitClick={this.cellClick} firstDigit={1} />
        <OperatorCell operatorName={'subtract'} operatorValue={'-'} operatorClick={this.cellClick} /> {/*row end*/}
        <button id="clear" className='clear cell' onClick={this.clear}>C</button>
        <DigitCellRow digitClick={this.cellClick} firstDigit={0} />
        <OperatorCell operatorName={'decimal'} operatorValue={'.'} operatorClick={this.cellClick} />
        <OperatorCell operatorName={'add'} operatorValue={'+'} operatorClick={this.cellClick} /> {/*row end*/}
        <button id="equals" className='operator wide' value={'='} onClick={this.makeResult}>=</button>
        <button id='delete' className='cell delete' value={'del'} onClick={this.delete}>&#10144;</button>
      </div>
      <Footer />
      </>
    )
  };
  
};

const DigitCellRow = ({digitClick, firstDigit}) => {
  if (firstDigit !== 0) {
    //array of strings
    const rowDigits = digitNames.slice(firstDigit, firstDigit+3);
    return rowDigits.map(el => { 
      const number = digitNames.indexOf(el).toString();
      return <button id={el} key={el} value={number} className='digit cell' onClick={() => digitClick(number)}>{number}</button>
    });
  } else {
    return(
      <button id="zero" value={'0'} onClick={() => digitClick('0')} className='digit cell'>0</button>
    )
  };
}
const OperatorCell = ({operatorClick, operatorName, operatorValue}) => {
  return(
    <button id={operatorName} className='operator cell' value={operatorValue} onClick={() => operatorClick(operatorValue)}>{operatorValue}</button>
  )
}
const Footer = () => {
  return(
    <footer><ul>
      <li>Precision - 4 decimal places</li>
      <a href="https://github.com/mel-ty" target='_blank'><li id='link'>GitHub</li></a>
    </ul></footer>
  )
}

export default MyApp;