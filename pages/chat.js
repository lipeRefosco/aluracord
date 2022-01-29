import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json"
import {createClient} from "@supabase/supabase-js"

const URL_BANCO = "https://ewizjfkkpmecgevxkmto.supabase.co";
const URL_KEY_BANCO = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5OTY1OSwiZXhwIjoxOTU4OTc1NjU5fQ.ADsl5qkgSd7A4eQ2PHGx6ZotWuQlN5kDPvIzhq-f4Z8";

const supabaseCliente = createClient(URL_BANCO, URL_KEY_BANCO);

export default function ChatPage(){

    const [logedUserWrite, setLogedUserWrite] = React.useState('');
    const [chat, setChat] = React.useState([]);


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
                    maxHeight: '95vh',
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
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        padding: '1em',
                        borderRadius: '5px',
                        outline: `1px solid ${appConfig.theme.colors.neutrals[999]}`,
                    }}> {/* Container messages */}
                        
                        <AllMessages messages={chat} />

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

                                    // Cadastra na lista de mensagem
                                    // setChat([
                                    //     {
                                    //         from: 'lipeRefosco',
                                    //         message: logedUserWrite
                                    //     },
                                    //     ...chat
                                    // ]);

                                    sendMessage();

                                    // refreshChat();

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
        }, [logedUserWrite]);
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
            <Box tag="ul" styleSheet={{ display: 'flex', flexDirection: 'column-reverse', gap: '0.8em'}}>
                {props.messages.map( (message) => {
                    return <Message styleSheet={{
                        width: '100%'
                    }} key={message.id} date={message.created_at} from={message.from} message={message.message} />
                })}
            </Box>
        </>
    )
}

function Message(props){
    const from = props.from;
    const fromDate = props.date;
    const fromDateFormated = fromDate.slice(0,10);
    const fromMessage = props.message;
    const fromAvatar = `https://github.com/${from}.png`

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
                            display: 'inline'}}
                    />
                        {from}:
                    <Text styleSheet={{
                        fontSize: '0.7em',
                        color: appConfig.theme.colors.neutrals[100],
                        backgroundColor: appConfig.theme.colors.neutrals[800],
                        padding: '3px',
                        margin: '3px',
                        borderRadius: '5px'
                    }}>{fromDateFormated}</Text>
                </Text>
                
                <Text styleSheet={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {fromMessage}
                </Text>
            </li>
        </>
    )
}
