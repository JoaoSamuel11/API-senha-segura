const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { INTEGER } = require("sequelize");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/verify",(req,res)=>{
    var password = req.body.password; 
    var rules = req.body.rules;

    // variaveis que vou retornar na resposta
    var verify = true;
    var nomatch = [];

    // variaveis contendo os caracteres usados na verificação
    var letrasMaiusculas = /[A-Z]/;
    var letrasMinusculas = /[a-z]/; 
    var numeros = /[0-9]/;
    var caracteresEspeciais = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

    // variaveis que vou usar pra salvar as quantidades de caracteres cada verificação possui
    var qtdMaiusculas = 0;
    var qtdMinusculas = 0;
    var qtdNumeros = 0;
    var qtdCaracteresEspeciais = 0;
    var qtdRepetidos = 0;


    // nesse primeiro looping eu faço a contagem de quantas letras minusculas, maiusculas, 
    // caracteres especiais e numeros a senha possui 
    for(var i=0; i<password.length; i++){   
        if(letrasMaiusculas.test(password[i])){
            qtdMaiusculas++;
        }

        else if(letrasMinusculas.test(password[i])){
            qtdMinusculas++;
        }

        else if(numeros.test(password[i])){
            qtdNumeros++;
        }

        else if(caracteresEspeciais.test(password[i])){
            qtdCaracteresEspeciais++;
        }

        if(i>=1){
            if(password[i] == password[i-1]){
                qtdRepetidos++;
            }
        }
        
    }

    // nesse loop eu faço as comparações e caso alguma regra seja quebrada eu adiciono o nome do erro no array "nomatch"
    // e o verify 
    rules.forEach(element => { 
        if(element.rule == "minSize"){
            if(password.length < element.value){
                verify = false;
                nomatch.push('minSize');
            }
        }

        if(element.rule == "noRepeted"){
           if(qtdRepetidos > element.value){
                verify = false;
                nomatch.push('noRepeted');
           }
        }

        if(element.rule == "minUppercase"){
            if(qtdMaiusculas < element.value){
                verify = false;
                nomatch.push('minUppercase');
            }
        }

        if(element.rule == "minLowercase"){
            if(qtdMinusculas < element.value){
                verify = false;
                nomatch.push('minLowercase');
            }
        }

        if(element.rule == "minDigit"){
            if(qtdNumeros < element.value){
                verify = false;
                nomatch.push('minDigit');
            }
        }

        if(element.rule == "minSpecialChars"){
            if(qtdCaracteresEspeciais  < element.value){
                verify = false;
                nomatch.push('minSpecialChars');
            }
        }
    });

    var response = [verify , nomatch]; 
    res.json(response);
    
});

app.listen(8080, ()=>{});