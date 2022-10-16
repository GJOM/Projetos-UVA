var readlineSync = require('readline-sync');
let option, operation, zFlag = 0, sFlag = 0, cFlag = 0, regA, regB, PC = 0; // Zero Flag, Sign Flag, Carry Flag.
let byteArr_A = [], byteArr_B = [], arrF = [];

do {
    console.log(`\n    1. Definir Registrador A
    2. Definir Registrador B
    3. Ler Registrador A (Acc)
    4. Ler Registrador B
    5. Ler Registrador de flags
    6. Definir operação
    7. Executar ULA
    8. Sair`);

    option = readlineSync.questionInt();
    switch (option) {
        case 1:
            regA = parseInt(readlineSync.question("Defina o Valor do Acumulador A:  "));
            break;
        case 2:
            regB = parseInt(readlineSync.question("Defina o Valor do Registrador B:  "));
            break;
        case 3:
            if( regA > 0){
            console.log("Acumulador A: ", transformTo8Bit(regA.toString(2))); // transforma o valor em binário.
            } else {
                console.log("Acumulador A: ", negativeNumber(regA));
            }
            break;
        case 4:
            if( regB > 0){
                console.log("Acumulador B: ", transformTo8Bit(regB.toString(2))); // transforma o valor em binário.
                } else {
                    console.log("Acumulador B: ", negativeNumber(regB));
                }
            break;
        case 5:
            console.log(`Zero Flag: ${zFlag} \nCarry Flag: ${cFlag} \nSign Flag: ${sFlag}`);
            break;
        case 6:
            operation = parseInt(readlineSync.question(`Escolha um tipo de operação: \n 1. Soma \n 2. Subtracao \n 3. Maior que \n 4. Menor que \n 5. Igual \n 6. Incremento \n 7. Decremento \n 8. AND \n 9. OR \n 10. XOR \n`));
            break;
        case 7:
            let bA = regA.toString(2), bB = regB.toString(2);

            function binaryArr(arg, arrType, argCount) {
                for (let i = 0; i < argCount.length; i++) {

                    arrType.push(Number(arg.substring(i, i + 1))) // cria um array de números dos valores armazenados no registrador A e B em binário.

                }

                return arrType.reverse()
            }

            if (regA > regB) { // O maior valor será utilizado como índex do loop for.

                binaryArr(bA, byteArr_A, bA)
                binaryArr(bB, byteArr_B, bA)

            } else {

                binaryArr(bA, byteArr_A, bB)
                binaryArr(bB, byteArr_B, bB)

            }

            switch (operation) {
                case 1:
                    regA += regB;
                    break;
                case 2:
                    regA = regA - regB;
                    break;
                case 3:
                    if (regA - regB > 0) {
                        sFlag++;
                    } else {
                        sFlag = 0;
                    }
                    break;
                case 4:
                    if (regA - regB < 0) {
                        sFlag++;
                    } else {
                        sFlag = 0;
                    }
                    break;
                case 5:
                    if (regA - regB == 0) {
                        zFlag = 1;
                    } else {
                        zFlag = 0;
                    }
                    break;
                case 6:
                    regA++;
                    break;
                case 7:
                    regA--;
                    break;
                case 8:
                    for (let i = 0; i < byteArr_B.length; i++) {
                        arrF.push(byteArr_B[i] + byteArr_A[i]) // cria um novo array com a soma dos arrays anteriores.
                        if (arrF[i] == 2) { // lógica AND (1 + 1 = 1 | 0 + 0 = 0 | 1 + 0 = 0)
                            arrF[i] = 1
                        } else {
                            arrF[i] = 0
                        }
                    }

                    regA = arrF.join(""); // transforma o array em string.
                    break;
                case 9:
                    for (let i = 0; i < byteArr_B.length; i++) {

                        arrF.push(byteArr_B[i] + byteArr_A[i]) // cria um novo array com a soma dos arrays anteriores.
                        if (arrF[i] != 0) { // lógica OR (1 + 1 = 1 | 0 + 0 = 0 | 1 + 0 = 1)
                            arrF[i] = 1
                        }
                        regA = arrF.join(""); // transforma o array em string.
                    }
                    break;
                case 10:
                    for (let i = 0; i < byteArr_B.length; i++) {

                        arrF.push(byteArr_B[i] + byteArr_A[i]) // cria um novo array com a soma dos arrays anteriores.
                        if (arrF[i] != 1) { // lógica XOR (1 + 1 = 0 | 0 + 0 = 0 | 1 + 0 = 1)
                            arrF[i] = 0
                        }
                        regA = arrF.join(""); // transforma o array em string.
                    }
                    break;
                default:
                    console.log("Error!");
                    break;
            }

            arrF = [], byteArr_A = [], byteArr_B = [];

            if (regA >= 256) { // Carry Flag recebe o dígito que da maior casa, que supere o valor 255 (8 bits) após a execução da operação.
                regA = regA.toString(2).substring(1);
                cFlag = regA.toString(2).substring(0, 1);  // Deixando subentendido que para atingir o valor correto, será necessário a concatenação dos valores da Carry Flag e do Acumulador.
            } else {
                cFlag = 0;
            }

            (regA >= 128 ? sFlag = 1 : sFlag = 0); // bit mais significativo em uma representação de 8-bits.

            (regA < 0 ? sFlag = 1 : sFlag = 0); // O valor após a operação deu negativo.
            break;
        case 8:
            console.log('PC:', PC)
            console.log("Desligando...");
            break;
        default:
            console.log("Inválido!");
    }

    function transformTo8Bit(register) {

        for (let i = 0; i < 8; i++) {
        
            if (register.length < 8) {
        
                console.log(register)
                register = '0' + register;
        
            };
        };

        return register;
    }

    function negativeNumber(number){
        
        return (number >>> 0).toString(2).split('').slice(24,32).join('');

    }

    PC++;

} while (option != 8);