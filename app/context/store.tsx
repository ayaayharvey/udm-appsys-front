'use client'
import {createContext, useContext, Dispatch, SetStateAction, useState, ReactNode} from 'react';

type DataType = {
  fullname: string,
  address: string,
  phone: string,
  avatar: Buffer | null
}

interface ContextProps {
  userId: string,
  isAuthenticated: boolean,
  isProfileComplete: boolean,
  profile: DataType[],
  setUserId: Dispatch<SetStateAction<string>>,
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
  setIsProfileComplete: Dispatch<SetStateAction<boolean>>,
  setProfile: Dispatch<SetStateAction<DataType[]>>
}

const GlobalContext = createContext<ContextProps>({
  userId: '',
  setUserId: (): string => '',
  isAuthenticated: false,
  setIsAuthenticated: (): boolean => false,
  isProfileComplete: false,
  setIsProfileComplete: (): boolean => false,
  profile: [],
  setProfile: (): DataType[] => []
})

export const GlobalContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profile, setProfile] = useState<[] | DataType[]>([]);

  return (
    <GlobalContext.Provider value={{userId, setUserId, isAuthenticated, setIsAuthenticated, isProfileComplete, setIsProfileComplete, profile, setProfile}}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext);