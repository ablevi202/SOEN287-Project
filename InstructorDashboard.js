const instructor = {name: "John Doe" }

document.getElementById("welcome-message").innerHTML =
  "Welcome " + instructor.name + "!";

//array course
const courses = [
  { objectName: "course1", code: "SOEN 287", fullName: "SOEN287 - Web programming", term: "Winter 2026" },
  { objectName: "course2", code: "MAST 218", fullName: "MAST218 - Multivariable calculus", term: "Winter 2026" },
  { objectName: "course3", code: "COMP 233", fullName: "COMP233 - Statistics", term: "Winter 2026" },
  //{ objectName: "course4", code: "COMP 345", fullName: "COMP345 - Data analysis", term: "Winter 2026" }
];


const deck = document.getElementById("class-deck");

for (let i = 0; i < courses.length; i++) {
  deck.innerHTML +=
    "<div class='course-box' onclick=\"openCoursePage('" + courses[i].objectName + "')\">" +
      "<a href='InstructorClassPage2.html'>" + courses[i].code + "</a>" +
    "</div>";
}

// 4) Store which course was clicked (so one page can show different courses)
function openCoursePage(courseId) {
  localStorage.setItem("courseId", courseId);
}