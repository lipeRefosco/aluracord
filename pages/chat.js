import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import {createClient} from "@supabase/supabase-js";
import bd from "../bd.json"

const URL_BANCO = bd.URL_BANCO;
const URL_KEY_BANCO = bd.URL_KEY_BANCO;

const supabaseCliente = createClient(URL_BANCO, URL_KEY_BANCO);

export default function ChatPage(){

    const [logedUserWrite, setLogedUserWrite] = React.useState('');
    const [chat, setChat] = React.useState([]);
    const [userFocusModal, setUserFocusModal] = React.useState('');
    // const transport = setUserFocusModal;
    console.log(userFocusModal);

    refreshChat();

    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    backgroundColor: appConfig.theme.colors.neutrals[300],
                    backgroundImage: 'url(https://wallpapercave.com/wp/ATujZnh.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'multiply',
            }}> {/* Box com o fundo */}

                <Box styleSheet={{
                    maxWidth: '90%',
                    height: '95vh',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1', 
                    backgroundColor: appConfig.theme.colors.neutrals[500],
                    padding: '3%',
                    borderRadius: '5px',
                    outline: `1px solid ${appConfig.theme.colors.neutrals[800]}`,
                }}> {/* Container all chat */}
                    

                    <Header/> {/* Header da página com o botão de logout */}

                    <Box styleSheet={{
                        height: '95%',
                        minHeight: '775px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        padding: '1em',
                        borderRadius: '5px',
                        // outline: `1px solid red`,
                        position: 'relative',
                        outline: `1px solid ${appConfig.theme.colors.neutrals[999]}`,
                    }}> {/* Container messages */}

                        <AllMessages offScope={setUserFocusModal} messages={chat} />

                        <TextField value={logedUserWrite}
                            type="textarea"
                            placeholder="Digite sua mensagem"
                            styleSheet={{
                                    marginTop: '10px',
                                    backgroundColor: appConfig.theme.colors.neutrals[500],
                                    borderColor: appConfig.theme.colors.neutrals[700],
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

                                    sendMessage();

                                    // Limpa o campo de texto
                                    setLogedUserWrite('');
                                }
                            }}
                        ></TextField>
                    </Box> {/* End container messages */}

                </Box>{/* End container all chat */}

            </Box>
        </>
    )

    function refreshChat(){
        React.useEffect(() =>{
            supabaseCliente
            .from("mensagens")
            .select("*")
            .order("id", { ascending: false })
            .then( ({data}) => {
                console.log(data)
                setChat(data)
            });
        }, []);
    }

    function sendMessage(){
        supabaseCliente.from("mensagens")
                       .insert([
                           {from: "lipeRefosco", message: logedUserWrite}
                       ])
                       .then(() => {
                            console.log('Mensagem cadastrada!');
                       })
    }

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
            <Box tag="ul" styleSheet={{
                display: 'flex',
                flex: '1',
                flexDirection: 'column-reverse',
                gap: '0.8em',
                overflow: 'scroll',
            }}>
                {props.messages.map( (message) => {
                    return <Message
                        offScope={props.offScope}
                        styleSheet={{
                            width: '100%'
                        }}  
                        key={message.id}
                        date={message.created_at}
                        from={message.from}
                        message={message.message} />
                })}
            </Box>
        </>
    )
}

function Message(props){
    const from = props.from;
    const fromFullDate = props.date.replace("T"," ").replace(/[A-z]/,"").slice(0,16);
    const fromDate = fromFullDate.slice(0,10);
    const fromTime = fromFullDate.slice(11)
    const fromMessage = props.message;
    const fromAvatar = `https://github.com/${from}.png`

    const transportInScope = props.offScope
    console.log('Message Coponent', transportInScope)

    return (
        <>
            <li>
                
                <Text styleSheet={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Image src={fromAvatar} alt={from}
                        styleSheet={{
                            height: '20px',
                            borderRadius: '50%',
                            marginRight: '5px',
                            display: 'inline'
                        }}
                        onClick={() => {
                            transportInScope(from)
                        }}
                    />
                        {from}:
                </Text>
                
                <Text styleSheet={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Text styleSheet={{
                        fontSize: '0.7em',
                        color: appConfig.theme.colors.neutrals[100],
                        backgroundColor: appConfig.theme.colors.neutrals[800],
                        padding: '3px',
                        margin: '3px',
                        borderRadius: '5px'
                    }}>{fromDate} {fromTime}</Text>
                    <Text
                        styleSheet={{
                            marginLeft: '6px'
                        }}>{fromMessage}</Text>
                </Text>
            </li>
        </>
    )
}