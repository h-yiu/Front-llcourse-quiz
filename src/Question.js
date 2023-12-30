import { useEffect, useState } from 'react';

export const Question = () => {
    const [ questions, setQuestions ] = useState([]);
    const [ selectedAnswers, setSelectedAnswers ] = useState({
        name: '',
    });
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ score, setScore ] = useState(0);

    const fetchData = () => {
        fetch("http://192.168.4.35:8081/questions", {
          headers: {
            'quiz-name': 'JavaScript - 2',
            'user': 1,
          }
        }).then((response) => response.json())
        .then((data) => setQuestions(data))
        .catch((error) => console.log(error));
    }

    useEffect(() => {
        fetchData();
      }, [])
    
    // console.log(questions);

    const handleOptionChange = (e, questionNum) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionNum]: e.target.value,
            quiz_id: questions[0].quizID,
        });
        // console.log(selectedAnswers);
    };
    
    const handleDisableSumbit = () => {
        return Object.keys(selectedAnswers).length === 11 && selectedAnswers.name !== '';
    }
    
    const handleSubmit = async (e) => {

        var data = {};

        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedAnswers),
            };
            const response = await fetch('http://192.168.4.35:8081/answers', requestOptions);
            data = await response.json();
            console.log('response', data);
        } catch (error) {
            console.log('Error posting data: ', error);
        }

        try {
            const response_score = await fetch("http://192.168.4.35:8081/score", {
                headers: {
                    'student-name': selectedAnswers.name,
                    'quiz-name': selectedAnswers.quiz_id,
                }
            });
            const score = await response_score.json();
            console.log('score', score);
            setScore(score.result);
        } catch (error) {
            console.log('Error getting score: ', error);
        }

        if (data.result === 'Answers received successfully' ){
                setIsSubmitted(true);
                e.preventDefault();
            }
        // console.log(selectedAnswers);
    };

 
    return (<div> 
        {questions.map((question) => (
        <div key={question.questionNumber}>
            <label className='question-title'>{question.questionNumber}. {question.questionDescription}</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {isSubmitted && 
             selectedAnswers[`question_${question.questionNumber}`] !== question.correctAnswer 
             && <span className='uncorrect-symbol'>&#10007;</span>}
            <div className='answers'>
                <label>
                    <input type="radio"
                           style={{display: isSubmitted && question.optionA === question.correctAnswer ? 'none' : 'auto'}}
                           name={`question_${question.questionNumber}`} 
                           value={question.optionA}
                           checked={selectedAnswers[`question_${question.questionNumber}`] === question.optionA}
                           onChange={(e) => handleOptionChange(e, `question_${question.questionNumber}`)}/>
                    {isSubmitted && question.optionA === question.correctAnswer && <span className='checkmark'></span>}
                    &nbsp;&nbsp;{question.optionA} 
                </label>
                <label>
                    <input type="radio" 
                           style={{display: isSubmitted && question.optionB === question.correctAnswer ? 'none' : 'auto'}}
                           name={`question_${question.questionNumber}`} 
                           value={question.optionB} 
                           checked={selectedAnswers[`question_${question.questionNumber}`] === question.optionB}
                           onChange={(e) => handleOptionChange(e, `question_${question.questionNumber}`)}
                    />
                    {isSubmitted && question.optionB === question.correctAnswer && <span className='checkmark'></span>}
                    &nbsp;&nbsp;{question.optionB}
                </label>
                {question.optionC !=='' &&
                    <label>
                        <input type="radio" 
                               style={{display: isSubmitted && question.optionC === question.correctAnswer ? 'none' : 'auto'}}
                               name={`question_${question.questionNumber}`} 
                               value={question.optionC} 
                               checked={selectedAnswers[`question_${question.questionNumber}`] === question.optionC}
                               onChange={(e) => handleOptionChange(e, `question_${question.questionNumber}`)}
                        />
                        {isSubmitted && question.optionC === question.correctAnswer && <span className='checkmark'></span>}
                        &nbsp;&nbsp;{question.optionC}
                    </label>
                }
                {question.optionD !=='' &&
                    <label>
                        <input type="radio"
                               style={{display: isSubmitted && question.optionD === question.correctAnswer ? 'none' : 'auto'}} 
                               name={`question_${question.questionNumber}`} 
                               value={question.optionD} 
                               checked={selectedAnswers[`question_${question.questionNumber}`] === question.optionD}
                               onChange={(e) => handleOptionChange(e, `question_${question.questionNumber}`)}
                        />
                        {isSubmitted && question.optionD === question.correctAnswer && <span className='checkmark'></span>}
                        &nbsp;&nbsp;{question.optionD}
                    </label>
                }
            </div>
        </div>
    ))}
        {!isSubmitted && <div>
            <input className='name-input'
                   type="text" 
                   placeholder='your name'
                   value={selectedAnswers.name}
                   onChange={(e) => {setSelectedAnswers({
                    ...selectedAnswers,
                    name: e.target.value,
                   });
                    console.log(selectedAnswers);}
                   }
            />
        </div> }
        <p className='note_temp'>
            If you want to resumbit, add version number following your name. Refresh the page.
        </p>
        {!isSubmitted ?  (<button onClick={(e) => handleSubmit(e)} disabled={!handleDisableSumbit()}>
            Submit
         </button>): (<p className='score_result'>Your score is: {score}</p>)}
    </div>
    )
}