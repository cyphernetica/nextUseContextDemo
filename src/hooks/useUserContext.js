'use client'
const { createContext, useState } = require("react");

export const UserContext = createContext({
    isLogged: false ,
    toggleIsLogged: () => {}
});

export function UserContextProvider({children}){
    const [isLogged, setIsLogged] = useState(false);
  
    const toggleIsLogged = ()=> {
        console.log('Toggle')
      setIsLogged(!isLogged);
    }
    return <UserContext.Provider value={{
        isLogged,
        toggleIsLogged
    }}>
          <button className="border p-1" onClick={toggleIsLogged}>toggleIsLogged</button>
        {children}
    </UserContext.Provider>
}