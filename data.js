const state = {
  days: [ 
    {
      id: 1,
      name: "Monday",
      appointments: [
        1,
        2,
        3,
        4,
        5
      ],
      interviewers: [
        1,
        3,
        6,
        8,
        10
      ],
      spots: 2
    }
  ],
  // ...
  appointments:{
    1: {
      id: 1,
      time: "12pm",
      interview: null
    },
    2: {
      id: 2,
      time: "1pm",
      interview: null
    },
    3: {
      id: 3,
      time: "2pm",
      interview: {
        student: "Chad Takahashi",
        interviewer: 1
      }
    },
  },
  // ...
  interviewers:{
    1: {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    },
    2: {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png"
    },
    3: {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png"
    },
  },
  // ...
}