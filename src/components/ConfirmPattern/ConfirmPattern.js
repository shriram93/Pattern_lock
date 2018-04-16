import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from  "react-router-dom";
import './ConfirmPattern.css';
import Canvas from '../Canvas/Canvas';

class ConfirmPattern extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      invalidPattern: false,
      patternMatch: false,
      redirectIfEmpty: false,
      confirmPattern: false
    };
  }

  setInvalidPattern = () => {
    this.setState(() => ({invalidPattern:true}));
  }

  setPatternMatch = () => {
    this.setState(() => ({patternMatch:true}));
  }

  confirmPattern = () => {
    this.setState(() => ({invalidPattern:false}));
    this.setState(() => ({confirmPattern:true}));
  }

  cancelPattern = () => {
    this.props.dispatch({
      type: 'SET_PATTERN',
      pattern: []
    });
    this.setState(() => ({redirectIfEmpty:true}));
  }

  componentWillMount() {
    if (this.props.pattern.length === 0)
      this.setState(() => ({redirectIfEmpty:true}));
  }
  render() {

    if (this.state.redirectIfEmpty) {
      return (<Redirect to="/" />);
      }
    return (
      <div>
        <section className="infodisplay--confirm animated fadeIn">
            {!this.state.confirmPattern && <p className="display-4"><strong>Draw the pattern again to confirm it</strong></p> }
            { this.state.confirmPattern && <p className="display-4 animated fadeIn"><strong>Pattern set successfully!</strong></p>}
            { this.state.invalidPattern && !this.state.patternMatch && <p className="lead errormsg animated fadeIn"><strong>Pattern doesn't match. Try again</strong></p>}
        </section>
        <Canvas  parent="ConfirmPattern" invalidPattern={this.setInvalidPattern} patternMatch={this.setPatternMatch} onRef={ref => (this.canvas = ref)}/>
        <section className="btngroup--confirm animated fadeIn">
            <button type="button" onClick={this.cancelPattern} className="btn btn-dark" disabled={ this.state.confirmPattern }>Cancel</button>
            <button type="button" onClick={this.confirmPattern} className="btn btn-dark" disabled={ !this.state.patternMatch || this.state.confirmPattern }>Confirm</button>
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

export default connect(mapStateToProps)(ConfirmPattern);
