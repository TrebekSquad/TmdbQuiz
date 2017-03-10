 	const quizApp = {};

 	quizApp.getMovies = function(year) {
 		return $.ajax({
 			url: 'https://api.themoviedb.org/3/discover/movie',
 			type: 'GET',
 			dataType: 'JSON',
 			data: {
 				api_key: '8a92833b6f0e0a614c460724797ccc79', // our key is limited to 40 calls every 10 seconds.
 				format: 'json',
 				sort_by: 'popularity.desc', //puts most popular movies at the top
 				primary_release_year: year //movies from this year
 			}
 		})

 	}

 	quizApp.getCasts = function(movieId) { //takes movie id, gets cast and crew for that movie
 		return $.ajax({
 			url: `https://api.themoviedb.org/3/movie/${movieId}/casts`,
 			type: 'GET',
 			dataType: 'JSON',
 			data: {
 				api_key: '8a92833b6f0e0a614c460724797ccc79'
 			},
 		})
 	}

 	quizApp.events = () => {
 		$('#submitButton').on('click', (e) => {
 			e.preventDefault();
 			// Multiplied value by one to coerce string into number
 			let year = ($('#yearSelection').val() * 1);
 			// Make an ajax call for the following nine years after #yearSelection
 			quizApp.movieChecks = [];

 			for (i = 0; i < 10; i++) {
 				quizApp.movieChecks.push(quizApp.getMovies(year));
 				// console.log("Hello", year);
 				year = year + 1;
 			}
 			$.when(...quizApp.movieChecks).done((...results) => {
 				// console.log(results);
 				let betterArray = results.map((array) => {
 					return array[0].results;
 				})
 				let finalArray = [];
 				betterArray.forEach((movieGroup) => {
 						movieGroup.forEach((movie) => {
 							finalArray.push(movie);
 						})
 					}) //end of double loop
 				quizApp.moviedata = finalArray;
 				quizApp.generateCastData();

 			});

 		});

 		$('.question10').on('click', function(e) {
 			e.preventDefault();
 			quizApp.displayQuestion(quizApp.generateYear());
 		});

 	}


 	quizApp.init = function() {
 		quizApp.events();
 		// quizApp.getMovies();

 		// quizApp.questionTest(quizApp.testOverview3, quizApp.testTitle3);
 		/************
 		INTRO
 		************/
 		/* Get the decade from the user
 			on click event that listens to the select/text input
 		*/
 		/* Call ajax function to get movie data from chosen decade (maybe different ajax calls)
 		 */

 		/* on.submit (Generate categories, generate questions, shuffle, Play Game!)
 			Categories (ideas): 
 				- Big budget films
 				- Box office flops
 				- Classics
 				- Award-winning films
 				- by Genre (sci-fi, horror, comedy, animated, doc, shorts)
 			Questions (ideas):
 				- Which movie starred actors X and Y
 				- Name one of the actors that starred in movie Z
 				- Multiple choice questions!
 			Function for shuffling questions/categories:
 				(Shuffles the arrays)
 				
 				function shuffle(questions) {
 				  var m = questions.length, t, i;
 				  while (m) {
 				    i = Math.floor(Math.random() * m--);
 				    t = questions[m];
 				    questions[m] = questions[i];
 				    questions[i] = t;
 				  }
 				  return questions;
 				}

 				Calls the shuffle to run
 				questions = shuffle(questions);
 		*/

 		/************
 		GAME WINDOW
 		************/

 		// Insert Questions function:
 		// user clicks question tile and is prompted with an overlay
 		// Overlay can contain question, answer box or buttons and pass/submit

 		/*SCORE BOARD*/
 		//generate users score
 		//for every right answer increase score
 		// for every wrong answer decrease score

 		/*****************************
 		Movie Data Available (property names):
 			adult
 			backdrop_path
 			genre_ids
 			id
 			original_language
 			original_title
 			overview
 			popularity
 			poster_path
 			release_date
 			title
 			video
 			vote_average
 			vote_count
 		*****************************/
 	};

 	//just for testing purposes!!
 	quizApp.testOverview1 = "Twenty-two years after the events of Jurassic Park, Isla Nublar now features a fully functioning dinosaur theme park, Jurassic World, as originally envisioned by John Hammond.";
 	quizApp.testTitle1 = "Jurassic World"

 	quizApp.testOverview2 = "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life. Within this world exist two rebels on the run who just might be able to restore order. There's Max, a man of action and a man of few words, who seeks peace of mind following the loss of his wife and child in the aftermath of the chaos. And Furiosa, a woman of action and a woman who believes her path to survival may be achieved if she can make it across the desert back to her childhood homeland.";
 	quizApp.testTitle2 = 'Mad Max: Fury Road'

 	quizApp.testOverview3 = 'In a universe where human genetic material is the most precious commodity, an impoverished young Earth woman becomes the key to strategic maneuvers and internal strife within a powerful dynasty…';
 	quizApp.testTitle3 = 'Jupiter Ascending'
 		//var test = quizApp.removeTitleFromDescription(quizApp.testOverview2,quizApp.testTitle2)
 		//end testing stuff

 	quizApp.removeTitleFromDescription = function(description, title) {
 		let titleWords = title;
 		var newDescription = description;
 		titleWords = titleWords.split(''); //splits the title into an array of words
 		titleWords.forEach((word, index) => { //removes non alphanumeric characters from each word (IE Max: becomes Max)

 			titleWords[index] = titleWords[index].replace(/\W/g, '');
 			newDescription = newDescription.replace(new RegExp(titleWords[index], 'gi'), '*Blank*');

 		});
 		return {
 			description: newDescription,
 			title: title,
 			origDec: description
 		};
 	}

 	quizApp.questionDescription = function(descriptionObject) {
 		let actualTitle = descriptionObject.title;
 		let description = descriptionObject.description;
 		let wrongAnswers = [];
 		let movieObject = quizApp.moviedata; //This needs to target the results of our ajax request
 		let randoNum = Math.floor(Math.random() * (movieObject.length - 4)) + 1
 		for (var i = 0; i < 4; i++) {
 			let randoIndex = randoNum + i
 			wrongAnswers.push(movieObject[randoIndex].title)
 		}
 		let allTitles = wrongAnswers;
 		allTitles.push(actualTitle);
 		const questionObject = {
 			wrongAnswers: wrongAnswers,
 			answer: actualTitle,
 			allTitles: allTitles,
 			question: 'Name the movie that this text is describing!',
 			type: 'multipleChoice',
 			descriptionBlanked: description,
 			origDesc: descriptionObject.origDesc
 		}
 		return questionObject;
 	}

 	quizApp.generateRandomDescQuestion = function() {
 		let movieObject = quizApp.moviedata;
 		let answerMovieIndex = Math.floor(Math.random() * (movieObject.length)) + 1;
 		let randomMovieEntry = movieObject[answerMovieIndex];
 		let cleanDescription = quizApp.removeTitleFromDescription(randomMovieEntry.overview, randomMovieEntry.title)
 		let questionObject = quizApp.questionDescription(cleanDescription);
 		console.log(questionObject);
 		return questionObject;
 	}

 	quizApp.pickFiveMovies = function() {
 		let theMovies = [];
 		for (var i = 0; i < 5; i++) { //do this 5 times
 			let randoNum = Math.floor(Math.random() * (quizApp.moviedata.length)) + 1
 			theMovies.push(quizApp.moviedata[randoNum]);
 		}
 		return theMovies;
 	}

 	quizApp.getCastForFiveMovies = function(theMoviesArray) {
 		quizApp.castdata = {};
 		theMoviesArray.forEach((movie) => {
 			let movieId = movie.id;
 			let movieTitle = movie.title;
 			let castCheck = quizApp.getCasts(movieId);
 			$.when(castCheck).done((data)=> {
 				// console.log(data);
 				quizApp.castdata[movieTitle] = data;
 			});
 		})
 	}

 	quizApp.generateCastData = function() {
 		let fiveMovies = quizApp.pickFiveMovies();
 		quizApp.getCastForFiveMovies(fiveMovies);
 	}


 	$(function() {
 		quizApp.init();
 	});

 	//Cast Data
 	//choose 5 movies to make calls (pickFiveMovies())
 	//make ajax request for cast data with data from movie array (randomly)
 	//repeat 5 times
 	//store in app property for questionification

 	//RELEASE_DATE QUESTIONS

 	 //pick random movie  from array
 	 //create correct answer
 	 quizApp.generateYear = function() {
 	 	let max = quizApp.moviedata.length;
 	 	let min = 0;
 	 	let randomNum = Math.floor(Math.random() * (max - min + 1));

 	 	//generated movies for random year
 	 	let movieByYearAnswer = quizApp.moviedata[randomNum];

 	 	//get relase date from movie
 	 	let correctReleaseDate = movieByYearAnswer.release_date;
 	 	//slicing it to only get the year and not the month and day
 	 	let yearNum = (correctReleaseDate.slice(0,4) * 1);

 	 	// variable for wrong answers
 	 	let wrongAnswers = quizApp.generateWrongYears(yearNum);

 	 	let allYears = [];
 	 	allYears.push(...wrongAnswers); //...spreads array out into comma separated values
 	 	allYears.push(yearNum)

 		const questionObject = {
 			wrongAnswers: wrongAnswers,
 			answer: yearNum,
 			allYears: allYears,
 			question: 'Which year was this movie released?',
 			type: 'multipleChoice',
 			movie: movieByYearAnswer,
 			title: movieByYearAnswer.title
 		}
 		return questionObject;

 	 };

 	//create wrong answers
 	quizApp.generateWrongYears = function(correctAnswer) {
 		let wrongAnswers = [];
 		let max = 5;
 		let min = 1
 		for (var i = 0; wrongAnswers.length < 3; i++) {
 			let randoNum = Math.floor(Math.random() * (max - min + 1));
 			let randomNumlower = Math.floor(Math.random() * (2 - 1 + 1));
 			let wrongAnswer;
 			if(randomNumlower === 1) {
 				wrongAnswer = correctAnswer + randoNum;
 			}else {
 				wrongAnswer = correctAnswer - randoNum;
 			} 
 			let isUnique = true;

 			wrongAnswers.forEach(function(year){
 				if(year === wrongAnswer) {
 					isUnique = false;
 				}
 			})
 			if(isUnique === true) {
 				wrongAnswers.push(wrongAnswer) 			
 			}
 			
 		}
 		return wrongAnswers; 
 	}

 	//Displaying Question

 	quizApp.displayQuestion = (question) => {
 		$('.questions__text').empty('');
 		$('.questions__text').append(quizApp.generateYear().question);

 		// console.log(quizApp.generateYear().question);
 		// var multiButtons = Math.floor(Math.random() * quizApp.generateYear().allYears[0];
 		let questionobj = quizApp.generateYear();

 		$('#answerOne').text(questionobj.allYears[0])
 		$('#answerTwo').text(questionobj.allYears[1])
 		$('#answerThree').text(questionobj.allYears[2])
 		$('#answerFour').text(questionobj.allYears[3])
 		// console.log(questionobj.allYears)
 	}


 	//when user selects a button (on.click) determine if it is the wrong or right answer

 	// $('#radioButtonsYear').on('click', function(e) {
 	// 	console.log(quizApp.generateYear.questionobj.yearNum)
 	// });
 	//prompt or alert appears
 	// if answer is right go to next wuestion 
 	//else keep choosing