import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { primaryColor, lightColor } from './components/styles';
import { useHistory } from 'react-router-dom';
import MenuBar from './components/menu';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { updateInfo } from './components/api';
import { changePassword } from './components/api';


const useStyles = makeStyles((theme) => ({
    title: {
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
        width: '400px',
        marginBottom: 30,
    },
    container: {
        flexDirection: 'row',
        display: 'flex',
        padding: '100px',
        flexWrap: 'wrap',
        justifyContent: 'center',

    },
    inputContainer: {
        flexDirection: 'row',

    },
    intro: {
        fontStyle: 'bold',
        marginBottom: 20,

    },
    save: {
        margin: theme.spacing(3, 0, 2),
        color: 'white',
        backgroundColor: primaryColor,
    },

    userInfo: {
        margin: 70,
        flexDirection: 'column',
        // flexWrap: 'wrap',
        width: '250',
    },
    avatar: {
        display: 'flex',
        width: '100%',
        marginBottom: '50px',
        '& > div': {
            width: '162px',
            height: '162px',
            backgroundColor: lightColor,
            border: '1px solid ' + lightColor,
            borderRadius: '15px',
            textAlign: 'center',
            lineHeight: '162px',
            fontFamily: 'Merriweather',
            fontSize: '5em',
            color: 'white'
        },
    },

    personalSetting: {
        width: '50%'
    }

}));

const emailCheck = /[A-z0-9_-]+@[A-z0-9]+\.[A-z]+/;

export default function EditMyProfile() {
    const classes = useStyles();
    const history = useHistory();
    const [changePass, setChangePass] = useState(false)

    function handleSubmit(event) {
        event.preventDefault();
        const form = document.getElementById('changePassword-form');
        const old_password = form.old_password.value;
        const new_password = form.password.value;
        const comfirm_new_password = form.confirm_password.value;

        if (old_password !== '' && new_password !== '' && comfirm_new_password !== '' && new_password === comfirm_new_password && 8 <= new_password.length && new_password.length <= 16) {
            changePassword(localStorage.getItem('token'), old_password, new_password).then((info) => {
                history.push({
                    pathname: '/profile',
                    state: { authorId: localStorage.getItem('userId') }
                });

            }).catch((err) => {
                // here, the backend of this porject return a err in type of object
                console.log("error here")
                alert("Please input your old password correctly");
            })
        } else if (new_password !== comfirm_new_password) {
            alert('password and confirm password need to be the same')
        } else if (old_password === '' || new_password === '' || comfirm_new_password === '') {
            alert('no empty value is allowed')
        } else if (new_password.length > 16 || new_password.length < 8) {
            alert('please input valid password')

        } else {
            alert('well, something wrong here')
        }

    }

    function handleSave(event) {
        event.preventDefault();
        const form = document.getElementById('editUserInfo-form');
        const accountName = form.accountname.value;
        const email = form.email.value;
        // const token = localStorage.getItem('token');

        console.log("handle save");
        // console.log("token: " + token);
        console.log("accountName: " + accountName);
        console.log("email: " + email);

        if (accountName !== '' && email !== '' && emailCheck.test(email)) {
            updateInfo(localStorage.getItem('token'), accountName, email).then((info) => {
                localStorage.setItem('email', info.user.email);
                localStorage.setItem('nickname', info.user.nick_name);
                history.push({
                    pathname: '/profile',
                    state: { authorId: localStorage.getItem('userId') }
                });
            }).catch((err) => {
                alert(err.error);
            })
        } else if (!emailCheck.test(email)) {
            alert('Please input valid Email')
        } else {
            alert('well, something wrong here')
        }
    }

    function EditUserInfo() {
        return (
            <div>
                <Typography variant="h4" className={classes.title} >
                    Edit user information
                </Typography>
                <form id="editUserInfo-form" className={classes.form} onSubmit={handleSave}>
                    <Box component="div" >Name</Box>

                    <TextField variant="outlined" margin="normal" required fullWidth name="accountname"
                        autoComplete="account name" initialValue="hello" defaultValue={localStorage.getItem('nickname')} autoFocus backgroundColor={primaryColor} />


                    <Box component="div" whiteSpace="nowrap">Email</Box>
                    <TextField variant="outlined" margin="normal" required fullWidth name="email"
                        id="email" autoComplete="email" defaultValue={localStorage.getItem('email')} />

                    <Button type="save" fullWidth variant="contained"
                        color="inherit" className={classes.save} >
                        Save
                    </Button>
                </form>
            </div>
        )
    }

    function ForgetPassword() {
        return (
            <div>
                <Typography variant="h4" className={classes.title} >
                    Change Password
                </Typography>

                <form id="changePassword-form" className={classes.form} onSubmit={handleSubmit}>
                    <Box component="div" >old password</Box>

                    <TextField variant="outlined" margin="normal" required fullWidth name="old_password"
                        id="old-password" autoComplete="old_password" type="password" autoFocus backgroundColor={primaryColor} />


                    <Box component="div" whiteSpace="nowrap">new password</Box>
                    <TextField variant="outlined" margin="normal" required fullWidth name="password" type="password"
                        id="new-password" autoComplete="current-password" />

                    <Box component="div" whiteSpace="nowrap">confirm new password</Box>
                    <TextField variant="outlined" margin="normal" required fullWidth name="confirm_password" type="password"
                        id="confirm-password" autoComplete="current-password" />


                    <Button type="submit" fullWidth variant="contained"
                        color="inherit" className={classes.save} >
                        Submit
                    </Button>
                </form>
            </div>
        )
    }


    return (
        <div>
            <MenuBar />
            <div className={classes.container}>
                <div className={classes.userInfo}>
                    <div className={classes.avatar}>
                        <div>
                            {localStorage.getItem("nickname").charAt(0)}
                        </div>
                    </div>
                    <Button color="inherit" >
                        <Typography style={{color: 'blue', textDecoration: 'underline'}}variant="h7" onClick={() => { setChangePass(!changePass) }}>
                            {changePass ? 'Edit user information' : 'Change Password'}
                        </Typography>
                    </Button>
                </div>

                <div className={classes.personalSetting}>
                    {changePass ? <ForgetPassword /> : <EditUserInfo />}
                </div>

            </div>
        </div>

    );
}
