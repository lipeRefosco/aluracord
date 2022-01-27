import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json"

export default function ChatPage(){

    const [logedUserWrite, setLogedUserWrite] = React.useState('');
    const [chat, setChat] = React.useState([]);

    return (
        <>
            <Box
                styleSheet={{
                    
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    backgroundColor: appConfig.theme.colors.neutrals[300],
                    backgroundImage: 'url(https://wallpapercave.com/wp/ATujZnh.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
            }}> {/* Box com o fundo */}

                <Box styleSheet={{
                    maxWidth: '90%', maxHeight: '95vh',
                    display: 'flex', flexDirection: 'column', flex: '1', 
                    backgroundColor: appConfig.theme.colors.neutrals[500],
                    padding: '3%', borderRadius: '5px',
                    outline: `1px solid ${appConfig.theme.colors.neutrals[800]}`,
                }}> {/* Container all chat */}
                    

                    <Header/> {/* Header da página com o botão de logout */}

                    <Box tag="ul" styleSheet={{
                        overflow: 'visible',
                        display: 'flex', flexFlow:'column-reverse',
                        alignItems: 'flex-end',gap:'16px',
                        borderRadius: '5px',
                        overflow: 'scroll',
                        // outline: `1px solid ${appConfig.theme.colors.neutrals[999]}`,
                    }}> {/* Container messages */}
                        
                        <AllMessages messages={chat} />

                    </Box> {/* End container messages */}

                    <TextField value={logedUserWrite} type="textarea"
                        placeholder="Digite sua mensagem"
                            styleSheet={{
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                borderColor: appConfig.theme.colors.neutrals[999],
                                color: 'white',
                        }}
                        onChange={props => {
                            const dataInserted = props.target.value
                            setLogedUserWrite(dataInserted);
                        }}
                        onKeyPress={props => {
                            const key = props.key;
                            if(key === 'Enter'){
                                props.preventDefault();

                                // Cadastra na lista de mensagem
                                setChat([
                                    {
                                        id: chat.length + 1,
                                        from: 'lipeRefosco',
                                        message: logedUserWrite
                                    },
                                    ...chat
                                ]);

                                // Limpa o campo de texto
                                setLogedUserWrite('');
                                console.log('Mensagem cadastrada!');
                            }
                            console.log(chat)
                        }}
                    ></TextField>

                </Box>{/* End container all chat */}

            </Box>
        </>
    )
}

function Header(){
    return (
        <>
            <Box styleSheet={{
                width: '100%',
                display: 'flex', justifyContent: 'space-between', alignItems:'center',
                marginBottom: '16px'
            }}>
                <Text variant='heading5'>Chat</Text>

                <Button label="Logout" buttonColors={{
                    mainColor: appConfig.theme.colors.primary[500],
                }} colorVariant="dark"></Button>
            </Box>
        </>
    )
}

function AllMessages(props){
    return(
        <>
            {props.messages.map( (message) => {
                return <Message key={message.id} from={message.from} message={message.message} />
            })}
            
        </>
    )
}

function Message(props){
    const from = props.from;
    const message = props.message;
    const srcMessage = `https://github.com/${from}.png`
    
    return (
        <>
            <li>
                <Image src={srcMessage} alt={from}
                    styleSheet={{ width: '25px', borderRadius: '50%', marginRight: '5px'}}
                />
                <Text styleSheet={{marginRight: '5px'}}>{from}:</Text>
                <Text>{message}</Text>
            </li>
            <style jsx>{`
                li {
                    width: 100%;
                    display: flex;
                    align-items: center;
                }
            `}</style>
        </>
    )
}