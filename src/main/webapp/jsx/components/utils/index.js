export const calculate_age = (dob) => {
  if (dob !== null && dob != "") {
    //Check if the DOB is not null or empty
    const today = new Date();
    const dateParts = dob.split("-");
    const birthDate = new Date(dob);
    let todayMonth = today.getMonth();
    let todayYear = today.getFullYear();
    let todayDate = today.getDate(); // get the day, month and year from date of birth
    let birthDateMonth = birthDate.getMonth();
    let birthDateYear = birthDate.getFullYear();
    let birthdateDate = birthDate.getDate();
    let assumedAge = todayYear - birthDateYear;
    if (assumedAge > 0) {
      //Checking the month to confirm if the age has been cloocked
      let monthGap = todayMonth - birthDateMonth;
      if (monthGap > 0) {
        return assumedAge;
      } else if (monthGap < 0) {
        let confirmedAge = assumedAge - 1;
        return confirmedAge;
      } else if (monthGap === 0) {
        let dateGap = todayDate - birthdateDate;
        if (dateGap > 0) {
          return assumedAge;
        } else if (dateGap < 0) {
          let confirmedAge = assumedAge - 1;
          return confirmedAge;
        }
      }
    } else {
    }
  }
};
