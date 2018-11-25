// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const express = require('express');
const app = express();


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * @author Pedro Luis Rivera
 * For QuizTopia by Nooblers++
 */

class QuizEntry { // 
    constructor(quizID, name, category, owner, description){
        this.quizID = quizID;
        this.name = name;
        this.category = category;
        this.owner = owner;
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

    response.set('Access-Control-Allow-Origin', '*');
    // response.set('Access-Control-Allow-Methods', 'GET');
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers");
    request.header("Access-Control-Allow-Origin", "*");
    request.header("Access-Control-Allow-Headers");


    var retrieveCreatedQuizzes = admin.database().ref("/users/".concat(userID).concat("/quizzesCreated")).once('value', function(s1) {
        if(s1.val() !== null) {    
        var keys1 = Object.keys(s1.val());
            for(q in keys1){
                // console.log("key1 = ".concat(keys1[q]));
                createdQuizzes.push(keys1[q]);
            }
        }});
    var retrieveTakenQuizzes = admin.database().ref("/users/".concat(userID).concat("/quizzesTaken")).once('value', function(s2) {
        if(s2.val() !== null) {
            var keys2 = Object.keys(s2.val());
            for(q in keys2){
                // console.log("key2 = ".concat(keys2[q]));
                takenQuizzes.push(keys2[q]);
            }                
    }});
    return cors(request, response, () => {
        if(category) {
            return Promise.all([retrieveCreatedQuizzes, retrieveTakenQuizzes]).then(
                () => {
                    return admin.database().ref("/categories/".concat(category)).once('value', function(s3) {
                        var keys3 = Object.keys(s3.val());
                        for(q in keys3){
                            // console.log("key = ".concat(keys3[q]));
                            if(!(createdQuizzes.includes(keys3[q]) || takenQuizzes.includes(keys3[q]))){
                                let vta = s3.val()[keys3[q]];
                                vta["quizID"] = keys3[q];
                                result.push(vta);
                                // result.push(keys3[q]);
                            }
                        }                    
                    });
                }
            ).then(
                () => {
                    response.set('Access-Control-Allow-Origin', '*');
                    response.status(200).send(result.slice(0, 50));
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
                                let vta = s3.val()[keys3[q]];
                                vta["quizID"] = keys3[q];
                                result.push(vta);
                                // result.push(keys3[q]);
                            }
                        }                    
                    });
                }
            ).then(
                () => {
                    response.set('Access-Control-Allow-Origin', '*');
                    response.status(200).send(result.slice(0, 50));
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
});

// Function for maintaining Deleting a Quiz & Maintain Database Integrity...
exports.deleteQuizManager = functions.database.ref("/users/{userID}/quizzesCreated/{quizID}/active")
.onUpdate((snapshot, context) => {
    let quizID = context.params.quizID;
    let userID = context.params.userID;
    return admin.database().ref(`users/${userID}/quizzesCreated/${quizID}/category`).once("value", function(snap) {
        const category = snap.val();
        var deleteFromCategory = admin.database().ref(`categories/${category}/${quizID}`).remove();
        var deleteFromGeneral = admin.database().ref(`categories/general/${quizID}`).remove();
        var deleteFromUser = admin.database().ref(`users/${userID}/quizzesCreated/${quizID}`).remove();
        var deleteFromQuizzes = admin.database().ref(`quizzes/${quizID}`).remove();
        if(category){
            return Promise.all([deleteFromCategory, deleteFromGeneral, deleteFromUser, deleteFromQuizzes]);
        }else {
            return -1;
        }
    }).catch((e) => {
        console.log("Unable to delete...");
        return -1;
    });
});

  app.use(cors);
  exports.app = functions.https.onRequest(app);
