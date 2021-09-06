import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuBar from './components/menu';
import { lightColor, thinColor } from './components/styles';
import { useHistory, useLocation } from 'react-router';
import { getUserInfo, getRecipeList, postSub, deleteSub } from './components/api';
import Divider from '@material-ui/core/Divider';
import RecipeReviewCard from './components/recipesCard';
import ICON1 from '../images/addnew.png'


function UserInfo({ userInfo, isOwn, profileId }) {
    const localStyle = makeStyles((theme) => ({
        root: {
            width: '100%',
            height: '300px',
            display: 'flex',
            justifyContent: "space-around",
            alignItems: 'center',
        },
        avatar: {
            display: 'flex',
            width: '15%',
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
        information: {
            display: 'flex',
            height: '162px',
            width: '70%',
            justifyContent: 'flex-start',
            "& > div ": {
                flexDirection: 'column',
                marginLeft: '50px',
            }

        },
        nickname: {
            color: '#212121',
            fontFamily: 'Merriweather',
            fontSize: '3em',
            justifyContent: 'flex-start',
            marginBottom: '20px'
        },
        email: {
            fontFamily: 'Raleway, sans-serif',
            fontSize: '1em',
            fontWeight: "600",
            color: 'grey',
            marginBottom: '20px'
        },
        editSession: {
            width: "15%",
            height: "162px",
            display: 'flex',
            '& > div': {
                width: '60px',
                fontWeight: '600',
                color: 'white',
                height: '40px',
                backgroundColor: lightColor,
                textAlign: 'center',
                lineHeight: '40px',
                border: '2px solid ' + lightColor,
                borderRadius: '10px',
                boxShadow: "1px 2px 2px gray",
                '&:hover': {
                    cursor: 'pointer'
                },

            }
        },
        subscribe: {
            width: "180px",
            height: "162px",
            display: 'flex',
            '& > div': {
                width: '110px',
                fontWeight: '600',
                height: '40px',
                textAlign: 'center',
                lineHeight: '40px',
                // border: '2px solid rgb(49,53,153)',
                borderRadius: '10px',
                boxShadow: "1px 2px 2px gray",
                '&:hover': {
                    cursor: 'pointer'
                },

            }
        }

    }))
    const c = localStyle();
    const history = useHistory();
    // const token = localStorage.getItem('token')
    console.log(userInfo)
    const [name, setName] = useState("")
    const [char, setChar] = useState("")
    const [email, setEmail] = useState("")
    const [followed, setFollowed] = useState(0);
    const [following, setFollowing] = useState(0);
    const [isSub, setIsSub] = useState(false)

    useEffect(() => {
        if (userInfo["nick_name"]) {
            console.log(userInfo)
            setName(userInfo["nick_name"])
            setChar(userInfo["nick_name"].charAt(0).toUpperCase())
            setEmail(userInfo["email"])
            setFollowed(userInfo["followed_count"])
            setFollowing(userInfo["following_count"])
            setIsSub(userInfo['is_subscribed'])
        }
    }, [userInfo])

    return (
        <div className={c.root}>
            <div className={c.avatar}>
                <div>
                    {char}
                </div>
            </div>
            <div className={c.information}>
                <div>
                    <div className={c.nickname}>
                        {name}
                    </div>
                    <div className={c.email}>
                        {email}
                    </div>
                    <div style={{ fontSize: '1.3rem' }}>
                        <span style={{ marginRight: "50px" }} > {following} following  </span>
                        <span>{followed}  followers  </span>
                    </div>
                </div>

            </div>
            {isOwn ?
                <div className={c.editSession} onClick={() => { history.push('./editMyProfile') }}>
                    <div>
                        Edit
                    </div>
                </div>
                :
                isSub ?
                    <div className={c.subscribe} >
                        <div style={{ backgroundColor: "rgb(243,245,231)", color: 'gray', }}
                            onClick={() => deleteSub(localStorage.getItem('token'), profileId).then(
                                setIsSub(false),
                                setFollowed(followed - 1)
                            )}>
                            Subscribed
                        </div>
                    </div> :
                    <div className={c.subscribe} >
                        <div style={{ backgroundColor: thinColor, color: "white" }}
                            onClick={
                                () => postSub(localStorage.getItem('token'), profileId).then(
                                    setIsSub(true),
                                    setFollowed(followed + 1)
                                )}>
                            Subscribe
                        </div>
                    </div>
            }
        </div>
    )
}

function CreateNewRecipe() {
    const localStyle = makeStyles((theme) => ({
        root: {
            width: '385px',
            height: '402px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
                cursor: 'pointer'
            },
            // marginRight: '30px'
        },
        create: {
            width: '250px',
            height: '290px',
            border: '2px dashed ' + lightColor,
            backgroundColor: "rgb(243,245,231)",
            borderRadius: '10px',
            boxShadow: "1px 2px 2px gray",

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            marginTop: '38px',
            fontWeight: '600',
            fontFamily: 'Raleway, sans-serif',
            fontSize: '1.3rem',
            color: 'rgb(49,53,153)'
        }

    }))

    const c = localStyle();
    const history = useHistory();

    return (
        <div className={c.root}>
            <div className={c.create} onClick={() => { history.push('./createRecipe') }}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '20%', textAlign: 'center', height: '20%' }}>
                    {/* <div>Icons made by <a href="https://www.flaticon.com/authors/xnimrodx" title="xnimrodx">xnimrodx</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> */}
                    <img src={ICON1} alt="icon" />

                </div>
                <div className={c.text} >
                    Create a new recipe
                </div>
            </div>
        </div>
    )
}

function MyPublichedRecipes({ allRecipeList, isOwn }) {
    const localStyle = makeStyles((theme) => ({
        thumbnailContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
        }
    }))

    const c = localStyle();

    return (
        <div className={c.thumbnailContainer}>
            {isOwn ? <CreateNewRecipe /> : null}
            {allRecipeList.map((item, index) => {
                const { recipe_title, updated, photo, recipe_id, created_by_user_id, author_name, like_count, is_liked } = item;
                const editInfo = allRecipeList.filter((item) => item.recipe_id === recipe_id)
                console.log(editInfo)
                return (
                    <div key={index} flexDirection='column'>
                        <RecipeReviewCard key={index}
                            recipe_id={recipe_id}
                            recipe_title={recipe_title}
                            photo={photo}
                            created_by_user_id={created_by_user_id}
                            author_name={author_name}
                            like_count={like_count}
                            is_liked={is_liked}
                            updated={updated}
                            isProfile={true}
                        />
                    </div>
                )
            })
            }
        </div>
    )
}




export default function Profile() {
    const localStyle = makeStyles((theme) => ({
        root: {
            display: 'flex',
            justifyContent: 'center',

        },
        profileContainer: {
            width: '80%',
            height: '100%',
            MaxWidth: "600px",
        }
    }))

    const c = localStyle();
    const location = useLocation();
    const authorId = location.state.authorId;
    // const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const isOwn = (userId === authorId)
    const profileId = isOwn ? userId : authorId
    const [profileInfo, setProfileInfo] = useState({})
    const [allRecipeList, setAllRecipeList] = useState([])


    useEffect(() => {
        getUserInfo(localStorage.getItem('token'), profileId).then((info) => {
            setProfileInfo(info[0]);
        }).catch((err) => {
            console.log("get user info err: " + err);
        })

        getRecipeList(localStorage.getItem('token'), profileId).then((info) => {
            setAllRecipeList(info);
            console.log('output the recipe', info);
        }).catch((err) => {
            console.log("get recipelist error: " + err);
        })
    }, [profileId])

    return (
        <div>
            <MenuBar />
            <div className={c.root}>
                <div className={c.profileContainer}>
                    <UserInfo userInfo={profileInfo} isOwn={isOwn} profileId={profileId} />
                    <Divider variant="middle" />
                    <MyPublichedRecipes allRecipeList={allRecipeList} isOwn={isOwn} />
                </div>
            </div>
        </div>
    )

}
