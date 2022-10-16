const net = require("net");
const readline = require("readline");

const client = new net.Socket(); // CRIA UM NOVO OBJETO SOCKET.
client.connect(5000, () => {
  //CRIA UMA CONEXÃO TCP, COM PORT E HOST E UMA FUNÇÃO DE CALLBACK.
  // CASO O ENDEREÇO SEJA OMITIDO, TERÁ COMO PADRÃO "LOCALHOST".
  console.log("Conexão Aceita!");

  const rl = readline.createInterface({
    //MÓDULO RESPONSÁVEL PELA ENTRADA E SAÍDA DE DADOS.
    input: process.stdin,
    output: process.stdout,
  });

  const game = () => {
    rl.question("Escolha entre: \n1 - Pedra \n2 - Papel \n3- Tesoura \n", (answer) => {
      client.write(answer);
    });

    client.removeAllListeners("data"); //REMOVE OS EVENTOS DE DADOS ANTERIORES.

    client.on("data", (data) => {
      //FUNÇÃO QUE ATIVA AO RECEBER DADOS DO SERVIDOR.
      console.log(data.toString());
    });
  };

  game();

  rl.addListener("line", (line) => {
    //OUVINTE DE EVENTOS QUE ATIVA AO ENVIAR UMA LINHA.

    if (line.toUpperCase() == "S") {
      //REINICIA O JOGO.
      game();
    } else if (line.toUpperCase() == "N") {
      // FECHA A CONEXÃO.
      client.end();
    }
  });

  client.on("close", () => {
    console.log("Conexão Encerrada.");
  });
});
