var dataS = require('./data_structures.js');
/* Author: Melchor Dominguez & Andrew McDaniels
 * Version: 2016.10.23
 * A program that will generate a random text from it. The generated random
 * text must follow rules based on patterns in the text that is read.
 */

//Start Program Here.
var fs = require("fs");
var exports = module.exports = {};
//

//Checks for the correct length
if(process.argv.length < 2){
    console.log("Usage: node make_poem.js");
}//end if

//index for make_poem
//var index = 0;

/*
 * Reads the input file and generates a poem
 * @param input_txt - the name of the input text file
 * @param stz - number of stanzas in your output poem
 * @param lines - number of lines per stanza in your output poem
 * @param words - number of words per line in your output poem
 * @param probArray - an array of the probabilities we are assuming have been
 *                    generated for each of the words in the output poem
 * @param dataStruct - a boolean value which if true displays the values of
 *                     the four data structures (wordCount, wordFreq,
 *                     condWordCount, and condWordFreq). If the value is
 *                     anything but true, then do not display those values
 */
exports.main = function(input_txt, stz, lines, words){
    var fs = require("fs");
    var input = fs.readFileSync(input_txt, "utf8");
    if(dataS.wordCount(input) === false){
        return "Input can not be empty or only be whitespace";
    }
    return exports.makePoem(input, stz, lines, words);
}//end main

/*
 * Determines the first word to appear in the poem being generated. The
 * first word is determined randomly from all the words that appear in the
 * input text according to the algorithm.
 * @param input_txt - input that will be used to pick first word
 * @param probArray - probability array that will be used 
 */
exports.pickFirstWord = function(input_txt){
    var wordFreqOutput = dataS.wordFreq(input_txt);
    var ordered = [];
    
    Object.keys(wordFreqOutput).sort().forEach(function(key){
        ordered[key] = wordFreqOutput[key];
    });
    
    var numLine = [];
    var prevKey = 0; 
    
    for(var key in ordered){
        if(prevKey == 0){
            numLine[key] = ordered[key];
            prevKey = key;
          }else{
            numLine[key] = ordered[key] + numLine[prevKey];
            prevKey = key;
        }//end if else
    }//end for 

    
    var prob = Math.random();
    var word;

    for(var key in numLine){
        if(prob < numLine[key]){
            word = key;
        }//end if
    }//end for 
    return word; 

}//end pickFirst word

/*
 * Determines the next word to appear in the poem being generated. The
 * next word is depended on the previous word.
 * @param input_txt - nput that will be used to pick next word
 * @param probArray - probabbility array that will be used.
 * @pram ind - index for the probability array
 * @param prev - prev word that will determine the conditional words
 */
exports.pickNextWord = function(input_txt,prev){
    var condWordFreqOut = dataS.condWordFreq(input_txt);
    var condWord = condWordFreqOut[prev];
    var ordered = [];
    Object.keys(condWord).sort().forEach(function(key){
        ordered[key] = condWord[key];
    });
    
    var numLine = [];
    var prevKey = 0;

    for(var key in ordered){
        if(prevKey == 0){
            numLine[key] = ordered[key];
            prevKey = key;
        }else{
            numLine[key] = ordered[key] + numLine[prevKey];
            prevKey = key;
        }//end if else
    }//end for
   
    var prob = Math.random();
    var word;
   
    for(var key in numLine){
        if(prob < numLine[key]){
            word =key;
            break;
        }//end if
    }//end for 
   
    return word;
}//end pickNextWord

exports.makePoem = function(input_txt, stz, lines, words){
    var poem = new String();
    poem = "";
    var currentWord;
    var prevWord;
    for(n = 0; n < stz; n++){
        for(j = 0; j < lines; j++){
            for(k = 0; k < words; k++){
                if(k == 0 && j == 0){
                    currentWord = exports.pickFirstWord(input_txt);
                }else{
                    currentWord = exports.pickNextWord(input_txt, prevWord);
                }//end if-else
                poem += currentWord + " ";                
                prevWord = currentWord;          
            }//end words for
            poem += "\n";
            k = 0; 
        }//end lines for
        poem += "\n";
        j = 0;
    }//end stanza for
    return poem;
}
