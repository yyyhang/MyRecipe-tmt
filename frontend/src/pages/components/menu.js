import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { primaryColor, lightColor } from './styles.js'
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';
import Search from './search';
import { logout } from './api.js';

const useStyles = makeStyles((theme) => ({
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: primaryColor,
        zIndex: '99'
    },
    title: {
        // flexGrow: 1,
        fontFamily: 'Lobster',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
        width: '200px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    menuItem: {
        minWidth: '30px',
    },
    thumbContainer: {
        display: 'flex',
        padding: '100px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

}));



export default function MenuBar(props) {
    const classes = useStyles();
    // const [localToken, setlocalToken] = useState(localStorage.getItem('token'));
    const history = useHistory();

    function AuthTabs() {
        return (
            <div>
                <Button color="inherit" >
                    <Typography variant="h7" onClick={() => { history.push('/login') }}>
                        Login
                    </Typography>
                </Button>

                <Button color="inherit" >
                    <Typography variant="h7" onClick={() => { history.push('/signup', { inviteRegister: "" }) }}>
                        Signup
                    </Typography>
                </Button>


            </div>
        )

    }



    function UserTabs() {
        const [anchorEl, setAnchorEl] = useState(null);

        const StyledMenu = withStyles({
            paper: {
                border: '0px solid #d3d4d5',
            },
        })((props) => (
            <Menu
                elevation={0}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                {...props}
            />
        ));

        const StyledMenuItem = withStyles((theme) => ({
            root: {
                '&:hover': {
                    backgroundColor: lightColor,
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                        color: theme.palette.common.white,
                    },
                },
            },
        }))(MenuItem);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        function handleLogOut() {
            console.log(localStorage.getItem('token'))
            const token = localStorage.getItem('token')
            localStorage.clear();
            logout(token);
            history.push('/home');
            window.location.reload();

        }

        return (
            <div>
                <Button color="inherit" >
                    <AddBoxIcon variant="h7" onClick={() => { history.push('/createRecipe') }} />
                </Button>
                <Button color="inherit" >
                    <ShoppingCartIcon variant="h7" onClick={() => { history.push('/foodbasket') }} />
                </Button>
                <Button color="inherit" >
                    <AccountCircleIcon variant="h7" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} />
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <StyledMenuItem onClick={
                        () => {
                            history.push({
                                pathname: '/profile',
                                state: { authorId: localStorage.getItem('userId') }
                            });
                        }
                    }>
                        <ListItemIcon className={classes.menuItem}>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="My Profile" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={handleLogOut}>
                        <ListItemIcon className={classes.menuItem}>
                            <ExitToAppIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Log out" />
                    </StyledMenuItem>
                </StyledMenu>
            </div>
        )
    }

    function handleWelcomePage(props) {
        history.push('/home');
    }

    return (
        <div style={{ marginBottom: '62px', zIndex: '99' }}>
            <AppBar position={'fixed'} >
                <Toolbar className={classes.navbar} >
                    <Typography variant="h4" className={classes.title} onClick={handleWelcomePage}>
                        MyRecipes
                    </Typography>
                    {localStorage.getItem('token') === null || props.flag ? null : <Search />}
                    {localStorage.getItem('token') === null ? <AuthTabs /> : <UserTabs />}
                </Toolbar>
            </AppBar>

        </div>
    )
}
