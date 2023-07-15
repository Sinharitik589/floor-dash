
//The Landing component for users

import React, { useEffect, useState } from 'react'
// import { PublicClientApplication } from '@azure/msal-browser';
import Main from './Main';
import axios from "axios"
import Loader from "../Components/Loader"
// const config = {
//     appId: process.env.APP_ID,
//     redirectUri: process.env.REACT_APP_REDIRECT_URI,
//     scopes: [process.env.REACT_APP_AUTH_SCOPE],
//     authority: process.env.AUTHORITY
// }

const Auth = () => {

    let [user, setUser] = useState({});
    let [isAuthenticated, setAuthenticated] = useState(null)
    let [bus, setBus] = useState([]);
    let [isAdmin] = useState(false)

    //Will fetch all the BU values from backend 
    const getBus = async () => {
        try {
            let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/allBUs`, {
                accessToken: (user.accessToken) ? user.accessToken : ""
            });
            let arr = res.data;
            setBus([...arr])
            console.log(bus, "is bus");
        }
        catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        //checking if the role has been set to admin
        if (isAdmin) {
            let new_user = Object.assign({}, user);
            let myBus = []
            for (let x in bus) {
                myBus.push({ BU: bus[x], PREMISHION: "Update" })
            }//pushing all the bus with update permission to myBus
            new_user.myBUs = myBus;
            setUser(new_user);//updating the user state
        }
    }, [isAdmin, bus])

    // const publicClientApplication = new PublicClientApplication({
    //     auth: {
    //         clientId: config.appId,
    //         redirectUri: config.redirectUri,
    //         authority: config.authority
    //     },
    //     cache: {
    //         cacheLocation: "sessionStorage",
    //         storeAuthStateInCookie: true
    //     }
    // });

    useEffect(() => {

        getBus();
        Login();
    }, [])

    //Function for authentication
    const Login = async () => {
        try {
            // var accessToken = await publicClientApplication.loginPopup(
            //     {
            //         scopes: config.scopes,
            //         prompt: "select_account"
            //     });

            var accessToken = "1234";
            if (accessToken) {
                // const myDecodedToken = decodeToken(accessToken.accessToken);
                // const isMyTokenExpired = isExpired(accessToken.accessToken);
                const isMyTokenExpired = false;//Comment this out when setting oauth
                if (!isMyTokenExpired) {
                    // var premishenrole;
                    // var myBUS = [];
                    let value = true;
                    if (/* accessToken.idTokenClaims.roles */ value) {
                        // let arr = accessToken.idTokenClaims.roles.map(x => {
                        //     if (x.includes("DpUI_")) {
                        //         var myArr = x.split("_");
                        //         if (myArr[1].includes("Admin")) {
                        //             setAdmin(true)//if the role is admin toggle admin state to true
                        //         }
                        //         else {
                        //             setAdmin(false);
                        //             return myBUS.push({ BU: myArr[2], PREMISHION: myArr[1] });
                        //         }
                        //     }
                        // });
                        // user = {
                        //     name: myDecodedToken.name,
                        //     ID: myDecodedToken.upn,
                        //     accessToken: accessToken.accessToken,
                        //     myBUs: myBUS,
                        //     premishens: premishenrole
                        // }


                        // setAdmin(true)
                        user = {
                            name: "Lavan pnina",
                            ID: "ex_lavan.pnina@corp.zim.com",
                            myBUs: [{
                                BU: "ATL", PREMISHION: "Update"
                            }, {
                                BU: "LAT", PREMISHION: "Read"
                            }],
                            accessToken
                        }
                        console.log(bus, "are bus")
                        setUser(user);
                        setAuthenticated(true);
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            setAuthenticated(false)
        }
    }
    return (
        <>
            {
                //Renders Components according to auth state
                (isAuthenticated != null) ? (!isAuthenticated) ? <button>Login</button> : <Main bus={bus} user={user} isAdmin={isAdmin} /> : <div className="vh-100 vw-100"><Loader /></div>
            }
        </>)
}


export default Auth;