const net = require("net");

const port = 5000;

const handleConnection = (socket) => {
  console.log(`${socket.remoteAddress}:${socket.remotePort} Conectou.`);

  let hPoints = 0,
    pPoints = 0; // PLACAR DO JOGO.

  socket.on("data", (data) => {
    //FUNÇÃO QUE ATIVA AO RECEBER DADOS DO CLIENT.

    if ((data == 1) | (data == 2) | (data == 3)) {
      // SE O DADO RECEBIDO DO CLIENT NÃO FOR UM DESSES, É IGNORADO.
      const choices = ["Pedra", "Papel", "Tesoura"];

      // TRANSFORMA OS PALPITES DE NÚMEROS PARA PALAVRAS.
      let playerChoice = choices[parseInt(data.toString()) - 1];
      console.log(`Escolha do Jogador: ${playerChoice}`);
      let computerChoice = choices[1 + Math.floor(Math.random() * 3) - 1];
      console.log("Escolha do Server: " + computerChoice);

      const pWinCondition = [
        ["Pedra", "Tesoura"],
        ["Papel", "Pedra"],
        ["Tesoura", "Papel"],
      ]; //CONDIÇÕES DE VITÓRIAS.
      let result = [playerChoice, computerChoice]; // CRIA UM ARRAY COM O RESULTADO DAS JOGADAS.

      if (playerChoice == computerChoice) {
        //SITUAÇÃO DE EMPATE.
        socket.write(`O Jogador Escolheu: ${playerChoice}\nO Host: Escolheu ${computerChoice}\n`);
        socket.write("Empate!");
      } else {
        let count = 0; //

        for (condition of pWinCondition) {
          // LAÇO PARA ITERAR O ARRAY BINÁRIO.

          if (result == condition.toString()) {
            //SITUAÇÃO DE VITÓRIA DO JOGADOR.
            pPoints++;
            socket.write(`O Jogador Escolheu: ${playerChoice}\nO Host Escolheu: ${computerChoice}\n`);
            socket.write("Vitória do Jogador!");
            break;
          } else {
            count++;
            if (count == 3) {
              //SITUAÇÃO DE VITÓRIA DO SERVER.
              hPoints++;
              socket.write(`O Jogador Escolheu: ${playerChoice}\nO Host Escolheu: ${computerChoice}\n`);
              socket.write("Vitória do Host!");
            }
          }
        }
      }
      socket.write(`\n ------PLACAR------\nJogador: ${pPoints}\nHost: ${hPoints}\n`);
      socket.write("\nDeseja repetir? (S/N)");
    } else {
      socket.write("\nOpção Inválida! Deseja Repetir? (S/N)");
    }
  });

  socket.on("end", () => {
    console.log(`${socket.remoteAddress}:${socket.remotePort} Desconectou.`);
  });

  socket.on("error", (e) => {
    console.log(`Connection error:  ${socket.remoteAddress}:${socket.remotePort} ${e.message}`);
  });
};

const server = net.createServer(handleConnection);
// Cria um novo Servidor TCP. HandleConnection é um ouvinte que ativa automáticamente ao evento de "connection".

server.listen(port, () => {
  /*Começa aceitando conexões na porta e host especificada. 
    Se o host for omitido, o servidor aceitará conexões direcionadas para qualquer endereço IPv4 ( INADDR_ANY). */
  console.log("Server Online na porta " + port);
});
