// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * @author Pedro Luis Rivera
 * For QuizTopia by Nooblers++
 */

class QuizEntry { // 
    constructor(quizID, name, category, date, description){
        this.quizID = quizID;
        this.name = name;
        this.category = category;
        this.date = date;
        this.description = description;
    }
}

// Functions for HTTP Requests.
// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// const QUESTIONS_PER_CHALLENGE = 5; // Questions for a random challenge...
// const randomChallengeURL = "https://opentdb.com/api.php?amount=".concat(QUESTIONS_PER_CHALLENGE).concat("&type=multiple");

// Function for maintaining Random Challenges...
exports.randomQuizzesManager = functions.database.ref("/challenges/{challengeID}/taken")
.onUpdate((snapshot, context) => {
    // let request = new XMLHttpRequest();
    // let response;
    // request.open("GET", randomChallengeURL, false); // Synchronous (Sending false to ensure synchronous execution).
    // request.responseType = "json";
    // request.onload = function() {
    //     response = JSON.parse(request.responseText);
    // }
    // request.send();
    // let result = { // Building new Challenge...
    //     taken : false,
    //     0 : {
    //         question : response["results"][0]["question"],
    //         correct_answer : response["results"][0]["correct_answer"],
    //         incorrect_answers : [
    //             response["results"][0]["incorrect_answers"][0],
    //             response["results"][0]["incorrect_answers"][1],
    //             response["results"][0]["incorrect_answers"][2]
    //         ]
    //     },
    //     1 : {
    //         question : response["results"][1]["question"],
    //         correct_answer : response["results"][1]["correct_answer"],
    //         incorrect_answers : [
    //             response["results"][1]["incorrect_answers"][0],
    //             response["results"][1]["incorrect_answers"][1],
    //             response["results"][1]["incorrect_answers"][2]
    //         ]
    //     },
    //     2 : {
    //         question : response["results"][2]["question"],
    //         correct_answer : response["results"][2]["correct_answer"],
    //         incorrect_answers : [
    //             response["results"][2]["incorrect_answers"][0],
    //             response["results"][2]["incorrect_answers"][1],
    //             response["results"][2]["incorrect_answers"][2]
    //         ]
    //     },
    //     3 : {
    //         question : response["results"][3]["question"],
    //         correct_answer : response["results"][3]["correct_answer"],
    //         incorrect_answers : [
    //             response["results"][3]["incorrect_answers"][0],
    //             response["results"][3]["incorrect_answers"][1],
    //             response["results"][3]["incorrect_answers"][2]
    //         ]
    //     },
    //     4 : {
    //         question : response["results"][4]["question"],
    //         correct_answer : response["results"][4]["correct_answer"],
    //         incorrect_answers : [
    //             response["results"][4]["incorrect_answers"][0],
    //             response["results"][4]["incorrect_answers"][1],
    //             response["results"][4]["incorrect_answers"][2]
    //         ]
    //     }
    // };
    result = {lol : 1, xd : 2};
    return admin.database().ref("/challenges").push().set(result).then(
        () => {
            return admin.database().ref("/challenges/".concat(context.params.challengeID)).remove();
        }
    ).catch(error => { console.log(error); });
});

exports.getUntakenQuizzes = functions.https.onRequest((request, response) => {

    const category = request.query.category;
    const userID = request.query.uid;

    console.log(category + " " + userID);

    let createdQuizzes = [];
    let takenQuizzes = [];
    let result = [];

    var retrieveCreatedQuizzes = admin.database().ref("/user_info/".concat(userID).concat("/quizzes_created")).once('value', function(s1) {
            var keys1 = Object.keys(s1.val());
            for(q in keys1){
                // console.log("key1 = ".concat(keys1[q]));
                createdQuizzes.push(keys1[q]);
            }
        });
    var retrieveTakenQuizzes = admin.database().ref("/user_info/".concat(userID).concat("/quizzes_taken")).once('value', function(s2) {
        var keys2 = Object.keys(s2.val());
        for(q in keys2){
            // console.log("key2 = ".concat(keys2[q]));
            takenQuizzes.push(keys2[q]);
        }                
    });

    if(category) {
        return Promise.all([retrieveCreatedQuizzes, retrieveTakenQuizzes]).then(
            () => {
                return admin.database().ref("/categories/".concat(category)).once('value', function(s3) {
                    var keys3 = Object.keys(s3.val());
                    for(q in keys3){
                        // console.log("key = ".concat(keys3[q]));
                        if(!(createdQuizzes.includes(keys3[q]) || takenQuizzes.includes(keys3[q]))){
                            result.push(keys3[q]);
                        }
                    }                    
                });
            }
        ).then(
            () => {
                response.send(result.slice(0, 50));
                return 0;
            }
        ).catch(
            error => {
                console.log(error);
                response.sendStatus(500, error);
                return -1;
            }
        );
    } else {
        return Promise.all([retrieveCreatedQuizzes, retrieveTakenQuizzes]).then(
            () => {
                return admin.database().ref("/categories/general").once('value', function(s3) {
                    var keys3 = Object.keys(s3.val());
                    for(q in keys3){
                        // console.log("key = ".concat(keys3[q]));
                        if(!(createdQuizzes.includes(keys3[q]) || takenQuizzes.includes(keys3[q]))){
                            result.push(keys3[q]);
                        }
                    }                    
                });
            }
        ).then(
            () => {
                response.send(result.slice(0, 50));
                return 0;
            }
        ).catch(
            error => {
                console.log(error);
                response.sendStatus(500, error);
                return -1;
            }
        );
    }
  });
