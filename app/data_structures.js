/* Author: Melchor Dominguez
 * Version: 2016.9.30
 * A program that will construct several data structures given a sequence
 * of words.
 */

//Start Program Here.



//reads the input file
var fs = require("fs");
var exports = module.exports = {};
/*
 * For each word in the input word sequence has the number of occurrences of 
 * that word
 * @param input_txt - text to get word count from
 * @return - returns array with word count
 * @return - false if whitespace
 */
exports.wordCount = function(input_txt){
    ///split the input file by whitespace
    var rawData = input_txt.split(/[ \r]/);

    //trims the data stored in rawData
    for(i = 0; i < rawData.length; i++){
        rawData[i] = rawData[i].trim();
    }//end for

    var newInd = 0;
    var newData = new Array();
    for(i = 0; i < rawData.length; i++){
        if(rawData[i] !== ''){
            newData[newInd] = rawData[i];
            newInd++;
        }//end if
    }//end for
    if(newData.length <= 1){
        return false;
    }//checks for empty file` 
    
    
    //Create an array for key-value pairs
    var wordArray = {};
    
    //store array with values
    for(i = 0; i < newData.length; i++){
        if(newData[i] in wordArray){
            wordArray[newData[i]]++;
        }else{
            wordArray[newData[i]] = 1;
        };//end if
    }//end for
    return wordArray;
}//end wordCount

/*
 * That for each word in the input word sequence had the percentage
 * (that is, the probability or frequency) of all the word occurrences in
 * the input word sequence that are occurrences of this word
 * @param input_txt - text to get word frequency from
 * @return - returns array with word frequency
 */
exports.wordFreq = function(input_txt){
    var wordCountOutput = exports.wordCount(input_txt);
    var total = 0;
    for(key in wordCountOutput){
        total += wordCountOutput[key];
    }//end for
    var wordFreqOut = {};
    for(key in wordCountOutput){
        wordFreqOut[key] = wordCountOutput[key] / total;
    }//end for
    return wordFreqOut;
}//end wordFreq()

/*
 * For each word A in the input word sequence has a object that is a series of
 * key-value pairs in which the ky is a word B that ocurs at least once as the
 * word immediately following the word A and the value is the number of times 
 * the word B immediately follows the word A
 * @param - text input to determine conditional word count
 */
exports.condWordCount = function(input_txt){
    var rawData = input_txt.split(/[ \r]/);
    for(i = 0; i < rawData.length; i++){
        rawData[i] = rawData[i].trim();
    }//end for
    var newInd = 0;
    var newData = new Array();
    for(i = 0; i < rawData.length; i++){
        if(rawData[i] !== ''){
            newData[newInd] = rawData[i];
            newInd++;
        }//end if
    }//end for
    var wordArray = {};
    for(i = 0; i < newData.length; i++){
        var first = newData[i];
        var j = i+1;
        if(i == newData.length - 1){
            j = 0;
        }//end if
        var second = newData[j];
        if(first in wordArray){
            if(second in wordArray[first]){
                wordArray[first][second] += 1;
            }else{
                wordArray[first][second] = 1;
            }
        }else{
            wordArray[first] = {};
            wordArray[first][second] = 1;
        }
    }//end for

    return wordArray;
}//end condWordCount()

/*
 * For each word A in the input word sequence has an object that is a series
 * of key-value pairs in which the key is a word B that occurs at least once as
 * the word immediately following the word A and the value is the probability 
 * that word B is the word immediately following word A. In other words, the
 * value is the percentage of the time that word B immediately follows word A
 * in the input word sequence. 
 * @param input_txt - text input to determine conditional word frequency
 * @return - an array with all conditional word frequency output
 */
exports.condWordFreq = function(input_txt){
    //access condWordCount of input
    var condWordCountOut = exports.condWordCount(input_txt);
    //acces wordCount of input
    var wordCountOut = exports.wordCount(input_txt);
    //initialize array for word frequency
    var condWordFreqOut = {};
    //store values in condWordFreqOut
    for(key in condWordCountOut){
        if(!(key in condWordFreqOut)){
            condWordFreqOut[key] = {};
        }//end if
        for(variable in condWordCountOut[key]){
            condWordFreqOut[key][variable] = condWordCountOut[key][variable]
                / wordCountOut[key];
        }//end for
    }//end for
    return condWordFreqOut;
}//end condWordFreq()


