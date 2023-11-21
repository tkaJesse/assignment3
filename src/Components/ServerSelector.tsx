

// define the props for ServerSelector

interface ServerSelectorProps {
    serverSelector: (buttonName: string) => void;
    serverSelected: string;
}


function ServerSelector({ serverSelector, serverSelected }: ServerSelectorProps) {


    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        return null;
    }


    //
    // the callback that will take the name of the button and called serverSelector
    function onButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
        const buttonName = event.currentTarget.innerText;
        serverSelector(buttonName);
    } // onButtonClick


    return (
        <div>
            <button id="localhost" onClick={onButtonClick}>localhost</button>
            <button id="renderhost" onClick={onButtonClick}>renderhost</button>
            current server: {serverSelected}
        </div>
    )
}

export default ServerSelector;