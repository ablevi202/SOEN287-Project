


const user = JSON.parse(localStorage.getItem('users')) || [];
const student = JSON.parse(localStorage.getItem('students')) || [];
const instructor = JSON.parse(localStorage.getItem('instructors')) || [];   
const courses = JSON.parse(localStorage.getItem('courses')) || [];



function passwordSec(password) {
   
    const aCapitalLetter = /[A-Z]/.test(password);
    
    const aDigit = /[0-9]/.test(password);
 
    const aSpecialCara = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (aCapitalLetter && aDigit && aSpecialCara && password.length >= 8){
        return true;

    }
        const error = document.getElementById('registerError');
        error.textContent = "Password must contain at least 8 characters, one capital letter, one digit and one special character.";
        error.style.display = 'block';

    return false;
}

function legitPassword() {

    const password = document.getElementById("RegisterPassword").value;
    const confirmPassword = document.getElementById("PasswordChecker").value;

    if (!(password===confirmPassword)) {

        const error = document.getElementById('registerError');
        error.textContent = "Passwords do not match.";
        error.style.display = 'block';
        return false;

    } else return passwordSec(password);
}

function createUser () {

    const name = document.getElementById("Name").value;
    const firstName = document.getElementById("FirstName").value;
    const email = document.getElementById("RegisterEmail").value;
    const password = document.getElementById("RegisterPassword").value;
    const selectedType = document.querySelector('input[name="userType"]:checked');
    

    if (legitPassword() && emailIsUnique(email)) {

        if (!selectedType) {
            const error = document.getElementById('registerError');
            error.textContent = "Please select an account type.";
            error.style.display = 'block';
            return false;
        }

        const newUser = {
            id: idGenerator(),
            name: name,
            firstName: firstName,
            email: email,
            password: password,
            type: selectedType.value,
            curentCourses: [],
            succesedCourses: [],
            credits : 0,
        }

        user.push(newUser);
        console.log("Avant sauvegarde - user array:", user);
        
        // Add to the appropriate array based on type
        if (selectedType.value === 'student') {
            student.push(newUser);
            localStorage.setItem('students', JSON.stringify(student));
        } else if (selectedType.value === 'instructor') {
            instructor.push(newUser);
            localStorage.setItem('instructors', JSON.stringify(instructor));
        }
        
        localStorage.setItem('users', JSON.stringify(user));
        console.log("Après sauvegarde - localStorage:", localStorage.getItem('users'));
        
        alert("Registration successful!");
        console.log("New User Created:", newUser);
        window.location.href = "index.html";
    
}

}


function idGenerator () {

    const isStudent = document.getElementById("studentRadio").checked;
    if (isStudent) {

        let id = "S" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');

        while (!idIsUnique(id)) {
            id = "S" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        }

        return id;

    } else { 
        
        let id = "T" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');

         while (!idIsUnique(id)) {
            id = "T" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        }

    return id;
    }
}

function idIsUnique (id) {
    if (user.find(u=>u.id === id)) {
        return false;
    }
    return true;
}

function emailIsUnique (email) {

    if (user.find(u=>u.email === email)) {

        const error = document.getElementById('registerError');
        error.textContent = "Email is already in use.";
        error.style.display = 'block';


        return false;
        
    } return true;
}

function loginUser() {
    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;
    
    
    if (!email || !password) {
        const error = document.getElementById('loginError');
        error.textContent = "Please fill in all fields.";
        error.style.display = 'block';
        return false;
    }
    
   
    const foundUser = user.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
        
        alert("Welcome " + foundUser.firstName + " " + foundUser.name + "!");
        
       
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        
      
        if (foundUser.type === "student") {
            window.location.href = "studentDashboard.html";
        } else {
            window.location.href = "instructorDashboard.html";
        }
        
    } else {
        
        const error = document.getElementById('loginError');
        error.textContent = "Invalid email or password.";
        error.style.display = 'block';
    }
    
    return false; 
}






function legitCourseId() {

    const courseCode = document.getElementById("CourseID").value;
    const courseType = document.getElementById("CourseSubject").value;

    if (courses.find(c => c.id === courseCode && c.type === courseType)) {

        const error = document.getElementById('CreateCourseError');
        error.textContent = "Course ID and type are already in use.";
        error.style.display = 'block';


        return false;
        
    } 
    return true;
}

function courseNameGenerator(courseCode, courseType) {


    return courseType.toUpperCase().substring(0, 3) + " " + courseCode;
}








function CreateCourse() {

const courseCode = document.getElementById("CourseID").value;
const courseType = document.getElementById("CourseSubject").value;
const courseDescription = document.getElementById("CourseDescription").value;
const courseInstructor = document.getElementById("Instructor").value;
const coursePrerequisites = document.getElementById("Prerequistes").value;
const courseCredits = document.getElementById("NumberCredits").value;
const coursesize = document.getElementById("ClassSize").value;

if (legitCourseId()) {

const courseName = courseNameGenerator(courseCode, courseType);


const newCourse = {
    
    id: courseCode,
    name: courseName,
    type: courseType,
    description: courseDescription,
    instructor: courseInstructor,
    prerequisites: coursePrerequisites,
    credits: courseCredits,
    size: coursesize,
    enrolledStudents: []
}


courses.push(newCourse);
        console.log("Avant sauvegarde - user array:", courses);
        
        
        localStorage.setItem('courses', JSON.stringify(courses));
        console.log("Après sauvegarde - localStorage:", localStorage.getItem('courses'));
        
        alert("Course created successfully!");
        console.log("New Course Created:", newCourse);

}
return false; false;
}

