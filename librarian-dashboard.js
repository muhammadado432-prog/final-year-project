// Check if user is logged in
const urlParams = new URLSearchParams(window.location.search);
const librarianName = urlParams.get("name") || "";

if (!librarianName || librarianName === "") {
  alert("Unauthorized access! Please login first.");
  window.location.href = "http://127.0.0.1:5500/Library Management System.html";
}

// Set welcome message
document.getElementById("welcomeTitle").textContent = `Welcome, ${librarianName}!`;
document.getElementById("welcomeSubtitle").textContent = "Librarian Dashboard - University of Abuja Library";
document.getElementById("userDisplayName").innerHTML = `<i class="fa fa-user"></i> ${librarianName}`;

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
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon"><i class="fa fa-book"></i></div>
            <div class="stat-number">1,234</div>
            <div class="stat-label">Total Books</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fa fa-bookmark"></i></div>
            <div class="stat-number">156</div>
            <div class="stat-label">Books Issued</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fa fa-users"></i></div>
            <div class="stat-number">89</div>
            <div class="stat-label">Active Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fa fa-clock-o"></i></div>
            <div class="stat-number">12</div>
            <div class="stat-label">Overdue Books</div>
          </div>
        </div>

        <h3><i class="fa fa-clock-o"></i> Recent Activities</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Book</th>
              <th>Student</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span style="color: #09a61cdd;">Issued</span></td>
              <td>Introduction to Algorithms</td>
              <td>John Doe</td>
              <td>June 28, 2026</td>
            </tr>
            <tr>
              <td><span style="color: #ff4444;">Returned</span></td>
              <td>Database Systems</td>
              <td>Jane Smith</td>
              <td>June 27, 2026</td>
            </tr>
          </tbody>
        </table>
      `;
      break;
      
    case "manage":
      loadManageBooks();
      break;
      
    case "overdue":
      loadOverdueBooks();
      break;
      
    case "issue":
      content.innerHTML = `
        <h3><i class="fa fa-exchange"></i> Issue / Return Books</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h4 style="color: #09a61cdd;"><i class="fa fa-book"></i> Issue Book</h4>
            <input type="text" id="issueMatric" placeholder="Student Matric Number" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
            <input type="text" id="issueName" placeholder="Student Full Name" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
            <input type="text" id="issuePhone" placeholder="Student Phone Number" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
            <select id="issueBookId" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
              <option value="">Select Book</option>
            </select>
            <button class="btn-green" onclick="issueBook()" style="width: 100%;">Issue Book (Due in 14 days)</button>
            <p style="font-size: 12px; color: #888; margin-top: 10px;"><i class="fa fa-exclamation-triangle"></i> Late return fine: ₦50 per day</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h4 style="color: #ff4444;"><i class="fa fa-refresh"></i> Return Book</h4>
            <p style="font-size: 13px; color: #888; margin-bottom: 10px;">Enter student matric to see their borrowed books</p>
            <input type="text" id="returnMatric" placeholder="Enter Student Matric Number" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
            <button class="btn-blue" onclick="searchBorrowedForReturn()" style="width: 100%;">Search Borrowed Books</button>
            <div id="borrowedBooksList" style="margin-top: 15px;"></div>
          </div>
          
        </div>
        
        <br>
        
        <div style="background: #fff8e1; padding: 20px; border-radius: 10px; border: 2px solid #ffc107;">
          <h4 style="color: #ff9800;"><i class="fa fa-list"></i> Pending Borrow Requests</h4>
          <div id="pendingRequests"></div>
        </div>
      `;
      loadAvailableBooks();
      loadPendingRequests();
      break;
      
    case "students":
      content.innerHTML = `
        <h3><i class="fa fa-search"></i> Search Student</h3>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <input type="text" id="searchMatric" placeholder="Enter Student Matric Number" style="flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;" />
          <button class="btn-blue" onclick="searchStudent()" style="padding: 12px 30px; font-size: 16px;">
            <i class="fa fa-search"></i> Search
          </button>
        </div>
        <div id="studentResult"></div>
      `;
      break;
      
    case "reports":
      content.innerHTML = `
        <h3><i class="fa fa-bar-chart"></i> Reports</h3>
        <p>Generate library reports here.</p>
        <p style="color: #888; margin-top: 20px;">Coming soon - Reports feature</p>
      `;
      break;
  }
}

// ✅ Search borrowed books for return
async function searchBorrowedForReturn() {
  const matric = document.getElementById("returnMatric").value;
  
  if (!matric) {
    alert("Enter Matric Number!");
    return;
  }

  try {
    const response = await fetch(`https://localhost:7080/api/borrowings/by-matric?matric=${encodeURIComponent(matric)}`);
    const borrowings = await response.json();
    
    const notReturned = borrowings.filter(b => b.status === "Not Returned");
    
    let html = "";
    if (notReturned.length === 0) {
      html = "<p style='color: #888;'>No borrowed books for this student.</p>";
    } else {
      notReturned.forEach(b => {
        const dueDate = new Date(b.dueDate);
        const now = new Date();
        const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        html += `
          <div style="background: ${daysLeft < 0 ? '#ffe6e6' : '#e8f5e9'}; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid ${daysLeft < 0 ? '#ff4444' : '#09a61cdd'};">
            <p><strong><i class="fa fa-book"></i> ${b.bookTitle}</strong></p>
            <p><i class="fa fa-user"></i> Student: ${b.studentName || 'N/A'} (${b.studentMatric})</p>
            <p><i class="fa fa-hashtag"></i> Copy ID: <strong>${b.bookId}</strong></p>
            <p><i class="fa fa-calendar"></i> Borrowed: ${new Date(b.borrowDate).toLocaleDateString()}</p>
            <p><i class="fa fa-clock-o"></i> Due: ${dueDate.toLocaleDateString()} 
               <span style="color: ${daysLeft < 0 ? 'red' : 'green'}; font-weight: bold;">
                 (${daysLeft < 0 ? Math.abs(daysLeft) + ' days LATE' : daysLeft + ' days left'})
               </span>
            </p>
            ${daysLeft < 0 ? `<p style="color: red;"><i class="fa fa-money"></i> Fine: ₦${Math.abs(daysLeft) * 50}</p>` : ''}
            <button class="btn-blue" onclick="returnBookById(${b.bookId})" style="margin-top: 10px;"><i class="fa fa-refresh"></i> Return This Book</button>
          </div>
        `;
      });
    }
    
    document.getElementById("borrowedBooksList").innerHTML = html;
  } catch (error) {
    document.getElementById("borrowedBooksList").innerHTML = "<p style='color: red;'>Error loading data.</p>";
  }
}

// ✅ Return book by ID
async function returnBookById(bookId) {
  const confirmReturn = confirm("Confirm return of this book?");
  if (!confirmReturn) return;

  try {
    const response = await fetch("https://localhost:7080/api/returnbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: bookId })
    });

    const result = await response.json();
    
    if (result.success) {
      const fineText = result.fine > 0 ? `Fine: ₦${result.fine}` : "No fine";
      alert(`Book returned successfully! ${fineText}`);
      searchBorrowedForReturn();
      loadAvailableBooks();
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert("Error returning book.");
  }
}

// Load pending requests
async function loadPendingRequests() {
  const container = document.getElementById("pendingRequests");
  
  try {
    const response = await fetch("https://localhost:7080/api/borrowings");
    const borrowings = await response.json();
    
    const pending = borrowings.filter(b => b.status === "Pending");
    
    if (pending.length === 0) {
      container.innerHTML = "<p style='color: #888;'>No pending requests.</p>";
      return;
    }
    
    let html = "";
    pending.forEach(b => {
      html += `
        <div style="background: #fff; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ffc107; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p><strong><i class="fa fa-user"></i> ${b.studentName || 'N/A'}</strong> (${b.studentMatric})</p>
            <p><i class="fa fa-book"></i> ${b.bookTitle}</p>
            <p><i class="fa fa-phone"></i> ${b.studentPhone || 'N/A'}</p>
            <p><i class="fa fa-calendar"></i> Requested: ${new Date(b.borrowDate).toLocaleDateString()}</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-green" onclick="approveRequest(${b.id})" style="padding: 8px 20px;"><i class="fa fa-check"></i> Approve</button>
            <button class="btn-red" onclick="rejectRequest(${b.id})" style="padding: 8px 20px;"><i class="fa fa-times"></i> Reject</button>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = "<p style='color: red;'>Failed to load pending requests.</p>";
  }
}

// Approve request
async function approveRequest(id) {
  try {
    const response = await fetch(`https://localhost:7080/api/borrowings/approve/${id}`, {
      method: "POST"
    });

    const result = await response.json();
    
    if (result.success) {
      alert("Request approved! Book is now borrowed.");
      loadPendingRequests();
      loadAvailableBooks();
    }
  } catch (error) {
    alert("Error approving request.");
  }
}

// Reject request
async function rejectRequest(id) {
  const confirmReject = confirm("Reject this request?");
  if (!confirmReject) return;
  
  try {
    const response = await fetch(`https://localhost:7080/api/borrowings/reject/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();
    
    if (result.success) {
      alert("Request rejected.");
      loadPendingRequests();
    }
  } catch (error) {
    alert("Error rejecting request.");
  }
}

// Load overdue books
async function loadOverdueBooks() {
  const content = document.getElementById("sectionContent");
  
  content.innerHTML = `
    <h3><i class="fa fa-exclamation-triangle"></i> Overdue Books</h3>
    <p>Loading overdue books...</p>
  `;

  try {
    const response = await fetch("https://localhost:7080/api/borrowings");
    const borrowings = await response.json();
    
    const now = new Date();
    const overdue = borrowings.filter(b => {
      if (b.status !== "Not Returned" || !b.dueDate) return false;
      return new Date(b.dueDate) < now;
    });
    
    let html = "";
    if (overdue.length === 0) {
      html = `
        <div style="text-align: center; padding: 40px; background: #f9f9f9; border-radius: 10px; border: 2px dashed #ccc;">
          <p style="font-size: 40px; margin-bottom: 10px;"><i class="fa fa-check" style="color: #09a61cdd;"></i></p>
          <h4 style="color: #555;">No Overdue Books!</h4>
          <p style="color: #888;">All borrowed books are within their due dates.</p>
        </div>
      `;
    } else {
      let totalFines = 0;
      
      overdue.forEach(b => {
        const dueDate = new Date(b.dueDate);
        const daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
        const fine = daysLate * 50;
        totalFines += fine;
        
        html += `
          <div style="background: #ffe6e6; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ff4444;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p><strong><i class="fa fa-book"></i> ${b.bookTitle}</strong></p>
                <p><i class="fa fa-user"></i> Student: ${b.studentName || 'N/A'} (${b.studentMatric})</p>
                <p><i class="fa fa-phone"></i> Phone: ${b.studentPhone || 'N/A'}</p>
                <p><i class="fa fa-calendar"></i> Borrowed: ${new Date(b.borrowDate).toLocaleDateString()}</p>
                <p><i class="fa fa-clock-o"></i> Due: ${dueDate.toLocaleDateString()}</p>
              </div>
              <div style="text-align: center;">
                <p style="font-size: 30px; font-weight: bold; color: #ff4444;">${daysLate}</p>
                <p style="color: #888;">Days Late</p>
                <p style="color: #ff4444; font-weight: bold; font-size: 18px;">₦${fine}</p>
              </div>
            </div>
          </div>
        `;
      });
      
      html += `
        <div style="background: #ff4444; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 15px;">
          <p style="font-weight: bold; font-size: 16px;"><i class="fa fa-money"></i> Total Outstanding Fines: ₦${totalFines}</p>
        </div>
      `;
    }
    
    content.innerHTML = `
      <h3><i class="fa fa-exclamation-triangle"></i> Overdue Books (${overdue.length})</h3>
      ${html}
    `;
  } catch (error) {
    content.innerHTML = `
      <h3><i class="fa fa-exclamation-triangle"></i> Overdue Books</h3>
      <p style="color: red;"><i class="fa fa-times"></i> Failed to load overdue books.</p>
    `;
  }
}

// Load manage books from database
async function loadManageBooks() {
  const content = document.getElementById("sectionContent");
  
  content.innerHTML = `
    <h3><i class="fa fa-book"></i> Manage Books</h3>
    <p>Loading books...</p>
  `;

  try {
    const response = await fetch("https://localhost:7080/api/books");
    const books = await response.json();

    let bookRows = "";
    books.forEach(book => {
      bookRows += `
        <tr>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.course}</td>
          <td>${book.classification}</td>
          <td style="color: ${book.status === 'Available' ? '#09a61cdd' : '#ff4444'};">
            ${book.status}
          </td>
          <td>
            <button class="btn-blue" onclick='editBook(${book.id}, "${book.title.replace(/"/g, '\\"')}", "${book.author.replace(/"/g, '\\"')}", "${(book.isbn || '').replace(/"/g, '\\"')}", "${book.course}", "${book.classification}")' style="padding: 5px 12px; font-size: 12px; margin-right: 5px;">
              <i class="fa fa-edit"></i> Edit
            </button>
            <button class="btn-green" onclick="addCopy(${book.id})" style="padding: 5px 12px; font-size: 12px; margin-right: 5px;">
              <i class="fa fa-copy"></i> Copy
            </button>
            <button class="btn-red" onclick="deleteBook(${book.id})" style="padding: 5px 12px; font-size: 12px;">
              <i class="fa fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    });

    content.innerHTML = `
      <h3><i class="fa fa-book"></i> Manage Books</h3>
      <button class="btn-green" onclick="showAddBookForm()">
        <i class="fa fa-plus"></i> Add New Book
      </button>
      <br><br>
      <div id="addBookForm" style="display: none;"></div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Course</th>
            <th>Classification</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookRows}
        </tbody>
      </table>
    `;
  } catch (error) {
    content.innerHTML = `
      <h3><i class="fa fa-book"></i> Manage Books</h3>
      <p style="color: red;"><i class="fa fa-times"></i> Failed to load books. Make sure the backend is running.</p>
    `;
  }
}

// Show add book form with FULL LCC
function showAddBookForm() {
  document.getElementById("addBookForm").style.display = "block";
  document.getElementById("addBookForm").innerHTML = `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
      <h4>Add New Book</h4>
      <input type="text" id="newTitle" placeholder="Book Title" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
      <input type="text" id="newAuthor" placeholder="Author" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
      <input type="text" id="newISBN" placeholder="ISBN" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
      <select id="newCourse" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
        <option value="">Select Course</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Physics">Physics</option>
        <option value="Biology">Biology</option>
        <option value="Economics">Economics</option>
        <option value="Law">Law</option>
        <option value="Medicine">Medicine</option>
        <option value="Engineering">Engineering</option>
        <option value="Psychology">Psychology</option>
      </select>
      <select id="newClassification" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
        <option value="">Select Classification (Library of Congress)</option>
        <optgroup label="General Works">
          <option value="A">A - General Works</option>
          <option value="B">B - Philosophy, Psychology, Religion</option>
          <option value="C">C - History of Civilization</option>
          <option value="D">D - World History</option>
          <option value="E">E - American History</option>
          <option value="F">F - Local History</option>
        </optgroup>
        <optgroup label="Social Sciences">
          <option value="G">G - Geography, Anthropology</option>
          <option value="H">H - Social Sciences</option>
          <option value="J">J - Political Science</option>
          <option value="K">K - Law</option>
          <option value="L">L - Education</option>
        </optgroup>
        <optgroup label="Arts & Humanities">
          <option value="M">M - Music</option>
          <option value="N">N - Fine Arts</option>
          <option value="P">P - Language & Literature</option>
        </optgroup>
        <optgroup label="Science">
          <option value="Q">Q - Science (General)</option>
          <option value="QA76">QA76 - Computer Science</option>
          <option value="QA303">QA303 - Calculus</option>
          <option value="QA184">QA184 - Linear Algebra</option>
          <option value="QB">QB - Astronomy</option>
          <option value="QC">QC - Physics</option>
          <option value="QD">QD - Chemistry</option>
          <option value="QD251">QD251 - Organic Chemistry</option>
          <option value="QE">QE - Geology</option>
          <option value="QH">QH - Biology</option>
          <option value="QK">QK - Botany</option>
          <option value="QL">QL - Zoology</option>
          <option value="QM">QM - Human Anatomy</option>
          <option value="QP">QP - Physiology</option>
          <option value="QR">QR - Microbiology</option>
        </optgroup>
        <optgroup label="Medicine & Technology">
          <option value="R">R - Medicine</option>
          <option value="S">S - Agriculture</option>
          <option value="T">T - Technology (General)</option>
          <option value="TA">TA - Engineering (General)</option>
          <option value="TJ">TJ - Mechanical Engineering</option>
          <option value="TK">TK - Electrical Engineering</option>
          <option value="U">U - Military Science</option>
          <option value="V">V - Naval Science</option>
        </optgroup>
        <optgroup label="Bibliography">
          <option value="Z">Z - Bibliography, Library Science</option>
        </optgroup>
      </select>
      <button class="btn-green" onclick="addBook()">Save Book</button>
      <button class="btn-red" onclick="document.getElementById('addBookForm').style.display='none'">Cancel</button>
    </div>
  `;
}

// Add book to database
async function addBook() {
  const book = {
    title: document.getElementById("newTitle").value,
    author: document.getElementById("newAuthor").value,
    isbn: document.getElementById("newISBN").value,
    course: document.getElementById("newCourse").value,
    classification: document.getElementById("newClassification").value,
    status: "Available"
  };

  if (!book.title || !book.author || !book.course) {
    alert("Please fill in Title, Author, and Course!");
    return;
  }

  try {
    const response = await fetch("https://localhost:7080/api/books/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });

    const result = await response.json();
    
    if (result.success) {
      alert("Book added successfully!");
      loadManageBooks();
    } else {
      alert("Failed to add book.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
}

// Add copy of existing book
async function addCopy(id) {
  const confirmCopy = confirm("Add another copy of this book?");
  
  if (!confirmCopy) return;

  try {
    const response = await fetch(`https://localhost:7080/api/books/addcopy/${id}`, {
      method: "POST"
    });

    const result = await response.json();
    
    if (result.success) {
      alert(`${result.message}`);
      loadManageBooks();
    } else {
      alert("Failed to add copy.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
}

// Edit book - opens form pre-filled with FULL LCC
function editBook(id, title, author, isbn, course, classification) {
  const form = document.getElementById("addBookForm");
  form.style.display = "block";
  form.innerHTML = `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
      <h4>Edit Book (ID: ${id})</h4>
      <input type="text" id="newTitle" value="${title}" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
      <input type="text" id="newAuthor" value="${author}" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
      <input type="text" id="newISBN" value="${isbn}" placeholder="ISBN" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />
      <select id="newCourse" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
        <option value="${course}">${course} (current)</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Physics">Physics</option>
        <option value="Biology">Biology</option>
        <option value="Economics">Economics</option>
        <option value="Law">Law</option>
        <option value="Medicine">Medicine</option>
        <option value="Engineering">Engineering</option>
        <option value="Psychology">Psychology</option>
      </select>
      <select id="newClassification" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
        <option value="${classification}">${classification} (current)</option>
        <optgroup label="General Works">
          <option value="A">A - General Works</option>
          <option value="B">B - Philosophy, Psychology, Religion</option>
          <option value="C">C - History of Civilization</option>
          <option value="D">D - World History</option>
          <option value="E">E - American History</option>
          <option value="F">F - Local History</option>
        </optgroup>
        <optgroup label="Social Sciences">
          <option value="G">G - Geography, Anthropology</option>
          <option value="H">H - Social Sciences</option>
          <option value="J">J - Political Science</option>
          <option value="K">K - Law</option>
          <option value="L">L - Education</option>
        </optgroup>
        <optgroup label="Arts & Humanities">
          <option value="M">M - Music</option>
          <option value="N">N - Fine Arts</option>
          <option value="P">P - Language & Literature</option>
        </optgroup>
        <optgroup label="Science">
          <option value="Q">Q - Science (General)</option>
          <option value="QA76">QA76 - Computer Science</option>
          <option value="QA303">QA303 - Calculus</option>
          <option value="QA184">QA184 - Linear Algebra</option>
          <option value="QB">QB - Astronomy</option>
          <option value="QC">QC - Physics</option>
          <option value="QD">QD - Chemistry</option>
          <option value="QD251">QD251 - Organic Chemistry</option>
          <option value="QE">QE - Geology</option>
          <option value="QH">QH - Biology</option>
          <option value="QK">QK - Botany</option>
          <option value="QL">QL - Zoology</option>
          <option value="QM">QM - Human Anatomy</option>
          <option value="QP">QP - Physiology</option>
          <option value="QR">QR - Microbiology</option>
        </optgroup>
        <optgroup label="Medicine & Technology">
          <option value="R">R - Medicine</option>
          <option value="S">S - Agriculture</option>
          <option value="T">T - Technology (General)</option>
          <option value="TA">TA - Engineering (General)</option>
          <option value="TJ">TJ - Mechanical Engineering</option>
          <option value="TK">TK - Electrical Engineering</option>
          <option value="U">U - Military Science</option>
          <option value="V">V - Naval Science</option>
        </optgroup>
        <optgroup label="Bibliography">
          <option value="Z">Z - Bibliography, Library Science</option>
        </optgroup>
      </select>
      <button class="btn-green" onclick="updateBook(${id})">Update Book</button>
      <button class="btn-red" onclick="document.getElementById('addBookForm').style.display='none'">Cancel</button>
    </div>
  `;
}

// Update book in database
async function updateBook(id) {
  const book = {
    id: id,
    title: document.getElementById("newTitle").value,
    author: document.getElementById("newAuthor").value,
    isbn: document.getElementById("newISBN").value,
    course: document.getElementById("newCourse").value,
    classification: document.getElementById("newClassification").value,
    status: "Available"
  };

  if (!book.title || !book.author || !book.course) {
    alert("Please fill in Title, Author, and Course!");
    return;
  }

  try {
    const response = await fetch("https://localhost:7080/api/books/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });

    const result = await response.json();
    
    if (result.success) {
      alert("Book updated successfully!");
      loadManageBooks();
    } else {
      alert("Failed to update book.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
}

// Delete book
async function deleteBook(id) {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://localhost:7080/api/books/delete/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();
    
    if (result.success) {
      alert("Book deleted successfully!");
      loadManageBooks();
    } else {
      alert("Failed to delete book.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
}

// Load available books into issue dropdown
async function loadAvailableBooks() {
  try {
    const response = await fetch("https://localhost:7080/api/books");
    const books = await response.json();
    
    const availableBooks = books.filter(b => b.status === "Available");
    const dropdown = document.getElementById("issueBookId");
    
    if (dropdown) {
      dropdown.innerHTML = '<option value="">Select Book</option>';
      availableBooks.forEach(book => {
        dropdown.innerHTML += `<option value="${book.id}">${book.title} (${book.course})</option>`;
      });
    }
  } catch (error) {
    console.log("Error loading books");
  }
}

// Issue a book with overdue check
async function issueBook() {
  const bookSelect = document.getElementById("issueBookId");
  const matric = document.getElementById("issueMatric").value;
  const name = document.getElementById("issueName").value;
  const phone = document.getElementById("issuePhone").value;
  const bookId = parseInt(bookSelect.value);
  const bookTitle = bookSelect.selectedOptions[0]?.text || "";

  if (!matric || !name || !bookId) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const checkResponse = await fetch(`https://localhost:7080/api/borrowings/by-matric?matric=${encodeURIComponent(matric)}`);
    const borrowings = await checkResponse.json();
    
    const now = new Date();
    const overdue = borrowings.filter(b => {
      if (b.status !== "Not Returned" || !b.dueDate) return false;
      return new Date(b.dueDate) < now;
    });
    
    if (overdue.length > 0) {
      alert(`WARNING: This student has ${overdue.length} overdue book(s)!\n\nThey must return overdue books before borrowing new ones.`);
      return;
    }
  } catch (error) {
    console.log("Error checking overdue");
  }

  const borrowing = {
    studentMatric: matric,
    studentName: name,
    studentPhone: phone,
    bookId: bookId,
    bookTitle: bookTitle
  };

  try {
    const response = await fetch("https://localhost:7080/api/borrowings/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(borrowing)
    });

    const result = await response.json();
    
    if (result.success) {
      alert("Book issued successfully! Due in 14 days.");
      showSection('issue', document.querySelectorAll('.sidebar-menu li')[2]);
    } else {
      alert("Failed to issue book.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
}

// Search student records
async function searchStudent() {
  const matric = document.getElementById("searchMatric").value;
  
  if (!matric) {
    alert("Enter Matric Number!");
    return;
  }

  try {
    const response = await fetch(`https://localhost:7080/api/borrowings/by-matric?matric=${encodeURIComponent(matric)}`);
    const borrowings = await response.json();
    
    const notReturned = borrowings.filter(b => b.status === "Not Returned");
    const returned = borrowings.filter(b => b.status === "Returned");
    
    let html = `<h4>Records for: <strong>${matric}</strong></h4>`;
    
    html += `<h5 style="color: #ff4444; margin-top: 15px;">NOT RETURNED (${notReturned.length})</h5>`;
    if (notReturned.length === 0) {
      html += "<p>No borrowed books.</p>";
    } else {
      notReturned.forEach(b => {
        const dueDate = new Date(b.dueDate);
        const now = new Date();
        const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        html += `
          <div style="background: ${daysLeft < 0 ? '#ffe6e6' : '#fff3cd'}; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid ${daysLeft < 0 ? '#ff4444' : '#ffc107'};">
            <p><strong><i class="fa fa-book"></i> ${b.bookTitle}</strong></p>
            <p><i class="fa fa-calendar"></i> Borrowed: ${new Date(b.borrowDate).toLocaleDateString()}</p>
            <p><i class="fa fa-clock-o"></i> Due: ${dueDate.toLocaleDateString()} 
               <span style="color: ${daysLeft < 0 ? 'red' : 'green'};">
                 (${daysLeft < 0 ? Math.abs(daysLeft) + ' days LATE' : daysLeft + ' days left'})
               </span>
            </p>
            <p><i class="fa fa-phone"></i> Phone: ${b.studentPhone || 'N/A'}</p>
            <p><i class="fa fa-user"></i> Name: ${b.studentName || 'N/A'}</p>
            ${daysLeft < 0 ? `<p style="color: red;"><i class="fa fa-money"></i> Fine: ₦${Math.abs(daysLeft) * 50}</p>` : ''}
          </div>
        `;
      });
    }
    
    html += `<h5 style="color: #09a61cdd; margin-top: 15px;">RETURNED (${returned.length})</h5>`;
    if (returned.length === 0) {
      html += "<p>No returned books.</p>";
    } else {
      returned.forEach(b => {
        html += `
          <div style="background: #e8f5e9; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #09a61cdd;">
            <p><strong><i class="fa fa-book"></i> ${b.bookTitle}</strong></p>
            <p><i class="fa fa-calendar"></i> Borrowed: ${new Date(b.borrowDate).toLocaleDateString()}</p>
            <p><i class="fa fa-check"></i> Returned: ${new Date(b.returnDate).toLocaleDateString()}</p>
            <p><i class="fa fa-phone"></i> Phone: ${b.studentPhone || 'N/A'}</p>
            <p><i class="fa fa-user"></i> Name: ${b.studentName || 'N/A'}</p>
            ${b.fine > 0 ? `<p><i class="fa fa-money"></i> Fine paid: ₦${b.fine}</p>` : '<p><i class="fa fa-check"></i> No fine</p>'}
          </div>
        `;
      });
    }
    
    document.getElementById("studentResult").innerHTML = html;
  } catch (error) {
    document.getElementById("studentResult").innerHTML = "<p style='color: red;'>Error loading data.</p>";
  }
}

// Logout
function logout() {
  window.location.href = "http://127.0.0.1:5500/Library Management System.html";
}