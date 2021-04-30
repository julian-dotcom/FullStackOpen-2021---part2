import React from 'react'

const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
  }
  
  const Total = ({ course }) => {
    let parts = course.parts;
    console.log(parts);
    const sum = course.parts.map(part => part.exercises).reduce((acc, cur) => acc + cur);
    return(
      <p>Number of exercises {sum}</p>
    ) 
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
  }
  
  const Content = ({ course }) => {
    
    return (
      <div>
        {course.parts.map(current => <Part key={current.id} part={current} />)}
      </div>
    )
  }

const Course = ({ courses }) => {
    return (
      <div>
        {courses.map(course => {
          return ([
            <div key={course.id}>
              <Header course={course} />
              <Content course={course} />
              <Total course={course} />
            </div>
          ])
        })}
      </div>
    )  
  }

  export default Course