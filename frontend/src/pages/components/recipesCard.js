import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { primaryColor, lightColor } from './styles';
import { useHistory } from 'react-router-dom';
import { deleteLike, postLike, deleteRecipe } from './api';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    margin: 20,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    '&:hover': {
      cursor: 'pointer'
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: lightColor,
    '&:hover': {
      cursor: 'pointer'
    }
  },
}));


export default function RecipeReviewCard({ recipe_id, recipe_title, photo, created_by_user_id, author_name, like_count, is_liked, updated, isProfile }) {
  const classes = useStyles();
  const [Like, setLike] = useState(is_liked === 'True' ? true : false);
  const [LikeNumb, setNumber] = useState(like_count);
  const history = useHistory();
  const isAuth = localStorage.getItem('token') ? true : false

  console.log('>>>>>@@@@@@@@@@@@')
  useEffect(() => {
    if (!isAuth) {
      setLike(false)
    }
  }, [])

  function goToSignUp() {
    history.push('/signup', { inviteRegister: true });
  }

  function handleAuthorClick(e) {
    const author_id = e.target.getAttribute('authorid')
    console.log(e.target.getAttribute('authorid'));

    history.push({
      pathname: '/profile',
      profile: '?id=' + author_id,
      state: { authorId: author_id }
    });
  }

  function handleLike() {
    // const token = localStorage.getItem('token');
    if (Like) {
      deleteLike(localStorage.getItem('token'), recipe_id).catch((err) => {
        console.log("delete like error: " + err);
      })
      setLike(false);
      setNumber(LikeNumb - 1)
    } else {
      postLike(localStorage.getItem('token'), recipe_id).catch((err) => {
        console.log("post like err: " + err)
      })
      setLike(true);
      setNumber(LikeNumb + 1)
    }
  }

  function EditRecipe() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    function handleEditRecipe(event) {
      setAnchorEl(event.currentTarget);
    }

    function handleEdit(){
      history.push('./editRecipe', { recipeId: recipe_id }) 
    }

    function handleDelete(e) {
      deleteRecipe(localStorage.getItem('token'), recipe_id).then((info) => {
          history.go(0)
      }).catch((err) => {
        alert("delete recipe wrong");
      })
    }

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>

        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleEditRecipe}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: '10ch',
            },
          }}
        >
          <MenuItem key={"edit"} onClick={handleEdit}>
            Edit
          </MenuItem>
          <MenuItem key={"delete"} onClick={handleDelete}>
            Delete
          </MenuItem>
        </Menu>
      </div>
    )
  }


  const Month = ["null", "January", "February", "March", "Apri", "May", "June", "July", "August", "September", "October", "November", "December"]
  const Time = updated.split("T")[0].split("-")

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" authorid={created_by_user_id} className={classes.avatar} onClick={isAuth ? handleAuthorClick : goToSignUp}>
            {author_name.charAt(0)}
          </Avatar>
        }
        title={author_name}
        subheader={Month[parseInt(Time[1], 10)] + " " + parseInt(Time[2], 10) + " " + parseInt(Time[0], 10)}
      />
      <CardMedia
        className={classes.media}
        image={photo ? photo : "https://source.unsplash.com/random"}
        title={recipe_title}
        onClick={isAuth ? () => { 
          history.push('/recipeInfo', { recipe_id: recipe_id });
          window.location.reload(); 
        
        } : goToSignUp
        }
      />
      <CardContent style={{ height: '40px' }}>
        <Typography variant="h6" color="textSecondary" component="p">
          {recipe_title}
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', width: '50px', alignItems: 'center' }}>
          <IconButton aria-label="add to favorites" >
            {
              Like ?
                <FavoriteIcon style={{ color: primaryColor }} onClick={isAuth ?  handleLike : goToSignUp} /> :
                <FavoriteBorderOutlinedIcon style={{ color: "" }} onClick={isAuth ? handleLike : goToSignUp} />
            }
          </IconButton>
          <Typography variant="body2" color="textSecondary" component="p">{LikeNumb}</Typography>
        </div>
        {isProfile ? <EditRecipe /> : null}
      </CardActions>
    </Card>
  );
}
