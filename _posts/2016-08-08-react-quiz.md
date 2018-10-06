---
layout: post
title: Create a quiz with React
description: Tutorial on creating a multiple choice quiz with React - without setting up any build configuration.
image: /images/posts/react-quiz.jpg
---

We're going to create a multiple choice quiz with React - without setting up any build configuration. This is now possible thanks to the [Create React App](https://github.com/facebookincubator/create-react-app) project, which was created by the team at Facebook. [Check out the demo here](http://mitchgavan.github.io/react-multi-choice-quiz/) to see the quiz in action. Starting a new React project usually involves a lot of overhead that can be time consuming for anyone and straight up daunting to beginners. With *Create React App* you get a modern workflow with Webpack, Babel (for ES6 syntax support), ESLint and more all configured for you. This allows you to jump into writing your code straight away.

### Initial Setup
To get started make sure you have Node 4 or later installed on your machine. Then to create your app, from the command line, run the following command in your preferred directory:

{% highlight text %}
  npx create-react-app react-quiz
  cd react-quiz
{% endhighlight %}

Feel free to name your app whatever you like, I've named it *react-quiz* here. This will create a new directory named *react-quiz* inside the current directory, generate the initial project structure and install the dependencies. Your app directory will now look something like this:

{% highlight text %}
  react-quiz/
   README.md
   index.html
   favicon.ico
   node_modules/
   package.json
   src/
    App.css
    App.js
    index.css
    index.js
    logo.svg
{% endhighlight %}

Once installation is complete we can run the app with the following command:

{% highlight text %}
  npm start
{% endhighlight %}

You can now view it in a browser at http://localhost:3000. Feel free to take a moment to familiarise yourself with the current code. The page will reload automatically if you make any changes. You will also see any build errors and lint warnings in the console. And just like that we have a nice modern development environment setup! Now we can start creating the quiz.

### What we're building
We all know how a quiz works, there are a list of questions, and each question has a few different options that map to the possible outcomes. The data that we'll be working with today will determine which video game console company the user is a bigger fan of; Nintendo, Sony or Microsoft. Our quiz has five questions, with three options to choose from per question. However the quiz we're creating will work with any amount of questions/answer options.

We'll be thinking in [the react way](https://facebook.github.io/react/docs/thinking-in-react.html) when building this app, which involves creating small components to build up our app. Let's start by defining what these components are:

 - Question
 - Question count
 - Answer options
 - Result

These components will be composed together through a container component to build our quiz.

### Creating the first component
First off, we'll install the [prop-types](https://github.com/facebook/prop-types) library for React, by running the following command in our project's root directory:

{% highlight text %}
  npm install prop-types
{% endhighlight %}

Then create a new directory named `components`, and inside that create a new file named `Question.js`. This is where we'll start writing our first React component. Add the following code:

{% highlight text linenos %}
  import React from 'react';
  import PropTypes from 'prop-types';

  function Question(props) {
    return (
      <h2 className="question">{props.content}</h2>
    );
  }

  Question.propTypes = {
    content: PropTypes.string.isRequired
  };

  export default Question;
{% endhighlight %}

You may be wondering why we're not using the class syntax for this component. Since this is a [stateless presentation component](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions), we don't need to use a class to create the component. In fact it's best practice not to, as it allows you to eliminate a lot of boilerplate code this way.

There's a popular pattern in React that divides your components into two categories; **presentational** and **container** components. The most basic description of this pattern is that container components should be concerned with how things work, and presentational components should define how things look. Check out [this article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.ezqa6w143) for a more detailed explanation.

This very simple component is just displaying the question. The question's content is being passed in via props from a container component. The `propTypes` (short for property types) in React are used to assist developers, they define the type of prop and what props are required. React will warn you when there is an invalid `propType`.

Let's add this component to our main container component. First we need to import the component, open  `App.js` and add this import statement just below the others:

{% highlight text %}
  import Question from './components/Question';
{% endhighlight %}

Then add the component to the `App` component's render function. Here is what the JSX should now look like:

{% highlight text linenos %}
  render (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>React Quiz</h2>
      </div>
      <Question content="What is your favourite food?" />
    </div>
  );
{% endhighlight %}

Note that we're just passing in a string to the `content` prop for demonstration purposes, this will be changed later on. If you view the app in the browser the question should now be displayed.

### Creating the other presentational components
Next we'll create the question count component. In the `components` folder, create a new file named `QuestionCount.js` and add the following:

{% highlight text linenos %}
  import React from 'react';
  import PropTypes from 'prop-types';

  function QuestionCount(props) {
    return (
      <div className="questionCount">
        Question <span>{props.counter}</span> of <span>{props.total}</span>
      </div>
    );
  }

  QuestionCount.propTypes = {
    counter: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  };

  export default QuestionCount;
{% endhighlight %}

This is very similar to the previous component we created. It will receive two props, `counter` and `total` from a container component.

The next component will display the answer options. Create a file named `AnswerOption.js` in the `components` folder and add the following:

{% highlight text linenos %}
  import React from 'react';
  import PropTypes from 'prop-types';

  function AnswerOption(props) {
    return (
      <li className="answerOption">
        <input
          type="radio"
          className="radioCustomButton"
          name="radioGroup"
          checked={props.answerType === props.answer}
          id={props.answerType}
          value={props.answerType}
          disabled={props.answer}
          onChange={props.onAnswerSelected}
        />
        <label className="radioCustomLabel" htmlFor={props.answerType}>
          {props.answerContent}
        </label>
      </li>
    );
  }

  AnswerOption.propTypes = {
    answerType: PropTypes.string.isRequired,
    answerContent: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    onAnswerSelected: PropTypes.func.isRequired
  };

  export default AnswerOption;
{% endhighlight %}

This component consists of a list item with a radio button and label. There is one new concept introduced here on line 11; the `checked` property is a comparison statement. This value will be a boolean (true or false) based on whether the answer selected is equal to the answer option type.

### Bringing the components together
We will now bring these components together within the `Quiz` component. Create a new file named `Quiz.js` in the components directory. And paste in the following import statements:

{% highlight text %}
  import React from 'react';
  import PropTypes from 'prop-types';
  import Question from '../components/Question';
  import QuestionCount from '../components/QuestionCount';
  import AnswerOption from '../components/AnswerOption';
{% endhighlight %}

Here we are importing the components that we just created. Now let's define the `Quiz` component:

{% highlight text linenos %}
  function Quiz(props) {
    return (
       <div className="quiz">
         <QuestionCount
           counter={props.questionId}
           total={props.questionTotal}
         />
         <Question content={props.question} />
         <ul className="answerOptions">
           {props.answerOptions.map(renderAnswerOptions)}
         </ul>
       </div>
    );
  }

  Quiz.propTypes = {
    answer: PropTypes.string.isRequired,
    answerOptions: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    questionId: PropTypes.number.isRequired,
    questionTotal: PropTypes.number.isRequired,
    onAnswerSelected: PropTypes.func.isRequired
  };

  export default Quiz;
{% endhighlight %}

We're building the quiz with the components we previously created, and passing them the required props. You'll notice that we're passing in props that have been passed down to the `Quiz` component. So the `Quiz` component is also a presentational component. That's because we want to try and keep all of the code concerned with the display of components separate from the functionality.

To make this code work we need to define the `renderAnswerOptions` function that is being used to create each of the `AnswerOptions`. Paste in this code just above the return statement:

{% highlight text linenos %}
  function renderAnswerOptions(key) {
    return (
      <AnswerOption
        key={key.content}
        answerContent={key.content}
        answerType={key.type}
        answer={props.answer}
        questionId={props.questionId}
        onAnswerSelected={props.onAnswerSelected}
      />
    );
  }
{% endhighlight %}

Don't worry too much about the properties for now, they'll be defined in the main container component (`App.js`). Essentially, this will render an `AnswerOption` component for each of the answer options defined in our state.

### Add some style
*Create React App* configures Webpack for us so that we can define separate CSS files for each module. It will then bundle all of our CSS into one file upon saving. We won't be diving too much into styling. So for this tutorial I've just put all of the styles into one CSS file. Grab the CSS from the Github repository [here](https://github.com/mitchgavan/react-multi-choice-quiz/blob/master/src/index.css), and replace the current contents of `index.css` with it.

### Adding functionality
Before creating the quiz functionality we need to define the app's state. Inside `App.js`, we define our initial state in the App class's constructor function. This is the idiomatic way of declaring initial state when using ES6. In `App.js`, place the following code at the top of the `App` class:

{% highlight text linenos %}
  constructor(props) {
    super(props);

    this.state = {
     counter: 0,
     questionId: 1,
     question: '',
     answerOptions: [],
     answer: '',
     answersCount: {
       nintendo: 0,
       microsoft: 0,
       sony: 0
     },
     result: ''
    };
  }
{% endhighlight %}

State should contain data that a component's event handlers may change to trigger a UI update. The above code is all of the state required for the quiz. Now we need to actually grab some data to populate our state. You can grab the demo question data [here](https://github.com/mitchgavan/react-multi-choice-quiz/blob/master/src/api/quizQuestions.js). Create a new folder named `api`, then create a new file named `quizQuestions.js` and paste the demo data contents into that file. Then import that file into `App.js`:

{% highlight text %}
  import quizQuestions from './api/quizQuestions';
{% endhighlight %}

Next, we'll populate our app's state using the `componentWillMount` life cycle event React provides us. Place this code directly below our constructor function:

{% highlight text linenos %}
  componentWillMount() {
    const shuffledAnswerOptions = quizQuestions.map((question) => this.shuffleArray(question.answers));  

    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }
{% endhighlight %}

The `componentWillMount` life cycle event is invoked once, both on the client and server, immediately before the initial rendering occurs. When you call `setState` within this method as we are above on line 4, `render()` will see the updated state and it will be executed only once despite the state change.

As you may've notice we've also used a function named `shuffleArray` on line 2, this will randomise the order of the answer options - just to spice things up a bit. But we're yet to define that function, so let's do that now directly below the `componentWillMount` function:

{% highlight text linenos %}
  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };
{% endhighlight %}

As the name suggests this function will shuffle an array. I won't dive into how it's doing so, as that's outside the scope of this tutorial, but here's a [link to the source](http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array) if you're interested.

Now let's define the render function for the `App.js` component:

{% highlight text linenos %}
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Quiz</h2>
        </div>
        <Quiz
          answer={this.state.answer}
          answerOptions={this.state.answerOptions}
          questionId={this.state.questionId}
          question={this.state.question}
          questionTotal={quizQuestions.length}
          onAnswerSelected={this.handleAnswerSelected}
        />
      </div>
    )
  }
{% endhighlight %}


One thing to note here is that we actually need to hard bind our event handlers in the `render` function. For [performance reasons](http://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/)  the best place to do this is in the constructor. Add this line to the bottom of our constructor function:

{% highlight text %}
  this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
{% endhighlight %}

### Updating state without mutating it
Now we're going to create the functionality for selecting an answer. Add the follwing function directly above the `render()` function:

{% highlight text linenos %}
  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        // do nothing for now
      }
  }
{% endhighlight %}

This function is currently performing two tasks; setting the answer and then setting the next question. Each task has been extracted into it's own function to help keep the code clean and readable. We now need to define each of these functions, we'll start with the `setUserAnswer` function, add the following code directly above the `handleAnswerSelected` function:

{% highlight text linenos %}
  setUserAnswer(answer) {
    this.setState((state) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: state.answersCount[answer] + 1
      },
      answer: answer
    }));
  }
{% endhighlight %}

Okay let's talk about what's going on here. We're setting the answer based on the user's selection, which is the first instance of changing state based on user actions. The value being passed in as the answer parameter on line 1, is the value of the selected answer. Which in our case will be either *Nintendo*, *Microsoft* or *Sony*.

On line 2 we're calling `setState` with a function rather than an object. This is so we can access the previous state, which will be passed into the function as the first parameter. `setState` is the primary method used to trigger UI updates from event handlers and server request callbacks. In React we should treat *state* as if it is unable to be changed (immutable). This is why on line 3 we're creating a new object. This object has the original properties of `this.state.answersCount` (through the use of the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)) merged with the new `answerCount` value. We have now updated the state without mutating it directly.

Next we need to define the `setNextQuestion` function. As the name suggests, this will update our state to display the next question. Add this code below the `updatedAnswersCount` function:

{% highlight text linenos %}
  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: ''
    });
  }
{% endhighlight %}

Here we increment the `counter` and `questionId` state, by first creating the variables, then assigning them via `setState`. We're also updating the `question` and `answerOption` state based on the counter variable. We now have a somewhat functional app! When you select an answer it should update the state accordingly and display the next question.

### Calculating the result

Firstly, we need to update the `handleAnswerSelected` function. In the *else* statement that we previously created but left empty, include the following code:

{% highlight text %}
  setTimeout(() => this.setResults(this.getResults()), 300);
{% endhighlight %}

Here we're calling `setResults` after 300ms. The delay is simply a UX decision made so that the user has a moment to see the visual feedback indicating that their selection has been made. We're passing the results in the form of another function `getResults`. Let's define that now:

{% highlight text linenos %}
  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }
{% endhighlight %}

This function calculates which answer type (Sony, Microsoft or Nintendo in our case) has the highest number - aka the quiz result. This is a fairly ES6 heavy function, but I find it much more verbose than the ES5 equivalent. On line 3, `answersCountKeys` is utilising `Object.keys` to return an array of strings that represent all the properties of an object. In this case it will return:

{% highlight text %}
  ['nintendo', 'microsoft', 'sony']
{% endhighlight %}

Then on line 4, `answersCountValues` is mapping over this array to return an array of the values. Then we can get the highest number of that array with `Math.max.apply`, this is assigned to the `maxAnswerCount` variable on line 5. Then finally on line 7, we calculate which key has a value equal to the `maxAnswerCount` using the filter method and return it.

Now we need to create the `setResults` function. Include the following code directly below the `getResults` function:

{% highlight text linenos %}
  setResults (result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }
{% endhighlight %}

This function receives the result from `getResults` which is an array, and checks to see if that array has one value. If so we assign that value via `setState`.  If the array has more or less than one value that means there is no conclusive answer. So we set the result as `Undetermined`.

### Displaying the result

Finally we need to display the result. Create a new file in the `components` directory named `Result.js` and add the following code:

{% highlight text linenos %}
  import React from 'react';
  import PropTypes from 'prop-types';

  function Result(props) {
    return (
      <div className="result">
        You prefer <strong>{props.quizResult}</strong>!
      </div>
    );
  }

  Result.propTypes = {
    quizResult: PropTypes.string.isRequired,
  };

  export default Result;
{% endhighlight %}

This is a presentation component that will display the result. Next we have to update the `render` function in `App.js`. Replace the `<Quiz/>` component in the `render` function with the following:

{% highlight text %}
  {this.state.result ? this.renderResult() : this.renderQuiz()}
{% endhighlight %}

Here we're using the JavaScript ternary operater, which is a shorthand if statement, to determine whether the quiz or the result should be displayed. If `state.result` has a value then it will display the result.

Finally we need to create these two functions we just added. Add the following code directly above the render function:

{% highlight text linenos %}
  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result} />
    );
  }
{% endhighlight %}

We now have a fully functional quiz! If you want to deploy your app, you can run the `npm run build` command to generate an optimized build for production. Your app will now be minified and ready to be deployed!


### Bonus: Adding animation

Let's add some subtle animation to make the user experience feel a bit nicer. Firstly we need to install the React animation component with the following command (note we're using v1 of the library, [v2](https://github.com/reactjs/react-transition-group/blob/master/Migration.md) has changed quite a bit):

{% highlight text %}
  npm install react-transition-group@1.x
{% endhighlight %}

This provides us with an easy way to perform CSS transitions and animations with React components. If you've ever worked with animations in Angular this will feel familiar to you, as it's inspired by the excellent *ng-animate* library. We're simply going to be adding a fade-in and fade-out effect to our questions.

Navigate to the `Quiz.js` component and add the following import statement below the others:

{% highlight text %}
  import { CSSTransitionGroup } from 'react-transition-group';
{% endhighlight %}

`CSSTransitionGroup` is a simple element that wraps all of the components you are interested in animating. We're going to be animating the entire quiz component. To do that, update the render function with the following code:

{% highlight text linenos %}
  return (
    <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div key={props.questionId}>
        <QuestionCount
          counter={props.questionId}
          total={props.questionTotal}
        />
        <Question content={props.question} />
        <ul className="answerOptions">
          {props.answerOptions.map(renderAnswerOptions)}
        </ul>
      </div>
    </CSSTransitionGroup>
  );
{% endhighlight %}

Here we've wrapped the quiz element in a `CSSTransitionGroup` element. Child elements of `CSSTransitionGroup` must be provided with a unique `key` attribute. This is how React determines which children have entered, left, or stayed. We've defined the key as `props.questionId` on line 11, as that value will be different for each question.

There are quite a few properties on the `CSSTransitionGroup` element here, I'll go through what each one's purpose is. The `component` prop is specifying what HTML element this will be rendered as. The `transitionName` prop is specifying the name of the CSS classes that will be added to the element. In our case they will be `fade-enter` and `fade-enter-active` when the element is being rendered, and `fade-leave` and `fade-leave-active` when they are being removed. The `transitionEnterTimeout` and `transitionLeaveTimeout` are specifying the animation durations. This also needs to be specified in the CSS. You'll find that the required CSS is already included in the `index.css` file we previously got from Github. This is what it looks like:

{% highlight css linenos %}
  .fade-enter {
    opacity: 0;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 0.5s ease-in-out 0.3s;
  }

  .fade-leave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 1;
  }

  .fade-leave.fade-leave-active {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
{% endhighlight %}

This CSS is just changing the opacity values, and specifying the transition duration and type. The `transitionEnterTimeout` has been specified as 800ms to cater for the 300ms delay we're adding to the `.fade-enter` CSS transition. The `transitionAppear` prop is specifying that we want the component to be animated on initial mount. And `transitionAppearTimeout` specifies the duration of that animation. The CSS for that is similar to the other animations:

{% highlight css linenos %}
  .fade-appear {
    opacity: 0;
  }

  .fade-appear.fade-appear-active {
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
{% endhighlight %}

The last thing we need to change is the `render` function of the  `Result.js` component. Replace the `render` function with the following:

{% highlight text linenos %}
  return (
    <CSSTransitionGroup
      className="container result"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        You prefer <strong>{props.quizResult}</strong>!
      </div>
    </CSSTransitionGroup>
  );
{% endhighlight %}

This will ensure that our results component is also animated in. And with that, our quiz animation is complete!

### Completed Demo

You can find the [complete source code for this quiz on Github](https://github.com/mitchgavan/react-multi-choice-quiz). I hope this tutorial was helpful, I went through a lot of concepts pretty quickly, so if you have any questions feel free to hit me up on [Twitter](https://twitter.com/MitchG23).
