import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import MenuBar from './components/menu';
import { register } from './components/api';
import { primaryColor } from './components/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ICON1 from '../images/baker_girl.png';
import ICON2 from '../images/baker_boy.png';
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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: 'white',
    backgroundColor: primaryColor,
    "&:hover":{
      backgroundColor: 'rgb(243,245,231)',
      color: primaryColor,
    }
  },
}));

function Register(props) {
  const history = useHistory();
  const [ComfirmPwdNotMatchOpen, setComfirmPwdNotMatchOpen] = useState(false);
  const [InvaildPwdOpen, setInvaildPwdOpen] = useState(false);
  const [InvaildEmailOpen, setInvaildEmailOpen] = useState(false);
  const [InviteRegisterOpen, setInviteRegisterOpen] = useState(props.location.state.inviteRegister !== "" ? true : false)
  const emailCheck = /[A-z0-9_-]+@[A-z0-9]+\.[A-z]+/;

  console.log(props.location.state.inviteRegister)

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setComfirmPwdNotMatchOpen(false);
    setInvaildPwdOpen(false);
    setInvaildEmailOpen(false);
    setInviteRegisterOpen(false);
  };
  const registerSubmit = (event) => {
    event.preventDefault();
    const form = document.getElementById('register-form');
    const accountname = form.accountname.value;
    const email = form.email.value;
    const password = form.password.value;
    const comfirmpassword = form.comfirmpassword.value;
    const nickname = form.nickname.value;

    if (!emailCheck.test(email)) {
      setInvaildEmailOpen(true);
    } else if (password.length > 16 || password.length < 8) {
      setInvaildPwdOpen(true);
    } else {
      console.log("***" + email + " " + password + " " + nickname + " " + accountname + "***")
      if (comfirmpassword !== password) {
        setComfirmPwdNotMatchOpen(true);
      }
      else if (email !== '' && password !== '' && nickname !== '' && accountname !== '') {
        register(accountname, nickname, email, password).then((res) => {
          localStorage.setItem('userId', res.user.id);
          localStorage.setItem('token', res.token);
          localStorage.setItem('email', res.user.email);
          localStorage.setItem('nickname', res.user.nick_name);
          console.log("token" + res.token);
          history.push('/home');
        }).catch(() => {
          alert('err');
        });
      }
    }
  }

  const classes = useStyles();

  function SignUpForm() {
    return (
      <Container component="main" maxWidth="xs" style={{ marginTop: "100px" }}>
        <CssBaseline />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center', height: '70px' }}>
          <img src={ICON2} alt="icon" />
          <img src={ICON1} alt="icon" />
        </div>
        <div className={classes.paper}>
          <form id="register-form" className={classes.form} onSubmit={registerSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Account Name"
              name="accountname"
              autoComplete="accountname"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="login-password"
              autoComplete="current-password"
            />
            <Snackbar open={ComfirmPwdNotMatchOpen} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                The Confirm Password does not match.
              </Alert>
            </Snackbar>
            <Snackbar open={InvaildPwdOpen} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Input a password including 8 to 16 numbers.
              </Alert>
            </Snackbar>
            <Snackbar open={InvaildEmailOpen} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Input a valid email address.
              </Alert>
            </Snackbar>
            <Snackbar open={InviteRegisterOpen} anchorOrigin={{ vertical:"top", horizontal:"center" }} autoHideDuration={6000} onClose={handleClose} >
              <Alert onClose={handleClose} severity="info" style={{height:'55px'}}>
                Don't have a account？Sign up and explore MyRecipes
              </Alert>
            </Snackbar>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="comfirmpassword"
              label="Comfirm Password"
              type="password"
              id="comfirm-password"
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="nickname"
              label="Nickname"
              type="input"
              id="nickname"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="inherit"
              className={classes.submit}
              id="register-btn"
            >
              Sign Up
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
            image={"https://static.standard.co.uk/s3fs-public/thumbnails/image/2020/08/21/10/kolamba-1908.jpg?width=968"}
          />
        </div>
        <div className={c.rightContainer}>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

export default Register;
