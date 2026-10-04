// Check if user is logged in
const urlParams = new URLSearchParams(window.location.search);
const studentName = urlParams.get("name") || "";
const studentMatric = urlParams.get("matric") || "";
const studentDepartment = urlParams.get("department") || "Not Available";
const studentEmail = urlParams.get("email") || "Not Available";

if (!studentMatric || studentMatric === "") {
  alert("Unauthorized access! Please login first.");
  window.location.href = "http://127.0.0.1:5500/Library Management System.html";
}

// Set welcome message
document.getElementById("welcomeTitle").textContent = `Welcome, ${studentName}!`;
document.getElementById("welcomeSubtitle").textContent = "Student Dashboard - University of Abuja Library";
document.getElementById("userDisplayName").innerHTML = `<i class="fa fa-user"></i> ${studentName}`;

// Show dashboard on load
window.onload = function() {
  showSection('dashboard', document.querySelector('.sidebar-menu li'));
};

// Show section
function showSection(section, element) {
  document.querySelectorAll(".sidebar-menu li").forEach(li => li.classList.remove("active"));
  if (element) element.classList.add("active");

  const content = document.getElementById("sectionContent");

  switch(section) {
    case "dashboard":
      content.innerHTML = `
        <div class="search-container">
          <i class="fa fa-search search-icon"></i>
          <input type="text" class="search-input" placeholder="Search for books by title, author, or ISBN..." />
          <button class="search-btn" onclick="searchBooks()"><i class="fa fa-search"></i> Search</button>
        </div>
        <br>
        <div class="announcements">
          <h3><i class="fa fa-bullhorn"></i> Announcements</h3>
          <div class="announcement-item">
            <div class="announcement-icon"><i class="fa fa-thumb-tack"></i></div>
            <div class="announcement-text">
              <h4>Library Closing Early</h4>
              <p>The library will close at 8:00 PM this Friday for maintenance.</p>
              <span class="announcement-date">June 28, 2026</span>
            </div>
          </div>
          <div class="announcement-item">
            <div class="announcement-icon"><i class="fa fa-book"></i></div>
            <div class="announcement-text">
              <h4>New E-Books Available</h4>
              <p>Over 200 new e-books added to the digital collection.</p>
              <span class="announcement-date">June 25, 2026</span>
            </div>
          </div>
          <div class="announcement-item">
            <div class="announcement-icon"><i class="fa fa-clock-o"></i></div>
            <div class="announcement-text">
              <h4>Book Return Deadline Extended</h4>
              <p>Deadline extended to July 15th, 2026.</p>
              <span class="announcement-date">June 20, 2026</span>
            </div>
          </div>
        </div>
      `;
      break;
      
    case "browse":
      loadBrowseBooks();
      break;
      
    case "borrowed":
      loadBorrowedBooks();
      break;
      
    case "profile":
      content.innerHTML = `
        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-avatar">
              <i class="fa fa-user"></i>
            </div>
            <div class="profile-title">
              <h3>${studentName}</h3>
              <p>${studentMatric}</p>
            </div>
            <span class="profile-badge">Student</span>
          </div>

          <div class="profile-body">
            <div class="profile-section">
              <h4><i class="fa fa-info-circle"></i> Personal Information</h4>
              <div class="profile-info-grid">
                <div class="profile-info-item">
                  <span class="info-label">Full Name</span>
                  <span class="info-value">${studentName}</span>
                </div>
                <div class="profile-info-item">
                  <span class="info-label">Matric Number</span>
                  <span class="info-value">${studentMatric}</span>
                </div>
                <div class="profile-info-item">
                  <span class="info-label">Department</span>
                  <span class="info-value">${studentDepartment}</span>
                </div>
                <div class="profile-info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">${studentEmail}</span>
                </div>
              </div>
            </div>

            <div class="profile-section">
              <h4><i class="fa fa-book"></i> Library Information</h4>
              <div class="profile-info-grid">
                <div class="profile-info-item">
                  <span class="info-label">Books Borrowed</span>
                  <span class="info-value" id="booksBorrowed">0</span>
                </div>
                <div class="profile-info-item">
                  <span class="info-label">Books Returned</span>
                  <span class="info-value" id="booksReturned">0</span>
                </div>
                <div class="profile-info-item">
                  <span class="info-label">Pending Requests</span>
                  <span class="info-value" id="pendingRequests">0</span>
                </div>
                <div class="profile-info-item">
                  <span class="info-label">Total Fines</span>
                  <span class="info-value" id="totalFines">₦0</span>
                </div>
              </div>
            </div>

            <div class="profile-section">
              <h4><i class="fa fa-cog"></i> Account Settings</h4>
              <div class="profile-actions">
                <button class="btn-edit"><i class="fa fa-edit"></i> Edit Profile</button>
                <button class="btn-password" onclick="changePassword()"><i class="fa fa-lock"></i> Change Password</button>
              </div>
            </div>
          </div>
        </div>
      `;
      loadLibraryStats();
      break;
  }
}

// ✅ Change password function
async function changePassword() {
  const newPassword = prompt("Enter your new password (minimum 4 characters):");
  
  if (!newPassword || newPassword.length < 4) {
    alert("Password must be at least 4 characters!");
    return;
  }

  const confirmPassword = prompt("Confirm your new password:");
  
  if (newPassword !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  try {
    const response = await fetch("https://localhost:7080/api/students/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matric: studentMatric,
        newPassword: newPassword
      })
    });

    const result = await response.json();
    
    if (result.success) {
      alert("✅ Password changed successfully!");
    } else {
      alert("❌ Failed to change password.");
    }
  } catch (error) {
    alert("❌ Error connecting to backend.");
  }
}

// Search books function
function searchBooks() {
  const searchTerm = document.querySelector(".search-input").value.toLowerCase().trim();
  
  if (!searchTerm) {
    loadBrowseBooks();
    return;
  }
  
  const content = document.getElementById("sectionContent");
  content.innerHTML = `
    <h3><i class="fa fa-search"></i> Search Results</h3>
    <p>Searching for: <strong>${searchTerm}</strong></p>
    <p>Loading...</p>
  `;
  
  fetch("https://localhost:7080/api/books")
    .then(r => r.json())
    .then(books => {
      const results = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        (book.isbn && book.isbn.includes(searchTerm))
      );
      
      let html = "";
      if (results.length === 0) {
        html = `<p style="color: #888;">No books found matching "${searchTerm}"</p>`;
      } else {
        results.forEach(book => {
          const isAvailable = book.status === "Available";
          html += `
            <div class="book-card" style="margin: 10px 0;">
              <div class="book-icon"><i class="fa fa-book"></i></div>
              <h4>${book.title}</h4>
              <p><strong>Author:</strong> ${book.author}</p>
              <p><strong>ISBN:</strong> ${book.isbn || 'N/A'}</p>
              <p><strong>Course:</strong> ${book.course}</p>
              <p>
                <span style="color: ${isAvailable ? '#09a61cdd' : '#ff4444'}; font-weight: bold;">
                  ${book.status}
                </span>
              </p>
              <div class="book-actions">
                ${isAvailable ? `
                  <button class="btn-borrow" onclick="borrowBook(${book.id}, '${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-book"></i> Borrow</button>
                  <button class="btn-reserve" onclick="reserveBook(${book.id}, '${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-thumb-tack"></i> Reserve</button>
                ` : `
                  <button class="btn-reserve" onclick="reserveBook(${book.id}, '${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-thumb-tack"></i> Reserve</button>
                `}
                <button class="btn-read" onclick="readOnline('${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-eye"></i> Read</button>
              </div>
            </div>
          `;
        });
      }
      
      content.innerHTML = `
        <h3><i class="fa fa-search"></i> Search Results (${results.length})</h3>
        <p style="color: #888;">Searching for: <strong>${searchTerm}</strong></p>
        <br>
        <div class="book-grid">${html}</div>
      `;
    });
}

// Load library stats for profile
async function loadLibraryStats() {
  try {
    const response = await fetch(`https://localhost:7080/api/borrowings/by-matric?matric=${encodeURIComponent(studentMatric)}`);
    const borrowings = await response.json();
    
    const notReturned = borrowings.filter(b => b.status === "Not Returned");
    const pending = borrowings.filter(b => b.status === "Pending");
    const returned = borrowings.filter(b => b.status === "Returned");
    
    let totalFine = 0;
    returned.forEach(b => {
      if (b.fine) totalFine += b.fine;
    });
    
    document.getElementById("booksBorrowed").textContent = notReturned.length;
    document.getElementById("booksReturned").textContent = returned.length;
    document.getElementById("pendingRequests").textContent = pending.length;
    document.getElementById("totalFines").textContent = `₦${totalFine}`;
  } catch (error) {
    console.log("Error loading stats");
  }
}

// Load borrowed books and history
async function loadBorrowedBooks() {
  const content = document.getElementById("sectionContent");
  
  content.innerHTML = `
    <h3><i class="fa fa-bookmark"></i> My Borrowed Books</h3>
    <p>Loading...</p>
  `;

  try {
    const response = await fetch(`https://localhost:7080/api/borrowings/by-matric?matric=${encodeURIComponent(studentMatric)}`);
    const borrowings = await response.json();
    
    const notReturned = borrowings.filter(b => b.status === "Not Returned" || b.status === "Pending");
    const returned = borrowings.filter(b => b.status === "Returned");
    
    let borrowedHtml = "";
    if (notReturned.length === 0) {
      borrowedHtml = `
        <div style="text-align: center; padding: 40px; background: #f9f9f9; border-radius: 10px; border: 2px dashed #ccc;">
          <p style="font-size: 40px; margin-bottom: 10px;"><i class="fa fa-book"></i></p>
          <h4 style="color: #555; margin-bottom: 10px;">No Borrowed Books</h4>
          <p style="color: #888; font-size: 14px;">You haven't borrowed any books yet.</p>
          <p style="color: #888; font-size: 14px;">Go to <strong>Browse Books</strong> to find something to read!</p>
          <button onclick="showSection('browse', document.querySelectorAll('.sidebar-menu li')[1])" style="margin-top: 15px; padding: 10px 30px; background: #09a61cdd; color: white; border: none; border-radius: 5px; cursor: pointer;">
            <i class="fa fa-book"></i> Browse Books
          </button>
        </div>
      `;
    } else {
      notReturned.forEach(b => {
        const dueDate = new Date(b.dueDate);
        const now = new Date();
        const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        const isPending = b.status === "Pending";
        
        borrowedHtml += `
          <div style="background: ${isPending ? '#fff3cd' : daysLeft < 0 ? '#ffe6e6' : '#e8f5e9'}; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid ${isPending ? '#ffc107' : daysLeft < 0 ? '#ff4444' : '#09a61cdd'};">
            <p><strong><i class="fa fa-book"></i> ${b.bookTitle}</strong></p>
            <p><i class="fa fa-calendar"></i> Requested: ${new Date(b.borrowDate).toLocaleDateString()}</p>
            ${isPending ? 
              '<p style="color: #ff9800; font-weight: bold;"><i class="fa fa-hourglass-half"></i> Pending librarian approval - Please go to the library to pick up</p>' : 
              `<p><i class="fa fa-clock-o"></i> Due: ${dueDate.toLocaleDateString()} 
               <span style="color: ${daysLeft < 0 ? 'red' : 'green'}; font-weight: bold;">
                 (${daysLeft < 0 ? Math.abs(daysLeft) + ' days OVERDUE!' : daysLeft + ' days remaining'})
               </span>
              </p>`
            }
            ${!isPending && daysLeft < 0 ? `<p style="color: red;"><i class="fa fa-exclamation-triangle"></i> Late return fine accumulating: ₦${Math.abs(daysLeft) * 50}</p>` : ''}
          </div>
        `;
      });
    }
    
    let historyHtml = "";
    if (returned.length === 0) {
      historyHtml = `
        <div style="text-align: center; padding: 30px; background: #f9f9f9; border-radius: 10px; border: 2px dashed #ccc;">
          <p style="font-size: 30px; margin-bottom: 10px;"><i class="fa fa-list"></i></p>
          <h4 style="color: #555; margin-bottom: 10px;">No History Yet</h4>
          <p style="color: #888; font-size: 14px;">Once you return books, they will appear here.</p>
        </div>
      `;
    } else {
      returned.forEach(b => {
        historyHtml += `
          <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #888;">
            <p><strong><i class="fa fa-book"></i> ${b.bookTitle}</strong></p>
            <p><i class="fa fa-calendar"></i> Borrowed: ${new Date(b.borrowDate).toLocaleDateString()}</p>
            <p><i class="fa fa-check"></i> Returned: ${new Date(b.returnDate).toLocaleDateString()}</p>
            ${b.fine > 0 ? `<p><i class="fa fa-money"></i> Fine paid: ₦${b.fine}</p>` : '<p><i class="fa fa-check"></i> No fine charged</p>'}
          </div>
        `;
      });
    }
    
    content.innerHTML = `
      <h3><i class="fa fa-bookmark"></i> Currently Borrowed (${notReturned.length})</h3>
      ${borrowedHtml}
      <br><hr><br>
      <h3><i class="fa fa-history"></i> Borrowing History (${returned.length})</h3>
      ${historyHtml}
    `;
  } catch (error) {
    content.innerHTML = `
      <h3>My Borrowed Books</h3>
      <p style="color: red;"><i class="fa fa-times"></i> Failed to load data. Make sure the backend is running.</p>
    `;
  }
}

// Load browse books as cards
async function loadBrowseBooks() {
  const content = document.getElementById("sectionContent");
  
  content.innerHTML = `
    <h3><i class="fa fa-book"></i> Browse Books</h3>
    <p>Loading books...</p>
  `;

  try {
    const [booksRes, coursesRes] = await Promise.all([
      fetch("https://localhost:7080/api/books"),
      fetch("https://localhost:7080/api/courses")
    ]);
    
    const books = await booksRes.json();
    const courses = await coursesRes.json();

    let courseOptions = '<option value="">All Courses</option>';
    courses.forEach(course => {
      courseOptions += `<option value="${course}">${course}</option>`;
    });

    let bookCards = "";
    books.forEach(book => {
      const isAvailable = book.status === "Available";
      
      bookCards += `
        <div class="book-card" data-course="${book.course}">
          <div class="book-icon"><i class="fa fa-book"></i></div>
          <h4>${book.title}</h4>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Course:</strong> ${book.course}</p>
          <p><strong>Class:</strong> ${book.classification}</p>
          <p>
            <span style="color: ${isAvailable ? '#09a61cdd' : '#ff4444'}; font-weight: bold;">
              ${book.status}
            </span>
          </p>
          <div class="book-actions">
            ${isAvailable ? `
              <button class="btn-borrow" onclick="borrowBook(${book.id}, '${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-book"></i> Borrow</button>
              <button class="btn-reserve" onclick="reserveBook(${book.id}, '${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-thumb-tack"></i> Reserve</button>
            ` : `
              <button class="btn-reserve" onclick="reserveBook(${book.id}, '${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-thumb-tack"></i> Reserve</button>
            `}
            <button class="btn-read" onclick="readOnline('${book.title.replace(/'/g, "\\'")}')"><i class="fa fa-eye"></i> Read</button>
          </div>
        </div>
      `;
    });

    content.innerHTML = `
      <h3><i class="fa fa-book"></i> Browse Books</h3>
      <div style="margin-bottom: 20px;">
        <label style="font-weight: bold;">Filter by Course:</label>
        <select id="courseFilter" onchange="filterBooks()" style="padding: 8px; margin-left: 10px; border-radius: 5px; border: 1px solid #ccc;">
          ${courseOptions}
        </select>
      </div>
      <div class="book-grid">
        ${bookCards}
      </div>
    `;
  } catch (error) {
    content.innerHTML = `
      <h3><i class="fa fa-book"></i> Browse Books</h3>
      <p style="color: red;"><i class="fa fa-times"></i> Failed to load books.</p>
    `;
  }
}

// Reserve Book
async function reserveBook(bookId, bookTitle) {
  if (!studentMatric) {
    alert("Your matric number is not found. Please login again.");
    return;
  }

  const confirmReserve = confirm(`Do you want to reserve "${bookTitle}"?\n\nYou will be notified when it becomes available.`);
  
  if (!confirmReserve) return;

  try {
    const response = await fetch("https://localhost:7080/api/reserve-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentMatric: studentMatric,
        studentName: studentName,
        bookId: bookId,
        bookTitle: bookTitle
      })
    });

    const result = await response.json();
    
    if (result.success) {
      alert(`${result.message}`);
      loadBrowseBooks();
    } else {
      alert("Failed to reserve book.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
}

// Borrow Book
async function borrowBook(bookId, bookTitle) {
  if (!studentMatric) {
    alert("Your matric number is not found. Please login again.");
    return;
  }

  const confirmBorrow = confirm(`Do you want to borrow "${bookTitle}"?\n\nThis will notify the librarian.`);
  
  if (!confirmBorrow) return;

  try {
    const response = await fetch("https://localhost:7080/api/request-borrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentMatric: studentMatric,
        studentName: studentName,
        bookId: bookId,
        bookTitle: bookTitle
      })
    });

    const result = await response.json();
    
    if (result.success) {
      alert(`Request sent! Please go to the library to pick up "${bookTitle}".\n\nThe librarian has been notified.`);
      loadBrowseBooks();
    } else {
      alert("Failed to send request.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
}

// Read Online (placeholder)
function readOnline(bookTitle) {
  alert(`"${bookTitle}"\n\nThis feature is coming soon!\nFor now, please visit the library to read this book.`);
}

// Filter books by course
function filterBooks() {
  const course = document.getElementById("courseFilter").value;
  document.querySelectorAll(".book-card").forEach(card => {
    if (!course || card.dataset.course === course) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// Logout
function logout() {
  window.location.href = "http://127.0.0.1:5500/Library Management System.html";
}