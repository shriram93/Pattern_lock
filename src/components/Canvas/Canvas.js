import React from 'react';
import { connect } from 'react-redux';
import './Canvas.css';
import Circle from './Circle.js';

class Canvas extends React.Component {
  
  canvas = null;
  ctx = null;
  startX = 0;
  startY = 0;
  wid = 0;
  hei = 0;
  circles = [];
  selCircs = [];
  dragging = false;
  patternDone = false;
  patternTried = false;
  patternMatch = false;

  constructor(props){
    super(props);
    this.state = {
      canavsClass : ''
    };
  }
  componentDidMount() {
    this.props.onRef(this)
    if ( this.props.parent === 'DrawPattern')
    {
      this.setState(()=> ({canavsClass:'animated zoomIn'}));
    }
    else
    {
      this.setState(()=> ({canavsClass:'animated slideInRight'}));
    }
    setTimeout(function () {
      this.setState(()=> ({canavsClass:''}));
      this.init();
    }.bind(this), 1000);
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.wid = this.refs.canvas.width;
    this.hei = this.refs.canvas.height;
    this.init();
    this.addMouseEvents();
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
    this.removeMouseEvents()
  }

  addMouseEvents() {
    
    this.canvas.addEventListener('mousedown', this.onMouseDown, false);
    this.canvas.addEventListener('mousemove', this.onMouseMove, false);
    this.canvas.addEventListener('mouseup', this.onMouseUp, false);
    this.canvas.addEventListener('mouseout', this.onMouseOut, false);
  }
  removeMouseEvents() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown, false);
    this.canvas.removeEventListener('mousemove', this.onMouseMove, false);
    this.canvas.removeEventListener('mouseup', this.onMouseUp, false);
    this.canvas.removeEventListener('mouseout', this.onMouseOut, false);
  }

  init = () => {
    this.circles = [];
    this.selCircs = [];
    let pad = 90;
    let rad = (this.wid - pad * 4) / 3;
     for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = j * (pad + rad) + pad + rad / 2;
            let y = i * (pad + rad) + pad + rad / 2;
            this.circles.push(new Circle({
              x: x,
              y: y
          }, rad ));
        }
    }
    this.draw();
    this.patternTried = false;
    this.patternDone = false;
    this.dragging = false;
  }

  draw = (mousePosX, mousePosY) => {
    this.ctx.clearRect(0, 0, this.wid, this.hei);
    for (let i = 0; i < this.circles.length; i++) {
        this.circles[i].draw(this.ctx,this.patternTried,this.selCircs,this.patternDone,this.patternMatch,this.props.parent);
    }
    if (this.dragging && this.selCircs.length > 0 && !this.patternTried) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 10;
      this.ctx.strokeStyle = '#FFF';
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      const lastDot = this.selCircs[this.selCircs.length - 1].circ.position();
      this.ctx.moveTo(lastDot.x, lastDot.y);
      this.ctx.lineTo(mousePosX, mousePosY);
      this.ctx.stroke();
    }

    if (this.selCircs.length > 1) {
        let pos = this.selCircs[0].circ.position();
        this.ctx.beginPath();
        this.ctx.lineWidth = 10;
        if (this.patternTried && (this.selCircs.length <= 3 || (!this.patternMatch && this.props.parent === 'ConfirmPattern'))) {
          this.ctx.strokeStyle = '#FF5722';
        } else if (this.patternDone && this.selCircs.length > 3) {
            this.ctx.strokeStyle = '#9CCC65';
        } else {
            this.ctx.strokeStyle = '#FFF';
        }
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.moveTo(pos.x, pos.y);
        for (let j = 1; j < this.selCircs.length; j++) {
            pos = this.selCircs[j].circ.position();
            this.ctx.lineTo(pos.x, pos.y);
        }
        this.ctx.stroke();
    }

  }

  calcDistance = (point1, point2) => {
    return Math.sqrt(((point2.x - point1.x) * (point2.x - point1.x)) + ((point2.y - point1.y) * (point2.y - point1.y)));
  }

  onMouseDown = (e) => {
    this.dragging = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    e.preventDefault();
  }

  onMouseMove = (e) => {
    this.draw(e.offsetX, e.offsetY);
    for (let i = 0; i < this.circles.length; i++) {
        let cir = this.circles[i];
        let pip = cir.isPointInPath(e.offsetX, e.offsetY);
        cir.hovering = pip;
        if (this.dragging && pip && !cir.selected && !this.patternDone) {
            if (this.selCircs.length >= 1) {
                let currCirclePos = cir.position();
                let prevCirclePos = this.selCircs[this.selCircs.length - 1].circ.position();
                for (let idx = 0; idx < this.circles.length; idx++) {
                    if (!this.circles[idx].selected && idx !== i) {
                        const diff = Math.abs(this.calcDistance(prevCirclePos, this.circles[idx].position()) + this.calcDistance(currCirclePos, this.circles[idx].position()) - this.calcDistance(prevCirclePos, currCirclePos));
                        if (diff <= 5) {
                            this.selCircs.push({
                                circ: this.circles[idx],
                                index: idx
                            });
                            this.circles[idx].selected = true;
                        }
                    }
                }
            }
            this.selCircs.push({
                circ: cir,
                index: i
            });
            cir.selected = true;
        }
    }
  }

  onMouseOut = (e) => {
    if ((this.selCircs.length === 0 || this.dragging) &&  !this.patternDone )
        this.init();
    this.dragging = false;
  }

  onMouseUp = (e) => {
    this.dragging = false;
    if (this.selCircs.length === 1) {
        this.selCircs[0].circ.selected = false;
        this.selCircs.pop();
    } else if (this.selCircs.length > 1) {
        this.patternTried = true;
    }
    if (this.patternTried) {
        if (this.selCircs.length > 3)
        {
            this.patternDone = true;
            const finalPatern = this.selCircs.map((circle)=>{
              return circle.index;
            });
            if ( this.props.parent === 'DrawPattern')
            {
              this.props.dispatch({
                type: 'SET_PATTERN',
                pattern: finalPatern
              });
              this.onMouseMove(e);
            }
            else
            {
              if (this.props.pattern.toString() === finalPatern.toString())
              {
                this.patternMatch = true;
                this.props.patternMatch();
                this.onMouseMove(e);
              }
              else
              {
                this.onMouseMove(e);
                this.props.invalidPattern();
                this.setState(()=> ({canavsClass:'animated shake'}));
                setTimeout(function () {
                  this.setState(()=> ({canavsClass:''}));
                  this.init();
                 }.bind(this), 1000);
              }
            }

          }
        else {
            this.onMouseMove(e);
            this.props.invalidPattern();
            this.setState(()=> ({canavsClass:'animated shake'}));
            setTimeout(function () {
              this.setState(()=> ({canavsClass:''}));
              this.init();
             }.bind(this), 1000);
        }
    }
  }

  render() {
    return (
      <div>
        <canvas className={this.state.canavsClass} ref="canvas" width="400vw" height="400vh"></canvas>
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
      pattern: state.pattern
  }
}

export default connect(mapStateToProps)(Canvas);
