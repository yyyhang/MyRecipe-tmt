// imports the React Javascript Library
import React from "react";
//Card
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";

import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";

import blue from "@material-ui/core/colors/blue";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";


//Tabs
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor:'transparent',
    width: 260,
    height:190,
    display: "flex",
    justifyContent: "center",
    alignItems:'center',
    borderRadius:10,
    borderColor:'grey',
    flexDirection: 'column',
  },
  input: {
    display: "none",
    backgroundColor:'grey'
  },
  title: {
    color: blue[800],
    fontWeight: "bold",
    fontFamily: "Montserrat",
    align: "center"
  },
  button: {
    color: blue[900],
    margin: 0,
  },
  card:{
    height:100,
    width:200,
    backgroundColor:'transparent'
  },
  media:{
    borderRadius:5,
    width:'100%',
    height:'100%',
  },
});

class ImageUploadCard extends React.Component {
  
  state = {
    mainState: "initial", // initial, search, gallery, uploaded
    imageUploaded: 0,
    selectedFile: null
  };
  

  handleUploadClick = event => {
    var file = event.target.files[0];
    const reader = new FileReader();
    //eslint-disable-next-line
    var url = reader.readAsDataURL(file);
    reader.onloadend = function(e) {
      this.setState({
        selectedFile: [reader.result]
      });
    }.bind(this);
    
    this.setState({
      mainState: "uploaded",
      selectedFile: event.target.files[0],
      imageUploaded: 1,
      
    });
  };

  renderInitialState() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CardContent>
          <Grid container justify="center" alignItems="center">
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={this.handleUploadClick}
            />
            <label htmlFor="contained-button-file">
              <Fab component="span" className={classes.button}>
                <AddPhotoAlternateIcon />
              </Fab>
            </label>
          </Grid>
        </CardContent>
      </React.Fragment>
    );
  }



  renderUploadedState() {
    const { classes } = this.props;
    this.props.img(this.state.selectedFile);
    
    return (
      <div>
     {(this.state.selectedFile || this.props.image)&&
      <Card className={classes.root}>
        <CardActionArea onClick={this.imageResetHandler}>
          <img
            className={classes.media}
            src={this.state.selectedFile?this.state.selectedFile:this.props.image}
            onChange={this.handleUploadClick}
            alt={""}
          />
        </CardActionArea>
        </Card>
    }
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        { this.renderInitialState()}
        { this.renderUploadedState()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ImageUploadCard);
