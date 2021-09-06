import React, { Component,useStyles } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
// import FrontPage1 from '../../images/frontPage1.jpeg';
import FrontPage2 from '../../images/frontpage2.jpeg';
import FrontPage3 from '../../images/frontpage3.jpeg';
const styles = ({
  root: {
    position: "relative",
    padding: 0,
    margin: 0,
    overflow: "hidden",
    width: "100%",
  },
  center: {
    position: "relative",  //显示在中间的要撑开div
    width: "100%",
    left: 0,  //用于transition动画,必须设定left值
    transition :"all 1s ease-in-out",
  },
  right: {
    position :"absolute",
    left: "100%",
    width: "100%",
    top: 0,
  },
  left: {
    position :"absolute",
    left: "-100%",
    width: "100%",
    top: 0,
    transition :"all 1s ease-in-out",
  }
});
 
class Slideshow extends Component {
   
 
  state = {
    index: 0,
    images: [],
  };
 
  turn = step => {
    let index = this.state.index + step;
    if (index >= this.state.images.length) {
      index = 0;
    }
    if (index < 0) {
      index = this.props.images.length - 1;
    }
    this.setState({ index: index })
  };
 
  go = () => {
    this.timer = setInterval(
      () => this.turn(1),
      this.props.delay * 1000,
    )
  };
 
  clear = () => {
    clearInterval(this.timer)
  };
 
  componentDidMount() {
    const images = [
    //    require(FrontPage1),
       require('../../images/frontpage2.jpeg'),
       require('../../images/frontpage3.jpeg'),
    ];
    this.setState({
      images: images,
    });
    this.go()
  };
 
  componentWillUnmount() {
    this.clear();
  }
 
  render() {
    const { classes } = this.props;
 
    return (

      <div
        // className={classes.root}
        // onMouseOver={this.clear}  //鼠标悬停时停止计时
        // onMouseLeave={this.go}
      >
        { this.state.images.map((item, index) => (
            // console.log(item)&&
          <img
            src={ item }
            alt=""
            key={index}
            className={ classNames(
            { [classes.center]: index === this.state.index },
            {
              [classes.right]:
              index === this.state.index + 1 || (index === 0 && this.state.index === this.state.images.length - 1)
            },
            {
              [classes.left]:
              index === this.state.index - 1 || (index === this.state.images.length - 1 && this.state.index === 0)
            },
          ) }/>
        ))
        }
      </div>
    )
 
  }
}
 
Slideshow.propTypes = {
  classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(Slideshow);