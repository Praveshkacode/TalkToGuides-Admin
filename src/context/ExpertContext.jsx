import { createContext } from "react";

export const ExpertContext = createContext()

const ExpertContextProvider = (props) => {
    const value = {

    }
    return (
        <ExpertContext.Provider value={value}>
            {props.children}
        </ExpertContext.Provider>
    )
}

export default ExpertContextProvider;