import { createContext, useState } from 'react';

const ContextMenuContext = createContext({
 menu: null,
 setMenu: (newMenu:any) => {},
});

const ContextMenuProvider = ({ children } : {children:any}) => {
 const [menu, setMenu] = useState(null);

 return (
   <ContextMenuContext.Provider value={{ menu, setMenu }}>
     {children}
   </ContextMenuContext.Provider>
 );
};

export { ContextMenuContext, ContextMenuProvider };