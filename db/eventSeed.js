module.exports=[
    {
        date: new Date('2023-04-07'),
        startTime: new Date('2023-04-07T09:00:00'),
        endTime: new Date('2023-04-07T11:00:00'),
        eventType: 'work',
        eventTitle: 'Finish Project Report',
        subtasks: [{subtask:'Data analysis'}, {subtask:'Drafting'}],
        important: true,
        repeat: 'daily'
      },
      {
        date: new Date('2023-04-07'),
        startTime: new Date('2023-04-07T14:00:00'),
        endTime: new Date('2023-04-07T16:00:00'),
        eventType: 'study',
        eventTitle: 'Study for Exam',
        subtasks: [{subtask:'Read Chapter 6'}, {subtask:'Practice problems'}],
        important: false,
        repeat: 'weekly'
      },
      {
        date: new Date('2023-04-08'),
        startTime: new Date('2023-04-08T10:00:00'),
        endTime: new Date('2023-04-08T12:00:00'),
        eventType: 'family',
        eventTitle: 'Visit Grandparents',
        subtasks: [{subtask:'Bring flowers'}, {subtask:'Buy gifts'}],
        important: true,
        repeat: 'none'
      }
]