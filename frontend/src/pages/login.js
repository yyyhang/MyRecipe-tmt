import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import MenuBar from './components/menu';
import { login } from './components/api';
import { primaryColor } from './components/styles';
import ICON1 from '../images/bake.png';
import ICON2 from '../images/baking.png';
import CardMedia from '@material-ui/core/CardMedia';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: 'white',
    backgroundColor: primaryColor,
    "&:hover": {
      backgroundColor: 'rgb(243,245,231)',
      color: primaryColor,
    }
  },
}));


// render sign in page
function SignIn() {
  const history = useHistory();
  localStorage.clear();

  // login in button handler
  function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('login-form');
    const name = form.accountname.value;
    const password = form.password.value;

    if(localStorage.getItem('token')){
      localStorage.clear();
    }

    if (name !== '' && password !== '') {
      login(name, password).then((info) => {
        console.log("login successfully!");
        const fetchData = async () => {
          console.log("set token");
          await localStorage.setItem('userId', info.user.id);
          await localStorage.setItem('token', info.token);
          await localStorage.setItem('email', info.user.email);
          await localStorage.setItem('nickname', info.user.nick_name);
          await history.push('/home');
          console.log(info.token);
        }
        fetchData();
      }).catch((err) => {
        // here, the backend of this porject return a err in type of object
        alert('Account name or password is incorrect');
      })
    }
  }

  function LoginForm() {
  const classes = useStyles();

    return (
      <Container component="main" maxWidth="xs" style={{ marginTop: "100px" }}>
        <CssBaseline />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center', height: '70px' }}>
          <img src={ICON2} alt="icon" />
          <img src={ICON1} alt="icon" />
        </div>
        <div className={classes.paper}>
          <form id="login-form" className={classes.form} onSubmit={handleSubmit}>
            <TextField variant="outlined" margin="normal" required fullWidth label="Account Name" name="accountname"
              autoComplete="account name" autoFocus backgroundColor={primaryColor} />
            <TextField variant="outlined" margin="normal" required fullWidth name="password"
              label="Password" type="password" id="login-password" autoComplete="current-password" />
            <Button type="submit" fullWidth variant="contained"
              color="inherit" className={classes.submit} id="login-btn">
              Login
            </Button>
          </form>
        </div>
      </Container>
    )
  }
  const localStyle = makeStyles((theme) => ({
    root: {
      display: 'flex',
      width: window.innerWeight,
      height: window.innerHeight-64,
      marginTop: "64px",
      justifyContent: "space-between",
      flex: "1",
    },
    leftContainer: {
      width: '50%',
      height: "100%",
      display: 'block',
    },
    media: {
      height: '100%',
      paddingTop: '0%', // 16:9
    },
    rightContainer: {
      display: 'flex',
      height: '100%',
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center',
      "& > div": {
        width: "50%",
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
      }
    }
  }));

  const c = localStyle();

  return (
    <div>
      <MenuBar />
      <div className={c.root}>
        <div className={c.leftContainer}>
          <CardMedia
            className={c.media}
            image={"https://static01.nyt.com/images/2021/06/04/dining/04staff-roundup-top-art/merlin_149985834_c21d765b-c598-49f0-b659-575889283059-mediumSquareAt3X.jpg"}
          />
        </div>
        <div className={c.rightContainer}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
