'use client'
import LoginForm from "@/components/LoginForm";
import { useContext } from "react";
import { UserContext } from "./hooks/useUserContext";
import { Menu } from "./components/Menu";
export function App({children}){

    const {isLogged} = useContext(UserContext);
    console.log( 'isLogged ?' , isLogged);
    return (
        <>
            {!isLogged && <LoginForm />}
            {isLogged && <div><aside><Menu /></aside><div> {children} </div></div>}
        </>
    )
}