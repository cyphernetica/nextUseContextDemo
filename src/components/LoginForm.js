'use client'
import { UserContext } from "@/hooks/useUserContext";
import { useContext } from "react";
import { useRouter } from 'next/navigation';

export default function LoginForm(){
    const router = useRouter();
    const { toggleIsLogged } = useContext(UserContext);
    
    const doLogin = async (e) => {
        e.preventDefault();
        console.log('Do Login', e);
        console.log( e.target );
        const formData = new FormData(e.target);
        console.log( 'Autre façon de récupérer des data du form' , formData.get('company') );
        const responseLogin =  await fetch('/api/login',{
            method:'POST',
            body:JSON.stringify({
               'company': formData.get('company'),
               'email' : formData.get('email'),
               'password': formData.get('password')
            })
        });

        

       toggleIsLogged();
       router.push('/profile');
    }

    return (
        <form onSubmit={doLogin} method="POST">
            <div>
                <label className="block" htmlFor="company">Entreprise ID</label>
                <input className="border p-1  text-black" type="text" name="company" />
            </div>
            <div>
                <label className="block" htmlFor="email">E-mail</label>
                <input className="border p-1  text-black" type="email" name="email" />
            </div>
            <div>
                <label className="block" htmlFor="password">Password</label>
                <input className="border p-1  text-black" type="password" name="password" />
            </div>
            <div className="pt-4">
                <button className="border p-1">Login</button>
            </div>
        </form>
    )
}