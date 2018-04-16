import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from  "react-router-dom";
import './DrawPattern.css';
import Canvas from '../Canvas/Canvas';

class DrawPattern extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      invalidPattern: false,
      confirmPatternRoute: false
    };
  }

  retryPattern = () => {
    this.setState(() => ({invalidPattern:false}));
    this.props.dispatch({
      type: 'SET_PATTERN',
      pattern: []
    });
    this.canvas.init();
  }

  setInvalidPattern = () => {
    this.setState(() => ({invalidPattern:true}));
  }

  navigateConfirmPage = () => {
    this.setState( () => ({confirmPatternRoute : true }));
  }


  render() {
    if (this.state.confirmPatternRoute) {
    return (<Redirect to="/confirm" />);
    }
    return (
      <div className={this.state.drawPatternClass}>
        <section className="infodisplay--draw animated fadeIn">
            <p className="display-4"><strong>Draw your unlock pattern</strong></p>
            { (this.state.invalidPattern && this.props.pattern.length <=3) && <p className="lead errormsg animated fadeIn"><strong>You need to connect at least 4 dots. Try again</strong></p>}
        </section>
        <Canvas parent="DrawPattern" invalidPattern={this.setInvalidPattern} onRef={ref => (this.canvas = ref)}/>
        <section className="btngroup--draw animated fadeIn">
            <button type="button" onClick={this.retryPattern} className="btn btn-dark" disabled={ !(this.props.pattern.length > 3) }>Reset</button>
            <button type="button" onClick={this.navigateConfirmPage} className="btn btn-dark" disabled={!(this.props.pattern.length > 3)}>Continue</button>          
        </section>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
      pattern: state.pattern
  }
}

export default connect(mapStateToProps)(DrawPattern);
