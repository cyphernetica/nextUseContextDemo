
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Issuer } from "openid-client";

export async function POST(requestFromBrowser){


    if( cookies().has('userdata') ){
        console.log( 'The token from the cookie' , cookies().get('userdata'));
    }
    
    

    const payloadFromBrowser = await requestFromBrowser.json();
    console.log( 'Payload/Body reçu' , payloadFromBrowser);
    let statusCode = 200;
    let bodyResponseToBrowser = {};
    if( payloadFromBrowser.company && payloadFromBrowser.company !=''){
        console.log('Fetch 1', `${process.env.API_URL_P2}/api/companiess?page=1&keycloak_realm=${payloadFromBrowser.company}`);
        const responseRequestEnterpriseExistInP2 = await fetch(`${process.env.API_URL_P2}/api/companiess?page=1&keycloak_realm=${payloadFromBrowser.company}`);
        
        //console.log( responseRequestEnterpriseExistInP2 );
    
        //if( responseRequestEnterpriseExistInP2.status === 200 ){
            const bodyEnterpriseExist = await responseRequestEnterpriseExistInP2.json();
            console.log( 'bodyEnterpriseExist ?' , bodyEnterpriseExist );
            //if( bodyEnterpriseExist['hydra:totalItems'] && bodyEnterpriseExist['hydra:totalItems'] == 1 ){
                //On a qu'une entreprise c'est bon'
    
                //doThe login on keyclaock
    
                const realm = payloadFromBrowser.company;
                console.log('Discover keycloack' , `${process.env.KEYCLOAK_URL}/realms/${realm}/.well-known/openid-configuration`);
                const issuer = await Issuer.discover(`${process.env.KEYCLOAK_URL}/realms/${realm}/.well-known/openid-configuration`);
                const client = new issuer.Client({
                    'client_id': 'looper', //harcoded in pilier2
                    'client_secret' : 'mysecret' , //harcoded in pilier2
                    'response_types' : ['code' , 'password']
                });
                

                const token = await client.grant({
                    'grant_type' : 'password' ,
                    'username' : payloadFromBrowser.email ,
                    'password' : payloadFromBrowser.password ,
                    'client_id' : 'looper' ,
                    'client_secret' : 'mysecret',
                    'scope' : 'looper profile microprofile-jwt openid' 
                });

                console.log( 'The token' , token );
                console.log('****************************************************');
                console.log(  token.access_token );
                console.log('****************************************************');
                
                //console.log( 'The user data' , token.claims() );
                //if( token.id_token){
                    console.log( 'The token ID' , token.claims() );
                //}
                console.log( token.claims());

                //httpOnly permet de ne bloquer l'accès au cookie dans le browser
                cookies().set('accesstoken' , JSON.stringify( token.access_token ), { secure: true, httpOnly:true , path:'/' , sameSite:'lax'} );
                //pour les data user je les mets accessible dans le browser
                cookies().set('userdata' , JSON.stringify( token.claims() ), { secure: true, httpOnly:false , path:'/' , sameSite:'lax'} );
    
            //}
        //}
        
    
    }
    
    

    //const responseFromApiP3 = await fetch('')keycloak_realm=pie-6659b9bbb9e62


    return new NextResponse({} , {status:200});
}

