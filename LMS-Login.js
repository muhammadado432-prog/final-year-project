let currentRole = "Student";

// elements (STRICT SCOPING)
const roleSwitch = document.getElementById("roleSwitch");
const buttons = roleSwitch.querySelectorAll("button");
const slider = roleSwitch.querySelector(".slider");
const loginForm = document.getElementById("loginForm");
const extraField = document.getElementById("extraField");

// switch logic
buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    currentRole = btn.dataset.role;

    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (index === 0) {
      slider.style.left = "0%";
    } else {
      slider.style.left = "50%";
    }

    if (currentRole === "Student") {
      extraField.innerHTML = `
        <label for="matric">Matric Number</label>
        <input type="text" id="matric" name="matric" placeholder="Enter your matric number" required />
      `;
    } else {
      extraField.innerHTML = `
        <label for="staffId">Staff ID</label>
        <input type="text" id="staffId" name="staffId" placeholder="Enter your staff ID" required />
      `;
    }

    document.getElementById("role").value = currentRole;
  });
});

// login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginBox = document.querySelector(".login-box");
  const spinner = document.getElementById("spinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitBtn = loginForm.querySelector("button[type='submit']");
  
  errorMessage.style.display = "none";
  spinner.style.display = "block";
  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  const formData = new FormData(loginForm);

  try {
    const response = await fetch("https://localhost:7080/Home/Login", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    spinner.style.display = "none";
    submitBtn.disabled = false;

    if (result.success) {
      if (result.role === "Student") {
        window.location.href = "student-dashboard.html?name=" + encodeURIComponent(result.name) 
          + "&matric=" + encodeURIComponent(result.matric)
          + "&department=" + encodeURIComponent(result.department)
          + "&email=" + encodeURIComponent(result.email);
      } else if (result.role === "Librarian") {
        window.location.href = "librarian-dashboard.html?name=" + encodeURIComponent(result.name);
      }
    } else {
      errorMessage.style.display = "block";
      loginBox.classList.add("shake");
      
      setTimeout(() => {
        loginBox.classList.remove("shake");
      }, 500);
      
      submitBtn.textContent = "Login";
    }
  } catch (error) {
    console.log("Error:", error);
    spinner.style.display = "none";
    submitBtn.disabled = false;
    
    errorMessage.style.display = "block";
    loginBox.classList.add("shake");
    
    setTimeout(() => {
      loginBox.classList.remove("shake");
    }, 500);
     
    submitBtn.textContent = "Login";
  }
});